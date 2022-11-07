const router = require('express').Router();
const { controllerUser } = require('../controllers');
const { middlewareAuth, middlewareRole, middlewareUser } = require('../middlewares');
const { ADMIN, BOSS, USER } = require('../common/roles');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @openapi
 * '/users':
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - User
 *    summary: Get All users from DB. Allow only with administrator role.
 *    description: Get all users from DB, using login with Bearer tokens.
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseAllUserSchema'
 *            examples:
 *              simpleExample:
 *                summary: An example of output user data
 *                description: Cand response with User request by Id
 *                value:
 *                  _id: 6365912baf5e364ad8080b3c
 *                  password: asdsdfasdfsf345354dvdv*hggb
 *                  email: jondou@admin.com
 *                  name: John Dou
 *                  roles: manager
 *                  boss: 6365912baf5e364ad8080b3c | null
 *                  subordinates: ['id1', 'id2', ..., 'idN']
 *                  createdAt: 2022-11-04T16:22:59.679Z
 *                  updatedAt: 2022-11-04T16:22:59.679Z
 *                  __v: 0
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

/**
 * @openapi
 * '/users/{user_id}':
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *    - User
 *    summary: Get user data from DB by Id
 *    description: Admin can see any user. Boss can see only himself and any of his subordinates recursively by Id. Regular user can see only himself.
 *    parameters:
 *    - name: user_id
 *      in: path
 *      description: user id
 *      required: true
 *      schema:
 *        type: string
 *        minLength: 24
 *        maxLength: 24
 *        default: '636680c0911ebbcbf29656d6'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/UserResponseRecursiveSchema'
 *                - $ref: '#/components/schemas/UserResponseSchema'
 *            examples:
 *              recursivelyExample:
 *                summary: An example of output user data recursively
 *                description: Cand response with Admin and Manager/Boss request by Id
 *                value:
 *                  _id: 6365912baf5e364ad8080b3c
 *                  email: jondou@admin.com
 *                  name: John Dou
 *                  roles: manager
 *                  boss: 6365912baf5e364ad8080b3c
 *                  subordinates: [{}, {}, ..., {N subordinate}]
 *              simpleExample:
 *                summary: An example of output user data
 *                description: Cand response with User request by Id
 *                value:
 *                  _id: 6365912baf5e364ad8080b3c
 *                  email: jondou@admin.com
 *                  name: John Dou
 *                  roles: manager
 *                  boss: 6365912baf5e364ad8080b3c
 *                  subordinates: ['id1', 'id2', ..., 'idN']
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
 *    description: Anyone can change himself data except 'subordinates', except 'roles' & 'boss' for regular user. Admin - can update any users. Boss can change boss for his subordinates.
 *    parameters:
 *    - name: user_id
 *      in: path
 *      description: user id that updates
 *      required: true
 *      schema:
 *        type: string
 *        minLength: 24
 *        maxLength: 24
 *        default: '636680c0911ebbcbf29656d6'
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *              - $ref: '#/components/schemas/UpdInputByAdminSchema'
 *              - $ref: '#/components/schemas/UpdInputByBossSchema'
 *              - $ref: '#/components/schemas/UpdInputByUserSchema'
 *          examples:
 *            adminExample:
 *              summary: An example of update user data by Administrator
 *              description: Can update himself and any user
 *              value:
 *                email: jondou@admin.com
 *                name: John Dou
 *                password: JohnDou1$
 *                roles: manager | user | administrator
 *                boss: 6365912baf5e364ad8080b3c
 *            managerExampleForSubordinate:
 *              summary: An example of update user data by Boss
 *              description: Can update only his subordinates
 *              value:
 *                email: jondou@admin.com
 *                name: John Dou
 *                password: JohnDou1$
 *                roles: manager | user
 *                boss: 6365912baf5e364ad8080b3c
 *            managerExample:
 *              summary: An example of update Boss by himself
 *              description: Can update himself
 *              value:
 *                email: jondou@admin.com
 *                name: John Dou
 *                password: JohnDou1$
 *            userExample:
 *              summary: An example of update User by himself
 *              description: Can update himself
 *              value:
 *                email: jondou@admin.com
 *                name: John Dou
 *                password: JohnDou1$
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserUpdatedResponseSchema'
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
 *        minLength: 24
 *        maxLength: 24
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