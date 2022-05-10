const BookModel = require('../models/book');
const ApiError = require('../exceptions/apiError');
const BookDto = require('../dtos/bookDtos/BookDto');
const RatingModel = require("../models/rating");
const ReviewModel = require('../models/review');
const RatingDto = require("../dtos/ratingDtos/ratingDto");
const AvgRatingDto = require("../dtos/ratingDtos/avgRatingDto");

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
            await RatingModel.deleteMany({item: id});
            await ReviewModel.deleteMany({item: id});
            await BookModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async getBookById(id) {
        try {
            const book = await BookModel.findById(id);

            return new BookDto(book);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find book with such id')
        }
    }

    async getBooks() {
        const bookModels = await BookModel.find();
        const bookDtos =[];

        for (let book of bookModels) {
            bookDtos.push(new BookDto(book));
        }

        return bookDtos;
    }

    async putRatingBook(body, userId, bookId) {
        const bookModel = await BookModel.findById(bookId);

        if (!bookModel) {
            throw ApiError.BadRequest('There is no such book');
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
            return {user: userId, item: bookId, onItem: 'Book', rate: body.rate}
        }

        const ratingModel = await RatingModel.findByIdAndUpdate(existedRate._id, {
            $set: body
        }, {new: true});

        return new RatingDto(ratingModel);
    }

    async getRatingBookByUser(bookId, userId) {
        const ratingModel = await RatingModel.findOne({user: userId, item: bookId});

        if (!ratingModel) {
            return {user: userId, item: bookId, onItem: 'Book', rate: 0};
        }

        return new RatingDto(ratingModel);
    }

    async getAvgRating(bookId) {
        const bookModel = await BookModel.findById(bookId);

        if (!bookModel) {
            throw ApiError.BadRequest('There is no such book');
        }

        const ratingModels = await RatingModel.find({item: bookId});

        if (ratingModels.length === 0) {
            return {item: bookId, onItem: "Book", rate: 0.0};
        }

        if (ratingModels.length === 1) {
            return new RatingDto(ratingModels[0]);
        }

        let sum = 0;

        for (const rating of ratingModels) {
            sum += rating.rate;
        }

        return new AvgRatingDto(bookId, "Book", (sum / ratingModels.length).toFixed(1))
    }
}

module.exports = new BookService();