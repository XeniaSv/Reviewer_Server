const Router = require('express').Router;
const router = new Router();
const {param} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/:id',
    authMiddleware,
    userController.updateUser);

router.delete('/:id',
    param('id').isLength({min: 24, max:24}),
    authMiddleware,
    userController.deleteUser);

router.get('/:id',
    param('id').isLength({min: 24, max:24}),
    authMiddleware,
    userController.findUser);

router.get('/',
    authMiddleware,
    userController.getUsers);

module.exports = router;