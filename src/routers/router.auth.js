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
 *      500:
 *        description: Error server
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

/**
 * @openapi
 * '/auth/login':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Login
 *    description: this operation generate Bearer tokens - access and refresh pair
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AuthLoginInput'     
 *    responses:
 *      200:
 *        description: Success created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      500:
 *        description: Error server
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
    '/login',
    middlewareUser.validateLogin,
    wrapAsync(controllerAuth.loginUser)
);

/**
 * @openapi
 * '/auth/logout':
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - Auth
 *    summary: Logout     
 *    responses:
 *      204:
 *        description: Ok
 *      500:
 *        description: Error server
 *      409:
 *        description: Conflict
 *      401:
 *        description: Unauthorised
 *      400:
 *        description: Bad request
 */
router.post(
    '/logout',
    middlewareAuth.checkAccessToken,
    wrapAsync(controllerAuth.logout)
);

/**
 * @openapi
 * '/auth/refresh':
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - Auth
 *    summary: Refresh token - create new token pair
 *    description: put refresh_token to header - Authorize
 *    responses:
 *      200:
 *        description: Success created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      500:
 *        description: Error server
 *      409:
 *        description: Conflict
 *      401:
 *        description: Unauthorised
 */
router.post(
    '/refresh',
    middlewareAuth.checkRefreshToken,
    wrapAsync(controllerAuth.refreshToken)
);

module.exports = router;
