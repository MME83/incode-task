const { ADMIN } = require('../common/roles');
const { Users } = require('../models');
const { hashPass } = require('../util');

module.exports = {
    createAdmin: async (login, password) => {
        const isAdminExist = await Users.findOne({ roles: ADMIN });

        if (isAdminExist) return process.stdout.write('\n...admin is already exists in DB\n\n');

        const hashed_pass = await hashPass(password);
        
        await Users.create({
            name: 'Administrator',
            email: login,
            password: hashed_pass,
            roles: ADMIN
        });

        return process.stdout.write('\n...first admin has created in DB\n\n');
    }
};
