const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    authMiddleware,
    bookController.createBook);

router.put('/:id',
    authMiddleware,
    bookController.updateBook);

router.delete('/:id',
    authMiddleware,
    bookController.deleteBook);

router.get('/find/:id',
    authMiddleware,
    bookController.getBookById);

router.get('/',
    authMiddleware,
    bookController.getBooks);

module.exports = router;