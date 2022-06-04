const reviewService = require('../service/reviewService');
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/apiError");

class ReviewController {
    async createReview(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const reviewData = await reviewService.createReview(req.body);

            return res.status(201).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async updateReview(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {user} = req;
            const {id} = req.params;

            await reviewService.deleteReview(user.id, id);

            return res.status(200).json('Рецензия была удалена');
        } catch (e) {
            next(e);
        }
    }

    async getReviewById(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {id} = req.params;

            const reviewData = await reviewService.getReviewById(id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsByItemId(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {id} = req.params;

            const reviewData = await reviewService.getReviewsByItemId(id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsIdsByItemId(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {id} = req.params;

            const reviewData = await reviewService.getReviewsIdsByItemId(id);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsIdsByTag(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {tag, type} = req.params;

            const reviewData = await reviewService.getReviewsIdsByTag(tag, type);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getReviewsByAuthorId(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {type, id} = req.params;

            const reviewData = await reviewService.getReviewsByAuthorId(type, id);

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {id} = req.params;
            const {user} = req;

            const reviewData = await reviewService.putLike(user.id, id);

            return res.status(201).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getLatestReviews(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {type} = req.params;

            const reviewData = await reviewService.getLatestReviews(type);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }

    async getPopularReviews(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {type} = req.params;

            const reviewData = await reviewService.getPopularReviews(type);

            return res.status(200).json(reviewData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReviewController();