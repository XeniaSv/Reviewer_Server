const BookModel = require('../models/book')
const ApiError = require('../exceptions/apiError');
const BookDto = require('../dtos/bookDtos/BookDto')

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
}

module.exports = new BookService();