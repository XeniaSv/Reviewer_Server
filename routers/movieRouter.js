const Router = require('express').Router;
const router = new Router();
const {body, param} = require('express-validator');
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    body('title').isString(),
    body('director').isString(),
    body('duration').isString(),
    body('year').isString(),
    body('genre').isArray(),
    body('limit').isString(),
    body('cast').isArray(),
    body('desc').isString(),
    body('img').isString(),
    body('imgSm').isString(),
    authMiddleware,
    movieController.createMovie);

router.put('/:id',
    param('id').isLength({min: 24, max:24}),
    body('id').isLength({min: 24, max:24}),
    body('title').isString(),
    body('director').isString(),
    body('duration').isString(),
    body('year').isString(),
    body('genre').isArray(),
    body('limit').isString(),
    body('cast').isArray(),
    body('desc').isString(),
    authMiddleware,
    movieController.updateMovie);

router.delete('/:id',
    param('id').isLength({min: 24, max:24}),
    authMiddleware,
    movieController.deleteMovie);

router.get('/:id',
    param('id').isLength({min: 24, max:24}),
    movieController.getMovieById);

router.get('/',
    movieController.getMovies);

router.put('/rate/:movieId',
    param('movieId').isLength({min: 24, max:24}),
    body('user').isLength({min: 24, max:24}),
    body('item').isLength({min: 24, max:24}),
    body('onItem').equals('Movie'),
    authMiddleware,
    movieController.putRatingMovie);

router.get('/rate/:userId/:movieId',
    param('userId').isLength({min: 24, max:24}),
    param('movieId').isLength({min: 24, max:24}),
    movieController.getRatingMovieByUser);

router.get('/rate/:movieId',
    param('movieId').isLength({min: 24, max:24}),
    movieController.getAvgRating);

module.exports = router;