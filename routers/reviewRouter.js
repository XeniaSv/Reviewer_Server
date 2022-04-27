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
    authMiddleware,
    reviewController.getReviewById);

router.get('/item/:id',
    authMiddleware,
    reviewController.getReviewsByItemId);

router.get('/item/:id/ids',
    authMiddleware,
    reviewController.getReviewsIdsByItemId);

router.get('/type/:type/author/:id',
    authMiddleware,
    reviewController.getReviewsByAuthorId);

router.get('/',
    authMiddleware,
    reviewController.getReviews);

router.put('/like/:id',
    authMiddleware,
    reviewController.putLike);

router.get('/latest/:type/ids',
    authMiddleware,
    reviewController.getLatestReviews);

router.get('/popular/:type/ids',
    authMiddleware,
    reviewController.getPopularReviews);

module.exports = router;