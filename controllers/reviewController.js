const reviewService = require('../service/reviewService');

class ReviewController {
    async createReview(req, res, next) {
        try {
            const reviewData = await reviewService.createReview(req.body);

            return res.status(201).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async updateReview(req, res, next) {
        try {
            const {body, user} = req;
            const {id} = req.params;

            const reviewData = await reviewService.updateReview(body, user.id, id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async deleteReview(req, res, next) {
        try {
            const {user} = req;
            const {id} = req.params;

            await reviewService.deleteReview(user.id, id);

            return res.status(200).json('Review was deleted');
        } catch (e) {
            next(e);
        }
    }

    async getReviewById(req, res, next) {
        try {
            const {id} = req.params;

            const reviewData = await reviewService.getReviewById(id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsByItemId(req, res, next) {
        try {
            const {id} = req.params;

            const reviewData = await reviewService.getReviewsByItemId(id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsByAuthorId(req, res, next) {
        try {
            const {id} = req.params;

            const reviewData = await reviewService.getReviewsByAuthorId(id);

            return res.status(200).json(reviewData)
        } catch (e) {
            next(e);
        }
    }

    async getReviews(req, res, next) {
        try {
            const reviewData = await reviewService.getReviews();

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async putLike(req, res, next) {
        try {
            const {id} = req.params;
            const {user} = req;

            await reviewService.putLike(user.id, id);

            return res.status(201).json('You liked this review');
        } catch (e) {
            next(e);
        }
    }

    async poolLike(req, res, next) {
        try {
            const {id} = req.params;
            const {user} = req;

            await reviewService.poolLike(user.id, id);

            return res.status(201).json('You unliked this review');
        } catch (e) {
            next(e);
        }
    }

    async getLatestReviews(req, res, next) {
        try {
            const {type} = req.params;

            const reviewData = await reviewService.getLatestReviews(type);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getPopularReviews(req, res, next) {
        try {
            const {type} = req.params;

            const reviewData = await reviewService.getPopularReviews(type);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReviewController();