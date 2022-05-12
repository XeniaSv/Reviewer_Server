const bcrypt = require("bcrypt");
const UserModel = require('../models/user');
const RatingModel = require("../models/rating");
const ReviewModel = require('../models/review');
const ApiError = require('../exceptions/apiError');
const UserDto = require("../dtos/authDtos/UserDto");

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
        if (!isAdmin)
            throw ApiError.NotAdmin('You are not allowed!');

        if (userId !== paramId && !isAdmin) {
            throw ApiError.NotYourAccount();
        }

        try {
            await RatingModel.deleteMany({user: paramId});
            await ReviewModel.deleteMany({author: paramId});
            await ReviewModel.updateMany({$pull: {likes: paramId}});
            await UserModel.findByIdAndDelete(paramId);
        } catch (e) {
            throw ApiError.BadRequest('User with such id not found');
        }
    }

    async findUser(id) {
        const userModel = await UserModel.findById(id);
        if (!userModel) {
            throw ApiError.BadRequest('User with such id not found');
        }
        return new UserDto(userModel);
    }

    async getUsers(isAdmin) {
        if (!isAdmin) {
            throw new ApiError.NotAdmin('You are not allowed to see all users');
        }

        const userModels = await UserModel.find();
        const userDtos = [];

        for (const userModel of userModels) {
            userDtos.push(new UserDto(userModel));
        }

        return userDtos;
    }
}

module.exports = new UserService();