const ReviewModel = require('../models/review');
const UserModel = require('../models/user');
const ReviewDto = require('../dtos/reviewDtos/reviewDto')
const ApiError = require('../exceptions/apiError');

class ReviewService {
    async createReview(body) {
        const existingReviewModel = await ReviewModel.findOne({author: body.author, item: body.item});

        if (existingReviewModel) {
            throw ApiError.BadRequest('You have already create review')
        }

        try {
            const reviewModel = new ReviewModel(body);
            await reviewModel.save();

            const userModel = await UserModel.findById(body.author);

            return new ReviewDto(userModel.username, reviewModel);
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

        const userModel = await UserModel.findById(body.author);

        return new ReviewDto(userModel.username, updateReviewModel);
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

        const userModel = await UserModel.findById(reviewModel.author);
        return new ReviewDto(userModel.username, reviewModel);
    }

    async getReviewsByItemId(paramId) {
        const reviewModels = await ReviewModel.find({item: paramId});

        const reviewDtos = [];

        for (const review of reviewModels) {
            const userModel = await UserModel.findById(review.author);

            reviewDtos.push(new ReviewDto(userModel.username, review));
        }

        return reviewDtos;
    }

    async getReviewsIdsByItemId(paramId) {
        const reviewModels = await ReviewModel.find({item: paramId});

        const reviewIds = [];

        for (const review of reviewModels) {
            reviewIds.push(review._id);
        }

        return reviewIds;
    }

    async getReviewsByAuthorId(paramId) {
        const reviewModels = await ReviewModel.find({author: paramId});

        const reviewDtos = [];

        const userModel = await UserModel.findById(paramId);

        for (const review of reviewModels) {
            reviewDtos.push(new ReviewDto(userModel.username, review));
        }

        return reviewDtos;
    }

    async getReviews() {
        const reviewModels = await ReviewModel.find();
        const reviewDtos = [];

        for (const reviewModel of reviewModels) {
            const userModel = await UserModel.findById(reviewModels.author);

            reviewDtos.push(new ReviewDto(userModel.username, reviewModel));
        }

        return reviewDtos;
    }

    async putLike(userId, paramId) {
        const existingReviewModel = await ReviewModel.findById(paramId);

        if (!existingReviewModel) {
            throw ApiError.BadRequest('Review with such id not found');
        }

        if (existingReviewModel.likes.includes(userId)) {
            const reviewModel = await ReviewModel.findByIdAndUpdate(paramId, {
                $pull: {likes: userId}
            }, {new: true});

            const userModel = await UserModel.findById(reviewModel.author);
            return new ReviewDto(userModel.username, reviewModel);
        }

        const reviewModel = await ReviewModel.findByIdAndUpdate(paramId, {
            $push: {likes: userId}
        }, {new: true});

        const userModel = await UserModel.findById(reviewModel.author);
        return new ReviewDto(userModel.username, reviewModel);
    }

    async getLatestReviews(type) {
        try {
            const reviewModels = await ReviewModel.aggregate([
                {$sample: {size: 10}},
                {$match: {onItem: type}},
                {$sort: {createdAt: -1}}
            ]);

            const reviewIds = [];

            for (const review of reviewModels) {
                reviewIds.push(review._id);
            }

            return reviewIds;
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

            const reviewIds = [];

            for (const review of reviewModels) {
                reviewIds.push(review._id);
            }

            return reviewIds;
        } catch (e) {
            throw ApiError.BadRequest('Cannot aggregate');
        }
    }
}

module.exports = new ReviewService();