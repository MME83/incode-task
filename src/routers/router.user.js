const router = require('express').Router();
const { controllerUser } = require('../controllers');
const { middlewareAuth, middlewareRole, middlewareUser } = require('../middlewares');
const { ADMIN, BOSS, USER } = require('../common/roles');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
    '/',
    middlewareAuth.checkAccessToken,
    middlewareRole.checkUserRoles([ADMIN]),
    wrapAsync(controllerUser.getAllUsers)
);

router.post(
    '/',
    middlewareAuth.checkAccessToken,
    middlewareRole.checkUserRoles([ADMIN, BOSS]),
    middlewareUser.validateCreateUser,
    middlewareRole.checkBodyProps,
    wrapAsync(controllerUser.createUser)
);

router.get(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareUser.validateId,
    middlewareRole.checkRoleAndIdAccess(),
    wrapAsync(controllerUser.getUserById)
);

/**
 * @openapi
 * '/users/{user_id}':
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - User
 *    summary: Update user data in DB
 *    description: Anyone can change himself data except 'subordinates', except 'roles' & 'boss' for regular user, except. Admin - can update any users, Boss 
 *    parameters:
 *    - name: user_id
 *      in: path
 *      description: user id that updates
 *      required: true
 *      schema:
 *        type: string
 *        minimum: 24
 *        maximum: 24
 *        default: '636680c0911ebbcbf29656d6'       
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Error server
 *      409:
 *        description: Conflict
 *      403:
 *        description: Forbidden
 *      401:
 *        description: Unauthorised
 *      400:
 *        description: Bad request
 */
router.patch(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareUser.validateId,
    middlewareUser.validateUpdateUser,
    middlewareRole.checkBodyProps,
    wrapAsync(controllerUser.updateUser)
);

/**
 * @openapi
 * '/users/{user_id}':
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - User
 *    summary: Delete user from DB
 *    description: Only Administrator can delete user
 *    parameters:
 *    - name: user_id
 *      in: path
 *      required: true
 *      schema:
 *        type: string
 *        minimum: 24
 *        maximum: 24
 *        default: '636680c0911ebbcbf29656d6'       
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Error server
 *      409:
 *        description: Conflict
 *      401:
 *        description: Unauthorised
 *      400:
 *        description: Bad request
 */
router.delete(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareUser.validateId,
    middlewareRole.checkUserRoles([ADMIN]),
    wrapAsync(controllerUser.deleteUser)
);

module.exports = router;