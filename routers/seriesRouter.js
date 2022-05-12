const Router = require('express').Router;
const router = new Router();
const {body, param} = require('express-validator');
const seriesController = require('../controllers/seriesController');
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
    seriesController.createSeries);

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
    seriesController.updateSeries);

router.delete('/:id',
    param('id').isLength({min: 24, max:24}),
    authMiddleware,
    seriesController.deleteSeries);

router.get('/:id',
    param('id').isLength({min: 24, max:24}),
    seriesController.getSeriesById);

router.get('/',
    seriesController.getSeries);

router.put('/rate/:seriesId',
    param('seriesId').isLength({min: 24, max:24}),
    body('user').isLength({min: 24, max:24}),
    body('item').isLength({min: 24, max:24}),
    body('onItem').equals('Series'),
    authMiddleware,
    seriesController.putRatingSeries);

router.get('/rate/:userId/:seriesId',
    param('userId').isLength({min: 24, max:24}),
    param('seriesId').isLength({min: 24, max:24}),
    seriesController.getRatingSeriesByUser);

router.get('/rate/:seriesId',
    param('seriesId').isLength({min: 24, max:24}),
    seriesController.getAvgRating);

module.exports = router;