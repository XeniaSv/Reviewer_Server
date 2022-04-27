const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/:id',
    authMiddleware,
    userController.updateUser);

router.delete('/:id',
    authMiddleware,
    userController.deleteUser);

router.get('/:id',
    authMiddleware,
    userController.findUser);

router.get('/',
    authMiddleware,
    userController.getUsers);

module.exports = router;