const movieService = require('../service/movieService')

class MovieController {
    async createMovie(req, res, next) {
        try {
            const {body} = req;
            const {isAdmin} = req.user;

            const movieData = await movieService.createMovie(body, isAdmin);

            return res.status(201).json(movieData);
        } catch (e) {
            next(e);
        }
    }

    async updateMovie(req, res, next) {
        try {
            const {body} = req;
            const {isAdmin} = req.user;
            const {id} = req.params;

            const movieData = await movieService.updateMovie(body, isAdmin, id);

            return res.status(200).json(movieData);
        } catch (e) {
            next(e);
        }
    }

    async deleteMovie(req, res, next) {
        try {
            const {isAdmin} = req.user;
            const {id} = req.params;

            await movieService.deleteMovie(isAdmin, id);

            return res.status(200).json('The movie has been deleted...');
        } catch (e) {
            next(e);
        }
    }

    async getMovieById(req, res, next) {
        try {
            const {id} = req.params;

            const movieData = await movieService.getMovieById(id);

            return res.status(200).json(movieData);
        } catch (e) {
            next(e);
        }
    }

    async getMovies(req, res, next) {
        try {
            const {isAdmin} = req.user;

            const moviesData = await movieService.getMovies(isAdmin);

            return res.status(200).json(moviesData);
        } catch (e) {
            next(e);
        }
    }

    async putRatingMovie(req, res, next) {
        try {
            const {body, user} = req;
            const {movieId} = req.params;

            const ratingData = await movieService.putRatingMovie(body, user.id, movieId);

            return res.status(201).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getRatingMovieByUser(req, res, next) {
        try {
            const {userId, movieId} = req.params;

            const ratingData = await movieService.getRatingMovieByUser(movieId, userId)

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getAvgRating(req, res, next) {
        try {
            const {movieId} = req.params;

            const ratingData = await movieService.getAvgRating(movieId);

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new MovieController();