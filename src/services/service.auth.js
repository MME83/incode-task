const jwt = require('jsonwebtoken');
const { SECRET_ACCESS, SECRET_REFRESH } = require('../common/config');
const { Tokens } = require('../models');

module.exports = {
    generateTokenPair: async () => {
        const access_token = jwt.sign({}, SECRET_ACCESS, { expiresIn: '300m' });
        const refresh_token = jwt.sign({}, SECRET_REFRESH, { expiresIn: '30d' });

        return { access_token, refresh_token };
    },

    generateSaveTokenPair: async (user_id) => {
        const access_token = jwt.sign({}, SECRET_ACCESS, { expiresIn: '300m' });
        const refresh_token = jwt.sign({}, SECRET_REFRESH, { expiresIn: '30d' });
        const tokenPair = { access_token, refresh_token };

        const savedTokens = await Tokens.create({ ...tokenPair, users: user_id });

        if (!savedTokens) {
            throw new Error('Can\'t create tokens pair, try again...')
        }

        process.stdout.write('\n ...new tokens pair created in BD \n\n');

        return tokenPair;
    },

    verifyToken: async (token, tokenType = 'access') => {
        try {
            const secret = tokenType === 'access' ? SECRET_ACCESS : SECRET_REFRESH;
            jwt.verify(token, secret);

            const tokenKey = tokenType === 'access' ? 'access_token' : 'refresh_token';
            const tokenFromDb = await Tokens.findOne({ [tokenKey]: token }).populate('users');

            if (!tokenFromDb) throw new Error('Invalid token');

            return tokenFromDb;
        } catch (err) {
            throw new Error('Unauthorised, invalid token');
        }
    },

    deleteToken: async (TokensProp = 'access_token', tokenOrId) => {
        if (TokensProp === 'access_token') {
            const deletedToken = await Tokens.deleteOne({ [TokensProp]: tokenOrId });

            if (!deletedToken) throw new Error('Can\'t delete, token hasn\'t been found');

            return true;
        }

        const deletedToken = await Tokens.deleteMany({ [TokensProp]: tokenOrId});

        if (!deletedToken) throw new Error('Can\'t delete, hasn\'t found any token');

        return true;
    },

    refreshToken: async (refresh_token, tokenPair) => {
        const newPair = await Tokens.findOneAndUpdate({ refresh_token }, tokenPair);

        if (!newPair) throw new Error('Token in DB hasn\'t been found');

        return true;
    }
};
