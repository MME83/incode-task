const { serviceAuth } = require('../services');

module.exports = {
    checkAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.get('Authorization');

            if (!accessToken) {
                return res.status(401).send({ error: 'No token' });
            }

            const tokenFromBd = await serviceAuth.verifyToken(accessToken);

            req.userLogged = tokenFromBd.users;

            next();
        } catch (err) {
            next(err);
        }
    }
};
