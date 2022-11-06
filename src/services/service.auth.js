const jwt = require('jsonwebtoken');
const { SECRET_ACCESS, SECRET_REFRESH } = require('../common/config');
const { Tokens } = require('../models');

module.exports = {
    generateTokenPair: async (user_id) => {
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
    }
};
