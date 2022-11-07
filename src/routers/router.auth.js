const router = require('express').Router();
const { controllerAuth } = require('../controllers');
const { middlewareAuth, middlewareUser } = require('../middlewares');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @openapi
 * '/auth/signup':
 *  post:
 *    tags:
 *    - Auth
 *    summary: New user registration
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AuthSignUpInput'     
 *    responses:
 *      201:
 *        description: Success created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserCreatedResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
    '/signup',
    middlewareUser.validateSignUp,
    wrapAsync(controllerAuth.signUpUser)
);

router.post(
    '/login',
    middlewareUser.validateLogin,
    wrapAsync(controllerAuth.loginUser)
);

router.post(
    '/logout',
    middlewareAuth.checkAccessToken,
    wrapAsync(controllerAuth.logout)
);

router.post(
    '/refresh',
    middlewareAuth.checkRefreshToken,
    wrapAsync(controllerAuth.refreshToken)
);

module.exports = router;
