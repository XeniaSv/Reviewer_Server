const bcrypt = require("bcrypt");
const UserModel = require('../models/user');
const ApiError = require('../exceptions/apiError');

class UserService {
    async updateUser(body, userId, paramId, isAdmin) {
        if (userId !== paramId || !isAdmin) {
            throw new ApiError.NotYourAccount();
        }
        if (!body.password) {
            throw new ApiError.BadRequest('There is no password in body');
        }

        body.password = bcrypt.hash(body.password, 3).toString();

        try {
            return UserModel.findByIdAndUpdate(
                paramId,
                {
                    $set: body,
                },
                {new: true}
            );
        } catch (e) {
            throw ApiError.BadRequest('User with such id not found');
        }
    }

    async deleteUser(userId, paramId, isAdmin) {
        if (userId !== paramId || !isAdmin) {
            throw new ApiError.NotYourAccount();
        }

        try {
            await UserModel.findByIdAndDelete(paramId);
        } catch (e) {
            throw ApiError.BadRequest('User with such id not found');
        }
    }

    async findUser(id) {
        const user = UserModel.findOne({_id: id});
        if (!user) {
            throw ApiError.BadRequest('User with such id not found');
        }
        const {password, ...info} = user._doc;
        return info;
    }

    async getUsers(query, isAdmin) {
        if (!isAdmin) {
            throw new ApiError.NotAdmin('You are not allowed to see all users');
        }

        return query
            ? await UserModel.find().sort({_id: -1}).limit(5)
            : await UserModel.find();
    }

    async getUserStats() {
        try {
            return await UserModel.aggregate([
                {
                    $project: {
                        month: {$month: "$createdAt"},
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: {$sum: 1},
                    },
                },
            ]);
        } catch (e) {
            throw ApiError.BadRequest('Cannot get user stats');
        }
    }
}

module.exports = new UserService();