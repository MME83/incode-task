const { Users } = require('../models');
const { hashPass } = require('../util');
const { BOSS } = require('../common/roles');

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

    const hashedPass = await hashPass(password);
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

const getUserById = async (id) => {
    const user = await Users.findOne({ _id: id });

    return user;
};

const updateUser = async (id, bodyData) => {
    const user = await getUserById(id);

    if (!user) {
        throw new Error(`user with id:${id} hasn't found`);
    }

    const { email, name, password, roles, boss } = bodyData;

    if (boss) {
        const isBoss = await Users.findOne({$and: [{ _id: boss }, { roles: BOSS }]});

        if (!isBoss) {
            console.error(`Error: boss/manager with id:${boss} has not found or bad role`);
            throw new Error(`bad boss id:${boss} or key "roles"`);
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
        if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    }

    const updatedUser = await Users.findByIdAndUpdate(id, updateUserData, {
        new: true,
        runValidators: true
    });

    if (updatedUser) {
        if (updateUserData.boss) {
            await Users.updateOne({ _id: updateUserData.boss }, { $push: { subordinates: updatedUser._id } });
        }

        if (user.boss) {
            await Users.updateOne({ _id: user.boss }, { $pull: { subordinates: user._id } }, { multi: true })
        }

        process.stdout.write('\n ...user has updated \n\n');
    }
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
    updateUser,
    deleteUser
};
