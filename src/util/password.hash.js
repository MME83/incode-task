const bcrypt = require('bcryptjs');
const { SALT } = require('../common/config');

const hashPass = async(password) => {
    const hashedPass = await bcrypt.hash(password, +SALT);

    return hashedPass;
};

module.exports = hashPass;