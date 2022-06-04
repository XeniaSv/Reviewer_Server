const ReviewModel = require('../models/review');
const UserModel = require('../models/user');
const MovieModel = require('../models/movie');
const SeriesModel = require('../models/series');
const BookModel = require('../models/book');
const ReviewDto = require('../dtos/reviewDtos/reviewDto')
const ApiError = require('../exceptions/apiError');

class ReviewService {
    async createReview(body) {
        const existingReviewModel = await ReviewModel.findOne({author: body.author, item: body.item});

        if (existingReviewModel) {
            throw ApiError.BadRequest('Вы уже создали рецензию на данный предмет')
        }

        try {
            const reviewModel = new ReviewModel(body);
            await reviewModel.save();

            const userModel = await UserModel.findById(body.author);

            return new ReviewDto(userModel.username, reviewModel);
        } catch (e) {
            throw ApiError.BadRequest('Данный предмет не существует')
        }
    }

    async updateReview(body, userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);
        if (!reviewModel) {
            throw ApiError.BadRequest('Рецензия не найдена');
        }

        if (reviewModel.author !== userId)
            throw ApiError.BadRequest('Вы не можете обновить чужую рецензию');

        const updateReviewModel = await ReviewModel.findByIdAndUpdate(reviewModel._id, {
            $set: body
        }, {new: true})

        const userModel = await UserModel.findById(body.author);

        return new ReviewDto(userModel.username, updateReviewModel);
    }

    async deleteReview(userId, paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Рецензия не найдена');
        }

        if (reviewModel.author !== userId)
            throw ApiError.BadRequest('Вы не можете обновить чужую рецензию');

        await reviewModel.remove();
    }

    async getReviewById(paramId) {
        const reviewModel = await ReviewModel.findById(paramId);

        if (!reviewModel) {
            throw ApiError.BadRequest('Рецензия не найдена');
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

    async getReviewsIdsByTag(paramTag, paramType) {
        const reviewModels = await ReviewModel.find({onItem: paramType, tags: paramTag});

        const reviewIds = [];

        for (const review of reviewModels) {
            reviewIds.push(review._id);
        }

        return reviewIds;
    }

    async getReviewsByAuthorId(paramType, paramId) {
        let itemModel;
        switch (paramType) {
            case 'Movie':
                itemModel = MovieModel;
                break;
            case 'Series':
                itemModel = SeriesModel;
                break;
            case 'Book':
                itemModel = BookModel;
                break;
        }

        const reviewModels = await ReviewModel.find({author: paramId, onItem: paramType});

        const reviewDtos = [];

        const userModel = await UserModel.findById(paramId);

        for (const review of reviewModels) {
            const item = await itemModel.findById(review.item);
            reviewDtos.push(new ReviewDto(userModel.username, review, item.title));
        }

        return reviewDtos;
    }

    async getReviews() {
        const reviewModels = await ReviewModel.find();
        const reviewDtos = [];

        for (const reviewModel of reviewModels) {
            const userModel = await UserModel.findById(reviewModel.author);

            reviewDtos.push(new ReviewDto(userModel.username, reviewModel));
        }

        return reviewDtos;
    }

    async putLike(userId, paramId) {
        const existingReviewModel = await ReviewModel.findById(paramId);

        if (!existingReviewModel) {
            throw ApiError.BadRequest('Рецензия не найдена');
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
                {$match: {onItem: type}},
                {$sort: {createdAt: -1}},
                {$limit: 10},
            ]);

            const reviewIds = [];

            for (const review of reviewModels) {
                reviewIds.push(review._id);
            }

            return reviewIds;
        } catch (e) {
            throw ApiError.BadRequest('Агрегация невозможна');
        }
    }

    async getPopularReviews(type) {
        try {
            const reviewModels = await ReviewModel.aggregate([
                {$match: {onItem: type}},
                {
                    $addFields: { likes_count: {$size: { "$ifNull": [ "$likes", [] ] } } }
                },
                {$sort: {likes_count: -1}},
                {$limit: 10},
            ]);

            const reviewIds = [];

            for (const review of reviewModels) {
                reviewIds.push(review._id);
            }

            return reviewIds;
        } catch (e) {
            throw ApiError.BadRequest('Агрегация невозможна');
        }
    }
}

module.exports = new ReviewService();