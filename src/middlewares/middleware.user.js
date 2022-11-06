const { validateBody } = require('../util');

module.exports = {
    validateSignUp: async (req, res, next) => {
        try {
            const bodyData = await validateBody.validateReg.validateAsync(req.body);

            req.body = bodyData;

            next();
        } catch(err) {
            return res.status(400).send({ error: `${err.details[0].message}`});
        }
    },

    validateLogin: async (req, res, next) => {
        try {
            const bodyData = await validateBody.validateLogin.validateAsync(req.body);

            req.body = bodyData;

            next();
        } catch(err) {
            return res.status(400).send({ error: `${err.details[0].message}`});
        }
    },

    validateCreateUser: async (req, res, next) => {
        try {
            const bodyData = await validateBody.validateCreatUser.validateAsync(req.body);

            req.body = bodyData;

            next();
        } catch(err) {
            return res.status(400).send({ error: `${err.details[0].message}`});
        }
    },

    validateId: async (req, res, next) => {
        try {
            await validateBody.validateId.validateAsync(req.params);

            next();
        } catch(err) {
            return res.status(400).send({ error: `${err.details[0].message}`});
        }
    },

    validateUpdateUser: async (req, res, next) => {
        try {
            await validateBody.validateUpdateUser.validateAsync(req.params);

            next();
        } catch(err) {
            return res.status(400).send({ error: `${err.details[0].message}`});
        }
    }
};
