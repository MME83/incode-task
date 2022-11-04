const router = require('express').Router();
const userRoles = require('../common/roles');
const { controllerUser } = require('../controllers');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
    '/',
    //middlewareRoles.checkUserRole([userRoles.ADMIN, userRoles.BOSS]),
    wrapAsync(controllerUser.getAllUsers)
);

router.post(
    '/',
    //middlewareRoles.checkUserRole([userRoles.ADMIN, userRoles.BOSS]),
    controllerUser.createUser
);
/*
router.get(
    '/:user_id',
    //middlewareRoles.checkUserAccess(userRoles.USER),
    controllerUser.getUserById
);

router.patch(
    '/:user_id',
    //middlewareRoles.checkUserAccess(userRoles.USER),
    controllerUser.updateUser
);

router.delete(
    '/:user_id',
    //middlewareRoles.checkUserRole([userRoles.ADMIN, userRoles.BOSS]),
    controllerUser.deleteUser
);
*/
module.exports = router;