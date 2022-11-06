const router = require('express').Router();
const { controllerAuth } = require('../controllers');
const { middlewareAuth, middlewareUser } = require('../middlewares');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

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
