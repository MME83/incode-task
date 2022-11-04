const { Users } = require('../models')

const getUsers = async () => {
    const users = await Users.find();

    return users;
}

module.exports = {
    getUsers,
};
