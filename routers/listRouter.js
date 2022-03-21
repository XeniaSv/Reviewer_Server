const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const listController = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    authMiddleware,
    listController.createList);

router.delete('/:id',
    authMiddleware,
    listController.deleteList);

router.get('/',
    authMiddleware,
    listController.getLists);

module.exports = router;
