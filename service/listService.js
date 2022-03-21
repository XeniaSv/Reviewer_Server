const ListModel = require('../models/list');
const ApiError = require('../exceptions/apiError');

class ListService {
    async createList(body, isAdmin) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            const list = new ListModel(body);
            return await list.save();
        } catch (e) {
            throw ApiError.BadRequest('List with such name already exits')
        }
    }

    async deleteList(isAdmin, id) {
        if (!isAdmin) {
            throw ApiError.NotAdmin('You are not allowed!');
        }

        try {
            await ListModel.findByIdAndDelete(id);
        } catch (e) {
            throw ApiError.BadRequest('Cannot find movie with such id')
        }
    }

    async getLists(type, genre) {
        try {
            let list;
            if (type) {
                if (genre) {
                    list = await ListModel.aggregate([
                        { $sample: { size: 10 } },
                        { $match: { type: type, genre: genre } },
                    ]);
                } else {
                    list = await ListModel.aggregate([
                        { $sample: { size: 10 } },
                        { $match: { type: genre } },
                    ]);
                }
            } else {
                list = await ListModel.aggregate([{ $sample: { size: 10 } }]);
            }
            return list;
        } catch (e) {
            throw ApiError.BadRequest('Cannot aggregate movie');
        }
    }
}

module.exports = new ListService();