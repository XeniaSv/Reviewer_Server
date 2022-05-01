const seriesService = require('../service/seriesService')

class SeriesController {
    async createSeries(req, res, next) {
        try {
            const {body} = req;
            const {isAdmin} = req.user;

            const seriesData = await seriesService.createSeries(body, isAdmin);

            return res.status(201).json(seriesData);
        } catch (e) {
            next(e);
        }
    }

    async updateSeries(req, res, next) {
        try {
            const {body} = req;
            const {isAdmin} = req.user;
            const {id} = req.params;

            const seriesData = await seriesService.updateSeries(body, isAdmin, id);

            return res.status(200).json(seriesData);
        } catch (e) {
            next(e);
        }
    }

    async deleteSeries(req, res, next) {
        try {
            const {isAdmin} = req.user;
            const {id} = req.params;

            await seriesService.deleteSeries(isAdmin, id);

            return res.status(200).json('The movie has been deleted...');
        } catch (e) {
            next(e);
        }
    }

    async getSeriesById(req, res, next) {
        try {
            const {id} = req.params;

            const seriesData = await seriesService.getSeriesById(id);

            return res.status(200).json(seriesData);
        } catch (e) {
            next(e);
        }
    }

    async getSeries(req, res, next) {
        try {
            const seriesData = await seriesService.getSeries();

            return res.status(200).json(seriesData);
        } catch (e) {
            next(e);
        }
    }

    async putRatingSeries(req, res, next) {
        try {
            const {body, user} = req;
            const {seriesId} = req.params;

            const ratingData = await seriesService.putRatingSeries(body, user.id, seriesId);

            return res.status(201).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getRatingSeriesByUser(req, res, next) {
        try {
            const {userId, seriesId} = req.params;

            const ratingData = await seriesService.getRatingSeriesByUser(seriesId, userId)

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getAvgRating(req, res, next) {
        try {
            const {seriesId} = req.params;

            const ratingData = await seriesService.getAvgRating(seriesId);

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SeriesController();