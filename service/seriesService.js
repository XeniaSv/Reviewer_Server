const SeriesModel = require('../models/series');
const ApiError = require('../exceptions/apiError');
const SeriesDto = require('../dtos/movieSeriesDtos/movieSeriesDto');
const RatingModel = require("../models/rating");
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
            await SeriesModel.findByIdAndDelete(id);
            await RatingModel.deleteMany({item: id})
        } catch (e) {
            throw ApiError.BadRequest('Cannot find series with such id')
        }
    }

    async getSeriesById(id) {
        const seriesModel = await SeriesModel.findById(id);

        if (!seriesModel) {
            throw ApiError.BadRequest('Cannot find series with such id')
        }

        return new SeriesDto(seriesModel);
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
        if (body.rate < 1 || body.rate > 5) {
            throw ApiError.BadRequest('Rate must be in range [1; 5]');
        }

        const seriesModel = await SeriesModel.findById(seriesId);

        if (!seriesModel) {
            throw ApiError.BadRequest('There is no such movie');
        }

        const existedRate = await RatingModel.find({user: body.user, item: body.item});

        if (!existedRate) {
            const ratingModel = new RatingModel(body);
            await ratingModel.save();
            return new RatingDto(ratingModel);
        }

        if (existedRate.user !== userId) {
            throw ApiError.BadRequest('You cannot update this rate');
        }

        const ratingModel = await RatingModel.findByIdAndUpdate(existedRate._id, {
            $set: body
        }, {new: true});

        return new RatingDto(ratingModel);
    }

    async getRatingSeriesByUser(seriesId, userId) {
        const ratingModel = await RatingModel.find({user: userId, item: seriesId});

        if (!ratingModel) {
            throw ApiError.BadRequest('You dont rate this movie');
        }

        return new RatingDto(ratingModel);
    }

    async deleteRatingSeriesByUser(seriesId, userId) {
        const ratingModel = await RatingModel.find({user: userId, item:seriesId});

        if (!ratingModel) {
            throw ApiError.BadRequest('You dont rate this movie');
        }

        await RatingModel.findByIdAndDelete(ratingModel._id);
    }

    async getAvgRating(seriesId) {
        const seriesModel = await SeriesModel.findById(seriesId);

        if (!seriesModel) {
            throw ApiError.BadRequest('There is no such series');
        }

        const ratingModels = await RatingModel.find({item: seriesId});
        let sum = 0;

        for (const rating of ratingModels) {
            sum += rating.rate;
        }

        if (ratingModels.length === 0) {
            return 0;
        }

        return Math.round(sum/ratingModels.length);
    }
}

module.exports = new SeriesService();