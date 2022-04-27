const userService = require('../service/userService');

class UserController {
    async updateUser(req, res, next) {
        try {
            const {id, isAdmin} = req.user;
            const paramId = req.params.id;
            const body = req.body;

            const userData = await userService.updateUser(body, id, paramId, isAdmin);

            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {id, isAdmin} = req.user;
            const paramId = req.params.id;

            await userService.deleteUser(id, paramId, isAdmin);

            return res.status(200).json('User has been deleted');
        } catch (e) {
            next(e);
        }
    }

    async findUser(req, res, next) {
        try {
            const userData = await userService.findUser(req.params.id);
            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const {isAdmin} = req.user;

            const usersData = await userService.getUsers(isAdmin);

            return res.status(200).json(usersData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();