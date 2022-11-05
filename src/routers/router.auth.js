const router = require('express').Router();
const { controllerAuth } = require('../controllers');
const { middlewareAuth } = require('../middlewares');

const wrapAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
    '/login',
    wrapAsync(controllerAuth.loginUser)
);

module.exports = router;
