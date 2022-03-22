const authService = require('../service/authService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiError');

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            console.log(req.body)
            const {username, email, password} = req.body;
            const authData = authService.register(username, email, password);
            res.cookie('refreshToken', authData.refreshToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
            return res.status(201).json(authData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const {email, password} = req.body;
            const authData = await authService.login(email, password);
            res.cookie('refreshToken', authData.refreshToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
            return res.status(200).json(authData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }
        catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const authData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', authData.refreshToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
            return res.json(authData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();