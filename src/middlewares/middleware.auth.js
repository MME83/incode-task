const { serviceAuth } = require('../services');

module.exports = {
    checkAccessToken: async (req, res, next) => {
        try {
            let accessToken = req.get('Authorization');

            if (!accessToken) {
                return res.status(401).send({ error: 'No token' });
            }

            accessToken = accessToken.replace('Bearer ', '');

            const tokenFromBd = await serviceAuth.verifyToken(accessToken);

            req.userLogged = tokenFromBd.users;

            next();
        } catch (err) {
            return res.status(401).send({ error: err.message });
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            let refreshToken = req.get('Authorization');

            if (!refreshToken) {
                return res.status(401).send({ error: 'No token' });
            }

            refreshToken = refreshToken.replace('Bearer ', '');

            const tokenFromBd = await serviceAuth.verifyToken(refreshToken, 'refresh_token');

            req.userLogged = tokenFromBd.users;
            
            next();
        } catch (err) {
            return res.status(401).send({ error: err.message });
        }
    }
};
