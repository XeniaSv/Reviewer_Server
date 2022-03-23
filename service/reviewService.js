const ReviewModel = require('../models/review');
const ReviewDto = require('../dtos/reviewDtos/reviewDto')
const ApiError = require('../exceptions/apiError');

class ReviewService {
    async createReview(body) {
        const existingReviewModel = await ReviewModel.find({author: body.author, item: body.item});

        if (existingReviewModel) {
            throw ApiError.BadRequest('You have already create review')
        }

        try {
            const reviewModel = new ReviewModel(body);
            await reviewModel.save();

            return new ReviewDto(reviewModel);
        } catch (e) {
            throw ApiError.BadRequest('There is no such item')
        }
    }

    async updateReview(body, userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        if (reviewModel.author !== userId)
            throw ApiError.BadRequest('You cannot update this review');

        const updateReviewModel = ReviewModel.findByIdAndUpdate(reviewModel._id, {
            $set: body
        }, {new: true})

        return new ReviewDto(updateReviewModel);
    }

    async deleteReview(userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        if (reviewModel.author !== userId)
            throw ApiError.BadRequest('You cannot update this review');

        await reviewModel.remove().exec();
    }

    async getReviewById(paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        return new ReviewDto(reviewModel);
    }

    async getReviewsByItemId(paramId) {
        const reviewModels = await ReviewModel.find({item: paramId});

        if (!reviewModels) {
            throw ApiError.BadRequest('There is no such item');
        }

        const reviewDtos = [];

        for (const review of reviewModels) {
            reviewDtos.push(new ReviewDto(review));
        }

        return reviewDtos;
    }

    async getReviewsByAuthorId(paramId) {
        const reviewModels = await ReviewModel.find({author: paramId});

        if (!reviewModels) {
            throw ApiError.BadRequest('There is no such author');
        }

        const reviewDtos = [];

        for (const review of reviewModels) {
            reviewDtos.push(new ReviewDto(review));
        }

        return reviewDtos;
    }

    async getReviews() {
        const reviewModels = await ReviewModel.find();
        const reviewDtos = [];

        for (const reviewModel of reviewModels) {
            reviewDtos.push(new ReviewDto(reviewModel));
        }

        return reviewDtos;
    }

    async putLike(userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        if (reviewModel.find({likes: userId})) {
            throw ApiError.BadRequest('You have already liked this review')
        }

        try {
            reviewModel.update(null, {
                $push: {likes: userId}
            }, {new: true});

            return new ReviewDto(reviewModel);
        } catch (e) {
            throw ApiError.BadRequest();
        }
    }

    async poolLike(userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        if (!reviewModel.find({likes: userId})) {
            throw ApiError.BadRequest('You dont liked this review')
        }

        try {
            reviewModel.update(null, {
                $pull: {likes: userId}
            }, {new: true});

            return new ReviewDto(reviewModel);
        } catch (e) {
            throw ApiError.BadRequest();
        }
    }

    async getLatestReviews(type) {
        try {
            const reviewModels = await ReviewModel.aggregate([
                {$sample: {size: 10}},
                {$match: {onItem: type}},
                {$sort: {createdAt: -1}}
            ]);

            const reviewDtos = [];

            for (const review of reviewModels) {
                reviewDtos.push(review);
            }

            return reviewDtos;
        } catch (e) {
            throw ApiError.BadRequest('Cannot aggregate');
        }
    }

    async getPopularReviews(type) {
        try {
            const reviewModels = await ReviewModel.aggregate([
                {$sample: {size: 10}},
                {$match: {onItem: type}},
                {$sort: {likes: -1}}
            ]);

            const reviewDtos = [];

            for (const review of reviewModels) {
                reviewDtos.push(review);
            }

            return reviewDtos;
        } catch (e) {
            throw ApiError.BadRequest('Cannot aggregate');
        }
    }
}

module.exports = new ReviewService();