const MovieModel = require('../models/movie');
const RatingModel = require('../models/rating');
const ApiError = require('../exceptions/apiError');
const MovieDto = require('../dtos/movieSeriesDtos/movieSeriesDto');
const RatingDto = require('../dtos/ratingDto');

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
            await RatingModel.deleteMany({item: id});
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async getMovieById(id) {
        try {
            const movie = await MovieModel.findById(id);

            return new MovieDto(movie);
        }
        catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
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

    async putRatingMovie(body, userId, movieId) {

        const movieModel = await MovieModel.findById(movieId);

        if (!movieModel) {
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
            return {user: userId, item: movieId, onItem: 'Movie', rate: body.rate}
        }

        const ratingModel = await RatingModel.findByIdAndUpdate(existedRate._id, {
            $set: body
        }, {new: true});

        return new RatingDto(ratingModel);
    }

    async getRatingMovieByUser(movieId, userId) {
        const ratingModel = await RatingModel.findOne({user: userId, item: movieId});

        if (!ratingModel) {
            return {user: userId, item: movieId, onItem: 'Movie', rate: 0};
        }

        return new RatingDto(ratingModel);
    }

    async getAvgRating(movieId) {
        const movieModel = await MovieModel.findById(movieId);

        if (!movieModel) {
            throw ApiError.BadRequest('There is no such movie');
        }

        const ratingModels = await RatingModel.find({item: movieId});

        if (ratingModels.length === 0) {
            return {item: movieId, onItem: "Movie", rate: 0.0};
        }

        if (ratingModels.length === 1) {
            return new RatingDto(ratingModels[0]);
        }

        let sum = 0;

        for (const rating of ratingModels) {
            sum += rating.rate;
        }

        return {item: movieId, onItem: "Movie", rate: (sum / ratingModels.length).toFixed(1)};
    }
}

module.exports = new MovieService();