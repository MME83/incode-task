const { serviceUser, serviceAuth } = require('../services');
const { passwordUtil } = require('../util');


module.exports = {

    loginUser: async (req, res) => {
        const { login, password } = req.body;

        const user = await serviceUser.getUserByLogin(login);

        if (!user) return res.status(404).send({ error: 'Bad login or password' });

        const matchedPass = await passwordUtil.matchPass(password, user.password);
        
        if (!matchedPass) return res.status(404).send({ error: 'Bad login or password' });

        req.user = user;

        const tokens = await serviceAuth.generateTokenPair(req.user._id);

        return res.status(200).json({ user, ...tokens });
    }
};
