const SeriesModel = require('../models/series');
const ApiError = require('../exceptions/apiError');
const SeriesDto = require('../dtos/movieSeriesDtos/movieSeriesDto');

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
}

module.exports = new SeriesService();