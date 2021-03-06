const MovieModel = require('../models/movie');
const RatingModel = require('../models/rating');
const ReviewModel = require('../models/review');
const ApiError = require('../exceptions/apiError');
const MovieDto = require('../dtos/movieSeriesDtos/movieSeriesDto');
const RatingDto = require('../dtos/ratingDtos/ratingDto');
const AvgRatingDto = require("../dtos/ratingDtos/avgRatingDto");

class MovieService {
    async createMovie(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
        }

        try {
            const movieModel = new MovieModel(body);
            await movieModel.save();

            return new MovieDto(movieModel);
        } catch (e) {
            throw ApiError.BadRequest('Фильм с данным названием уже создан');
        }
    }

    async updateMovie(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
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
            throw ApiError.BadRequest('Данный фильм не существует')
        }
    }

    async deleteMovie(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('Вы не администратор!');
        }

        try {
            await RatingModel.deleteMany({item: id});
            await ReviewModel.deleteMany({item: id});
            await MovieModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Данный фильм не существует')
        }
    }

    async getMovieById(id) {
        try {
            const movie = await MovieModel.findById(id);

            return new MovieDto(movie);
        } catch (e) {
            throw ApiError.BadRequest('Данный фильм не существует')
        }
    }

    async getMovies() {
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
            throw ApiError.BadRequest('Данный фильм не существует')
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
            throw ApiError.BadRequest('Данный фильм не существует')
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

        return new AvgRatingDto(movieId, "Movie", (sum / ratingModels.length).toFixed(1))
    }
}

module.exports = new MovieService();