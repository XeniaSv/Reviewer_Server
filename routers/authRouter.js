const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register',
    body('username').isString(),
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    authController.register);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', authController.refresh);

module.exports = router;