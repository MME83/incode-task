const {
    serviceUser
} = require('../services');

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await serviceUser.getUsers();

        if (!users || users.length < 1) {
            return res.status(404).send({ message: 'No users found' });
        }

        return res.status(200).json(users);
    },
    
    createUser: async (req, res) => {
        const user = await serviceUser.createUser(req.body);

        if (!user) {
            return res.status(409).send({ message: 'Cant\'t create new user, try again' });
        }

        return res.status(201).send({ 
            message: `${user.role} has created`,
            user
        });
    },
};
