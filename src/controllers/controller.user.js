const {
    serviceUser
} = require('../services');

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await userService.getAll();

        if (!users || users.length < 1) {
            return res.status(404).send({ message: 'No users found' });
        }

        return res.status(200).json(users);
    },
};
