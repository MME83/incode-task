const { Users } = require('../models');
const { hashPass } = require('../util');

const getUsers = async () => {
    const users = await Users.find();

    return users;
};

const createUser = async (bodyData) => {
    const { email, name, password, role, boss } = bodyData;  

    const hashedPass = await hashPass(password);
    const user = new Users({
        email,
        name,
        password: hashedPass,
        role,
        boss: boss || null
    });
};

module.exports = {
    getUsers,
};
