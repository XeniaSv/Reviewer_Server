const BookModel = require('../models/book')
const ApiError = require('../exceptions/apiError');
const BookDto = require('../dtos/bookDtos/BookDto')
const RatingModel = require("../models/rating");
const RatingDto = require("../dtos/ratingDto");

class BookService {
    async createBook(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const bookModel = new BookModel(body);
            bookModel.save();

            return new BookDto(bookModel);
        } catch (e) {
            throw ApiError.BadRequest('Movie with such name already exits')
        }
    }

    async updateBook(body, isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const bookModel = await BookModel.findByIdAndUpdate(
                id,
                {
                    $set: body,
                },
                {new: true}
            );

            return new BookDto(bookModel);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async deleteBook(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            await BookModel.findByIdAndDelete(id);
            await RatingModel.deleteMany({item: id})
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async getBookById(id) {
        const book = await BookModel.findById(id);

        if (!book) {
            throw ApiError.BadRequest('Cannot find book with such id')
        }

        return new BookDto(book);
    }

    async getBooks(isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        const bookModels = await BookModel.find();
        const bookDtos =[];

        for (let book of bookModels) {
            bookDtos.push(new BookModel(book));
        }

        return bookDtos;
    }

    async putRatingBook(body, userId, bookId) {
        if (body.rate < 1 || body.rate > 5) {
            throw ApiError.BadRequest('Rate must be in range [1; 5]');
        }

        const bookModel = await BookModel.findById(bookId);

        if (!bookModel) {
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

    async getRatingBookByUser(bookId, userId) {
        const ratingModel = await RatingModel.find({user: userId, item: bookId});

        if (!ratingModel) {
            throw ApiError.BadRequest('You dont rate this movie');
        }

        return new RatingDto(ratingModel);
    }

    async deleteRatingBookByUser(bookId, userId) {
        const ratingModel = await RatingModel.find({user: userId, item: bookId});

        if (!ratingModel) {
            throw ApiError.BadRequest('You dont rate this movie');
        }

        await RatingModel.findByIdAndDelete(ratingModel._id);
    }

    async getAvgRating(bookId) {
        const bookModel = await BookModel.findById(bookId);

        if (!bookModel) {
            throw ApiError.BadRequest('There is no such book');
        }

        const ratingModels = await RatingModel.find({item: bookId});
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

module.exports = new BookService();