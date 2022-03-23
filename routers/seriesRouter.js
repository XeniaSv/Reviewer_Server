const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const seriesController = require('../controllers/seriesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    authMiddleware,
    seriesController.createSeries);

router.put('/:id',
    authMiddleware,
    seriesController.updateSeries);

router.delete('/:id',
    authMiddleware,
    seriesController.deleteSeries);

router.get('/find/:id',
    authMiddleware,
    seriesController.getSeriesById);

router.get('/',
    authMiddleware,
    seriesController.getSeries);

router.put('/rate/:seriesId',
    authMiddleware,
    seriesController.putRatingSeries);

router.get('/rate/:userId/:seriesId',
    authMiddleware,
    seriesController.getRatingSeriesByUser);

router.delete('/rate/:userId/:seriesId',
    authMiddleware,
    seriesController.deleteRatingSeriesByUser);

router.get('/rate/:seriesId',
    authMiddleware,
    seriesController.getAvgRating);

module.exports = router;