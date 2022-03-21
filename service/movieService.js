const MovieModel = require('../models/movie')
const ApiError = require('../exceptions/apiError');

class MovieService {
    async createMovie(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const movie = new MovieModel(body);
            return await movie.save();
        } catch (e) {
            throw ApiError.BadRequest('Movie with such name already exits')
        }
    }

    async updateMovie(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            return await MovieModel.findByIdAndUpdate(
                id,
                {
                    $set: body,
                },
                {new: true}
            );
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async deleteMovie(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            await MovieModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async getMovieById(id) {
        const movie = MovieModel.findById(id);

        if (!movie) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }

        return movie;
    }

    async getRandomMovie(type) {
        try {
            let movie;

            if (type === "series") {
                movie = await MovieModel.aggregate([
                    { $match: { isSeries: true } },
                    { $sample: { size: 1 } },
                ]);
            } else {
                movie = await MovieModel.aggregate([
                    { $match: { isSeries: false } },
                    { $sample: { size: 1 } },
                ]);
            }

            return movie;
        } catch (e) {
            throw ApiError.BadRequest('Cannot aggregate movie');
        }
    }

    async getMovies(isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        return MovieModel.find();
    }
}

module.exports = new MovieService();