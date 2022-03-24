const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    authMiddleware,
    movieController.createMovie);

router.put('/:id',
    authMiddleware,
    movieController.updateMovie);

router.delete('/:id',
    authMiddleware,
    movieController.deleteMovie);

router.get('/:id',
    authMiddleware,
    movieController.getMovieById);

router.get('/',
    authMiddleware,
    movieController.getMovies);

router.put('/rate/:movieId',
    authMiddleware,
    movieController.putRatingMovie);

router.get('/rate/:userId/:movieId',
    authMiddleware,
    movieController.getRatingMovieByUser);

router.get('/rate/:movieId',
    authMiddleware,
    movieController.getAvgRating);

module.exports = router;