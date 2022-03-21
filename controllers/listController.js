const listService = require('../service/listService');

class ListController {
    async createList(req, res, next) {
        try {
            const {body} = req;
            const {isAdmin} = req.user;

            const listData = await listService.createList(body, isAdmin);

            return res.status(201).json(listData);
        } catch (e) {
            next(e);
        }
    }

    async deleteList(req, res, next) {
        try {
            const {isAdmin} = req.user;
            const {id} = req.params;

            await listService.deleteList(isAdmin, id);

            return res.status(201).json('The list has been delete...');
        } catch (e) {
            next(e);
        }
    }

    async getLists(req, res, next) {
        try {
            const {type, genre} = req.query;

            const listsData = await listService.getLists(type, genre);

            return res.status(200).json(listsData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ListController();