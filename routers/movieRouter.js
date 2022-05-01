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
    movieController.getMovieById);

router.get('/',
    movieController.getMovies);

router.put('/rate/:movieId',
    authMiddleware,
    movieController.putRatingMovie);

router.get('/rate/:userId/:movieId',
    movieController.getRatingMovieByUser);

router.get('/rate/:movieId',
    movieController.getAvgRating);

module.exports = router;