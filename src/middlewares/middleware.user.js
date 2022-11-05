const { serviceUser } = require('../services');

module.exports = {
    isUserExist: async (req, res, next) => {
        const { login } = req.body;

        const user = await serviceUser.getUserByLogin(login);

        if (!user) return res.status(404).send({ error: 'bad login or password' });

        
    } 
};
