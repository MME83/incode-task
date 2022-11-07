const Joi = require('joi');
const RegExp = require('../common/regex.enum');
const roles = require('../common/roles');

module.exports = {
    validateReg: Joi.object({
        email: Joi.string().trim().regex(RegExp.EMAIL_REGEXP).required(),
        name: Joi.string().trim().min(3).max(40).required(),
        password: Joi.string().trim().min(8).max(30).regex(RegExp.PASS_REGEXP).required(),
        roles: Joi.string().valid(roles.BOSS, roles.USER).required()
    }),

    validateLogin: Joi.object({
        login: Joi.string().trim().regex(RegExp.EMAIL_REGEXP).required(),
        password: Joi.string().trim().min(8).max(30).regex(RegExp.PASS_REGEXP).required()
    }),

    validateCreatUser: Joi.object({
        email: Joi.string().trim().regex(RegExp.EMAIL_REGEXP).required(),
        name: Joi.string().trim().min(3).max(40).required(),
        password: Joi.string().trim().min(8).max(30).regex(RegExp.PASS_REGEXP).required(),
        roles: Joi.string().valid(roles.ADMIN, roles.BOSS, roles.USER),
        boss: Joi.string().hex().length(24)
    }),

    validateUpdateUser: Joi.object({
        email: Joi.string().trim().regex(RegExp.EMAIL_REGEXP),
        name: Joi.string().trim().min(3).max(40),
        password: Joi.string().trim().min(8).max(30).regex(RegExp.PASS_REGEXP),
        roles: Joi.string().valid(roles.ADMIN, roles.BOSS, roles.USER),
        boss: Joi.string().trim().hex().length(24)
    }),

    validateId: Joi.object({
        user_id: Joi.string().trim().hex().length(24).required()
    })
};
