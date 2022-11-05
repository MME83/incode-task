const bcrypt = require('bcryptjs');
const { SALT } = require('../common/config');

const hashPass = async (password) => {
    const hashedPass = await bcrypt.hash(password, +SALT);

    return hashedPass;
};

const matchPass = async (password, passFromDb) => {
    const passMatched = await bcrypt.compare(password, passFromDb);

    return passMatched ? true : false;
}

module.exports = { hashPass, matchPass };
