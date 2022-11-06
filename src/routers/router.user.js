const router = require('express').Router();
const { controllerUser } = require('../controllers');
const { middlewareAuth, middlewareRole } = require('../middlewares');
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
    middlewareRole.checkBodyProps,
    wrapAsync(controllerUser.createUser)
);

router.get(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareRole.checkRoleAndIdAccess(),
    wrapAsync(controllerUser.getUserById)
);

router.patch(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareRole.checkBodyProps,
    wrapAsync(controllerUser.updateUser)
);

router.delete(
    '/:user_id',
    middlewareAuth.checkAccessToken,
    middlewareRole.checkUserRoles([ADMIN]),
    wrapAsync(controllerUser.deleteUser)
);

module.exports = router;