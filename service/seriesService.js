const SeriesModel = require('../models/series');
const ApiError = require('../exceptions/apiError');
const SeriesDto = require('../dtos/movieSeriesDtos/movieSeriesDto');
const RatingModel = require("../models/rating");
const ReviewModel = require('../models/review');
const RatingDto = require("../dtos/ratingDtos/ratingDto");
const AvgRatingDto = require("../dtos/ratingDtos/avgRatingDto");

class SeriesService {
    async createSeries(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
        }

        try {
            const seriesModel = new SeriesModel(body);
            await seriesModel.save();

            return new SeriesDto(seriesModel);
        } catch (e) {
            throw ApiError.BadRequest('Сериал с данным названием уже создан')
        }
    }

    async updateSeries(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
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
            throw ApiError.BadRequest('Данного сериала не существует');
        }
    }

    async deleteSeries(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
        }

        try {
            await RatingModel.deleteMany({item: id});
            await ReviewModel.deleteMany({item: id});
            await SeriesModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Данного сериала не существует');
        }
    }

    async getSeriesById(id) {
        try {
            const seriesModel = await SeriesModel.findById(id);

            return new SeriesDto(seriesModel);
        } catch (e) {
            throw ApiError.BadRequest('Данного сериала не существует');
        }
    }

    async getSeries() {
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
            throw ApiError.BadRequest('Данного сериала не существует');
        }

        const existedRate = await RatingModel.findOne({user: body.user, item: body.item});

        if (!existedRate) {
            const ratingModel = new RatingModel(body);
            await ratingModel.save();
            return new RatingDto(ratingModel);
        }

        if (existedRate.user !== userId) {
            throw ApiError.BadRequest('Вы не можете обновить чужой рейтинг');
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
            throw ApiError.BadRequest('Данного сериала не существует');
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

        return new AvgRatingDto(seriesId, "Series", (sum / ratingModels.length).toFixed(1))
    }
}

module.exports = new SeriesService();