const MovieModel = require('../models/movie')
const ApiError = require('../exceptions/apiError');
const MovieDto = require('../dtos/movieSeriesDtos/movieSeriesDto');

class MovieService {
    async createMovie(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const movieModel = new MovieModel(body);
            await movieModel.save();

            return new MovieDto(movieModel);
        } catch (e) {
            throw ApiError.BadRequest('Movie with such name already exits')
        }
    }

    async updateMovie(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const movieModel = await MovieModel.findByIdAndUpdate(
                id,
                {
                    $set: body,
                },
                {new: true}
            );

            return new MovieDto(movieModel);
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
        const movie = await MovieModel.findById(id);

        if (!movie) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }

        return new MovieDto(movie);
    }

    async getMovies(isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        const movieModels = await MovieModel.find();
        const movieDtos = [];

        for (const movieModel of movieModels) {
            movieDtos.push(new MovieDto(movieModel));
        }

        return movieDtos;
    }
}

module.exports = new MovieService();