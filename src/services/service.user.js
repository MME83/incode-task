const { Users } = require('../models');
const { passwordUtil } = require('../util');
const { BOSS, ADMIN } = require('../common/roles');
const { USERMS } = require('../common/ex.keys');
const { helper } = require('../util');

const createStrOfExKeys = (arrStr) => {
    return '-' + arrStr.toString().replace(/,/g, ' -');
};

// takes a collection and a document id, returns the document fully nested with its subordinates
const populateSubordinates = async (collection, _id, keyString, strOfExKeys) => 
    await collection.findOne({_id}, strOfExKeys)
    .then(function(obj) {
        if (obj[keyString].length < 1) return obj;

        return Promise.all(obj[keyString].map(id => 
            populateSubordinates(collection, id, keyString, strOfExKeys)))
            .then(subordinates => Object.assign(obj, { subordinates }));
});

const getUsers = async () => {
    const users = await Users.find();

    return users;
};

const createUser = async (bodyData) => {
    const { email, name, password, roles, boss } = bodyData;  

    if (boss) {
        const isBoss = await Users.findOne({$and: [{ _id: boss }, { roles: BOSS }]});

        if (!isBoss) {
            console.error(`Error: boss/manager with id:${boss} has not found or bad role`);
            throw new Error(`bad boss id:${boss} or key "roles"`);
        }
    }

    const hashedPass = await passwordUtil.hashPass(password);
    const user = new Users({
        email,
        name,
        password: hashedPass,
        roles,
        boss: boss || null
    });

    const savedUser = await user.save();

    if (savedUser) {
        if (savedUser.boss) {
            await Users.updateOne({ _id: savedUser.boss }, { $push: { subordinates: savedUser._id } });
        }

        process.stdout.write(`\n ...new ${savedUser.roles} user has created \n\n`);
    }
    
    return savedUser;
};

const getUserByLogin = async (login) => {
    const user = await Users.findOne({ email: login });

    return user;
};

const getUserById = async (id) => {
    //const user = await Users.findOne({ _id: id }).populate('subordinates');

    let excludeKeys = [USERMS.pass, USERMS.ver, USERMS.created, USERMS.updated];
    excludeKeys = createStrOfExKeys(excludeKeys);

    const user = await populateSubordinates(Users, id, 'subordinates', excludeKeys);

    return user;
};

const updateUser = async (id, req) => {
    const { _id } = req.userLogged;
    const user = await getUserById(_id);

    if (!user) {
        throw new Error(`user with id:${id} doesn't exist`);
    }

    const { user_id, email, password, name, roles, boss } = req.body;

    if (boss) {
        const isBoss = await Users.findOne({$and: [{ _id: boss }, { roles: BOSS }]});

        if (!isBoss) {
            console.error(`Error: boss/manager with id:${boss} has not found or bad role`);
            throw new Error(`bad boss id:${boss} or key "roles"`);
        }
    }

    let updateUserData = {
        user_id,
        email,
        password,
        name,
        roles,
        boss
    };

    for (let key of Object.keys(updateUserData)) {
        if (updateUserData[key] === '' || 
            updateUserData[key] === null || 
            updateUserData[key] === undefined) {
                delete updateUserData[key];
        }
    }

    const bossSubIds = [];

    if (boss && user_id && user.roles === BOSS) {
        bossSubIds = helper.getPropValues(user, '_id');

        if (!bossSubIds.includes[user_id]) {
            throw new Error(`Forbidden, user with id:${user_id} is not your subordinate`);
        }
    }

    const iD = user_id || id;

    const updatedUser = await Users.findByIdAndUpdate(iD, updateUserData, {
        new: true,
        runValidators: true
    });

    if (updatedUser && boss && user.roles === BOSS) {
        if (updateUserData.boss) {
            await Users.updateOne({ _id: updateUserData.boss }, { $push: { subordinates: updatedUser._id } });
        }

        if (user.boss) {
            await Users.updateOne({ _id: user.boss }, { $pull: { subordinates: user._id } }, { multi: true })
        }

        process.stdout.write('\n ...user has updated \n\n');
    }

    return updatedUser;
};

const deleteUser = async (id) => {
    const deletedUser = await Users.findByIdAndDelete(id);

    if (deletedUser) {
        if (deletedUser.boss) {
            await Users.updateOne({ _id: deletedUser.boss }, { $pull: { subordinates: deletedUser._id } }, { multi: true } );
        }

        if (deletedUser.subordinates.length > 1 ) {
            await Users.updateMany(
                { _id: { $in: deletedUser.subordinates} }, 
                { $set: { boss: null } }, 
                { multi: true }
            );
        }
    }
};

module.exports = {
    getUsers,
    createUser,
    getUserByLogin,
    getUserById,
    updateUser,
    deleteUser
};
