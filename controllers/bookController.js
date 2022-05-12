const bookService = require('../service/bookService');
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/apiError");

class BookController {
    async createBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {body} = req;
            const {isAdmin} = req.user;

            const bookData = await bookService.createBook(body, isAdmin);

            return res.status(201).json(bookData);
        } catch (e) {
            next(e);
        }
    }

    async updateBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {body} = req;
            const {isAdmin} = req.user;
            const {id} = req.params;

            const bookData = await bookService.updateBook(body, isAdmin, id);

            return res.status(200).json(bookData);
        } catch (e) {
            next(e);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {isAdmin} = req.user;
            const {id} = req.params;

            await bookService.deleteBook(isAdmin, id);

            return res.status(200).json('The book has been deleted...');
        } catch (e) {
            next(e);
        }
    }

    async getBookById(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {id} = req.params;

            const bookData = await bookService.getBookById(id);

            return res.status(200).json(bookData);
        } catch (e) {
            next(e);
        }
    }

    async getBooks(req, res, next) {
        try {
            const booksData = await bookService.getBooks();

            return res.status(200).json(booksData);
        } catch (e) {
            next(e);
        }
    }

    async putRatingBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {body, user} = req;
            const {bookId} = req.params;

            const ratingData = await bookService.putRatingBook(body, user.id, bookId);

            return res.status(201).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getRatingBookByUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {userId, bookId} = req.params;

            const ratingData = await bookService.getRatingBookByUser(bookId, userId)

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }

    async getAvgRating(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const {bookId} = req.params;

            const ratingData = await bookService.getAvgRating(bookId);

            return res.status(200).json(ratingData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BookController();