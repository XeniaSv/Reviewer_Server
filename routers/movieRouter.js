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

router.get('/find/:id',
    authMiddleware,
    movieController.getMovieById);

router.get('/random',
    authMiddleware,
    movieController.getRandomMovie);

router.get('/',
    authMiddleware,
    movieController.getMovies);

module.exports = router;