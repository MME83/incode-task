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
            console.error(`Error: boss/manager with id:${boss} hasn't found or bad role`);
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
   
    const { email, password, name, roles, boss } = req.body;

    // check if boss id exists in DB and boss has manager role
    if (boss) {
        const isBoss = await Users.findOne({$and: [{ _id: boss }, { roles: BOSS }]});

        if (!isBoss) {
            console.error(`Error: boss/manager with id:${boss} has not found or bad role`);
            throw new Error(`bad boss id:${boss} or value of prop "roles"`);
        }
    }

    let updateUserData = {
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

    const subIds = [];

    if (req.userLogged.roles === BOSS && boss) {
        const { _id } = req.userLogged;
        const loggedUser = await getUserById(_id);

        subIds = helper.getPropValues(loggedUser, '_id');

        if (!subIds.includes(id)) {
            throw new Error(`Forbidden, user with id:${id} isn't your subordinate`);
        }

        if (!subIds.includes(updateUserData.boss)) {
            throw new Error(`Forbidden, manager with id:${updateUserData.boss} isn't your subordinate`);
        }
    }

    let userForUpdate = null;

    if ([ADMIN, BOSS].includes(req.userLogged.roles)) {
        userForUpdate = await Users.updateOne({ _id: id }, '_id roles boss');

        if (!userForUpdate) {
            throw new Error(`No user with id:${id}`);
        }
    }

    const updatedUser = await Users.findByIdAndUpdate(id, updateUserData, {
        new: true,
        runValidators: true
    });

    if (updatedUser) {
        if (updateUserData.boss) {
            await Users.updateOne({ _id: updateUserData.boss }, { $push: { subordinates: updatedUser._id } });

            if (userForUpdate && userForUpdate.boss) {
                await Users.updateOne(
                    { _id: userForUpdate.boss }, 
                    { $pull: { subordinates: userForUpdate._id } }, 
                    { multi: true }
                );
            }
        }

        process.stdout.write(`\n ...user with id:${id} has updated \n\n`);
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
