const SeriesModel = require('../models/series');
const ApiError = require('../exceptions/apiError');
const SeriesDto = require('../dtos/movieSeriesDtos/movieSeriesDto');
const RatingModel = require("../models/rating");
const ReviewModel = require('../models/review');
const RatingDto = require("../dtos/ratingDto");

class SeriesService {
    async createSeries(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const seriesModel = new SeriesModel(body);
            await seriesModel.save();

            return new SeriesDto(seriesModel);
        } catch (e) {
            throw ApiError.BadRequest('Series with such name already exits')
        }
    }

    async updateSeries(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const seriesModel = await SeriesModel.findByIdAndUpdate(
                id,
                {
                    $set: body,
                },
                {new: true}
            );

            return new SeriesDto(seriesModel);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find series with such id')
        }
    }

    async deleteSeries(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            await RatingModel.deleteMany({item: id});
            await ReviewModel.deleteMany({item: id});
            await SeriesModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find series with such id')
        }
    }

    async getSeriesById(id) {
        try {
            const seriesModel = await SeriesModel.findById(id);

            return new SeriesDto(seriesModel);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find series with such id')
        }
    }

    async getSeries(isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        const seriesModels = await SeriesModel.find();
        const seriesDtos = [];

        for (const movieModel of seriesModels) {
            seriesDtos.push(new SeriesDto(movieModel));
        }

        return seriesDtos;
    }

    async putRatingSeries(body, userId, seriesId) {
        const seriesModel = await SeriesModel.findById(seriesId);

        if (!seriesModel) {
            throw ApiError.BadRequest('There is no such movie');
        }

        const existedRate = await RatingModel.findOne({user: body.user, item: body.item});

        if (!existedRate) {
            const ratingModel = new RatingModel(body);
            await ratingModel.save();
            return new RatingDto(ratingModel);
        }

        if (existedRate.user !== userId) {
            throw ApiError.BadRequest('You cannot update this rate');
        }

        if (body.rate === null) {
            await RatingModel.findByIdAndDelete(existedRate._id);
            return {user: userId, item: seriesId, onItem: 'Series', rate: body.rate}
        }

        const ratingModel = await RatingModel.findByIdAndUpdate(existedRate._id, {
            $set: body
        }, {new: true});

        return new RatingDto(ratingModel);
    }

    async getRatingSeriesByUser(seriesId, userId) {
        const ratingModel = await RatingModel.findOne({user: userId, item: seriesId});

        if (!ratingModel) {
            return {user: userId, item: seriesId, onItem: 'Series', rate: 0};
        }

        return new RatingDto(ratingModel);
    }

    async getAvgRating(seriesId) {
        const seriesModel = await SeriesModel.findById(seriesId);

        if (!seriesModel) {
            throw ApiError.BadRequest('There is no such series');
        }

        const ratingModels = await RatingModel.find({item: seriesId});

        if (ratingModels.length === 0) {
            return {item: seriesId, onItem: "Series", rate: 0.0};
        }

        if (ratingModels.length === 1) {
            return new RatingDto(ratingModels[0]);
        }

        let sum = 0;

        for (const rating of ratingModels) {
            sum += rating.rate;
        }

        return {item: seriesId, onItem: "Series", rate: (sum / ratingModels.length).toFixed(1)};
    }
}

module.exports = new SeriesService();