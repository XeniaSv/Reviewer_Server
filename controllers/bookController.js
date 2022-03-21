const bookService = require('../service/bookService');

class BookController {
    async createBook(req, res, next) {
        try {
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
            const {id} = req.params;

            const bookData = await bookService.getBookById(id);

            return res.status(200).json(bookData);
        } catch (e) {
            next(e);
        }
    }

    async getBooks(req, res, next) {
        try {
            const {isAdmin} = req.user;

            const booksData = await bookService.getBooks(isAdmin);

            return res.status(200).json(booksData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BookController();