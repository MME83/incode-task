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
        try {
            const user = await serviceUser.createUser(req.body);

            if (!user) {
                return res.status(409).send({ message: 'Cant\'t create new user, try again' });
            }

            return res.status(201).send({ 
                message: `${user.roles} has created`,
                user
            });
        } catch (err) {
            return res.status(409).send({ error: err.message });
        }
    },

    getUserById: async (req, res) => {
        const { user_id } = req.params;

        const user = await serviceUser.getUserById(user_id);

        if (!user) {
            return res.status(409).send({ message: `User with id:${req.params.user_id} hasn't found` });
        }

        return res.status(200).json(user);
    },

    updateUser: async (req, res) => {
        try {
            const { user_id } = req.params;
            const user = await serviceUser.updateUser(user_id, req);

            if (!user) {
                return res.status(409).send({ message: 'Cant\'t update new user, try again' });
            }

            return res.status(200).send({ 
                message: `user with id:${user._id} has updated`,
                user
            });
        } catch (err) {
            return res.status(409).send({ error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { user_id } = req.params;

            await serviceUser.deleteUser(user_id);

            return res.status(200).send({ message: `User with id: "${user_id}" has deleted` });
        } catch(err) {
            return res.status(409).send({ error: err.message });
        }
    },
};
