const { serviceUser, serviceAuth } = require('../services');
const { passwordUtil } = require('../util');


module.exports = {

    signUpUser: async (req, res) => {
        const user = await serviceUser.createUser(req.body);

        if (!user) {
            return res.status(409).send({ message: 'Can\'t register new User, try again' });
        }

        return res.status(201).json(user);
    },

    loginUser: async (req, res) => {
        const { login, password } = req.body;

        const user = await serviceUser.getUserByLogin(login);

        if (!user) return res.status(404).send({ error: 'Bad login or password' });

        const matchedPass = await passwordUtil.matchPass(password, user.password);
        
        if (!matchedPass) return res.status(404).send({ error: 'Bad login or password' });

        req.user = user;

        const tokens = await serviceAuth.generateSaveTokenPair(req.user._id);

        return res.status(200).json({ user, ...tokens });
    },

    logout: async (req, res) => {
        let token = req.get('Authorization');
        token = token.replace('Bearer ', '');

        await serviceAuth.deleteToken(token);

        res.status(204).send('OK');
    },

    refreshToken: async (req, res) => {
        let refresh_token = req.get('Authorization');
        const bearer = 'Bearer ';
        refresh_token = refresh_token.replace(bearer, '');

        const { userLogged } = req;

        const tokenPair = await serviceAuth.generateTokenPair();
        await serviceAuth.refreshToken(refresh_token, tokenPair);
        
        return res.status(200).json({ 
            user: userLogged, 
            access_token: bearer + tokenPair.access_token,
            refresh_token: bearer + tokenPair.refresh_token
        });
    }
};
