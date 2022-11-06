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

router.patch(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareUser.validateId,
    middlewareUser.validateUpdateUser,
    middlewareRole.checkBodyProps,
    wrapAsync(controllerUser.updateUser)
);

router.delete(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareUser.validateId,
    middlewareRole.checkUserRoles([ADMIN]),
    wrapAsync(controllerUser.deleteUser)
);

module.exports = router;