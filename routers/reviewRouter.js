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

router.get('/findById/:id',
    authMiddleware,
    reviewController.getReviewById);

router.get('/findByItemId/:id',
    authMiddleware,
    reviewController.getReviewsByItemId);

router.get('/findByAuthorId/:id',
    authMiddleware,
    reviewController.getReviewsByAuthorId);

router.get('/',
    authMiddleware,
    reviewController.getReviews);

router.put('/like/:id',
    authMiddleware,
    reviewController.putLike);

router.put('/unlike/:id',
    authMiddleware,
    reviewController.poolLike);

router.get('/latest/:type',
    authMiddleware,
    reviewController.getLatestReviews);

router.get('/popular/:type',
    authMiddleware,
    reviewController.getPopularReviews);

module.exports = router;