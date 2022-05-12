const Router = require('express').Router;
const router = new Router();
const {body, param} = require('express-validator');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    body('title').isString(),
    body('author').isString(),
    body('pages').isInt(),
    body('year').isString(),
    body('genre').isArray(),
    body('language').isString(),
    body('desc').isString(),
    body('img').isString(),
    body('imgSm').isString(),
    authMiddleware,
    bookController.createBook);

router.put('/:id',
    param('id').isLength({min: 24, max:24}),
    body('id').isLength({min: 24, max:24}),
    body('title').isString(),
    body('author').isString(),
    body('pages').isInt(),
    body('year').isString(),
    body('genre').isArray(),
    body('language').isString(),
    body('desc').isString(),
    authMiddleware,
    bookController.updateBook);

router.delete('/:id',
    param('id').isLength({min: 24, max:24}),
    authMiddleware,
    bookController.deleteBook);

router.get('/:id',
    param('id').isLength({min: 24, max:24}),
    bookController.getBookById);

router.get('/',
    bookController.getBooks);

router.put('/rate/:bookId',
    param('bookId').isLength({min: 24, max:24}),
    body('user').isLength({min: 24, max:24}),
    body('item').isLength({min: 24, max:24}),
    body('onItem').equals('Book'),
    authMiddleware,
    bookController.putRatingBook);

router.get('/rate/:userId/:bookId',
    param('userId').isLength({min: 24, max:24}),
    param('bookId').isLength({min: 24, max:24}),
    bookController.getRatingBookByUser);

router.get('/rate/:bookId',
    param('bookId').isLength({min: 24, max:24}),
    bookController.getAvgRating);

module.exports = router;