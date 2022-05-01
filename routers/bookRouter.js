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

router.get('/:id',
    bookController.getBookById);

router.get('/',
    bookController.getBooks);

router.put('/rate/:bookId',
    authMiddleware,
    bookController.putRatingBook);

router.get('/rate/:userId/:bookId',
    bookController.getRatingBookByUser);

router.get('/rate/:bookId',
    bookController.getAvgRating);

module.exports = router;