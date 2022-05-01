const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',
    authMiddleware,
    reviewController.createReview);

router.put('/:id',
    authMiddleware,
    reviewController.updateReview);

router.delete('/:id',
    authMiddleware,
    reviewController.deleteReview);

router.get('/:id',
    reviewController.getReviewById);

router.get('/item/:id',
    reviewController.getReviewsByItemId);

router.get('/item/:id/ids',
    reviewController.getReviewsIdsByItemId);

router.get('/type/:type/tag/:tag/ids',
    reviewController.getReviewsIdsByTag);

router.get('/type/:type/author/:id',
    reviewController.getReviewsByAuthorId);

router.get('/',
    reviewController.getReviews);

router.put('/like/:id',
    authMiddleware,
    reviewController.putLike);

router.get('/latest/:type/ids',
    reviewController.getLatestReviews);

router.get('/popular/:type/ids',
    reviewController.getPopularReviews);

module.exports = router;