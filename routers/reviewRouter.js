const Router = require('express').Router;
const router = new Router();
const {body, param} = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    body('author').isLength({min:24, max:24}),
    body('item').isLength({min:24, max:24}),
    body('onItem').isString(),
    body('title').isString(),
    body('tags').isArray(),
    body('textReview').isString(),
    authMiddleware,
    reviewController.createReview);

router.put('/:id',
    param('id').isLength({min:24, max:24}),
    body('id').isLength({min:24, max:24}),
    body('title').isString(),
    body('tags').isArray(),
    body('textReview').isString(),
    authMiddleware,
    reviewController.updateReview);

router.delete('/:id',
    param('id').isLength({min:24, max:24}),
    authMiddleware,
    reviewController.deleteReview);

router.get('/:id',
    param('id').isLength({min:24, max:24}),
    reviewController.getReviewById);

router.get('/item/:id',
    param('id').isLength({min:24, max:24}),
    reviewController.getReviewsByItemId);

router.get('/item/:id/ids',
    param('id').isLength({min:24, max:24}),
    reviewController.getReviewsIdsByItemId);

router.get('/type/:type/tag/:tag/ids',
    param('type').isString(),
    param('tag').isString(),
    reviewController.getReviewsIdsByTag);

router.get('/type/:type/author/:id',
    param('type').isString(),
    param('id').isLength({min:24, max:24}),
    reviewController.getReviewsByAuthorId);

router.get('/',
    reviewController.getReviews);

router.put('/like/:id',
    param('id').isLength({min:24, max:24}),
    authMiddleware,
    reviewController.putLike);

router.get('/latest/:type/ids',
    param('type').isString(),
    reviewController.getLatestReviews);

router.get('/popular/:type/ids',
    param('type').isString(),
    reviewController.getPopularReviews);

module.exports = router;