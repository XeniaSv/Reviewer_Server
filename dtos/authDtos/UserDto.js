module.exports = class UserDto {
    id;
    username;
    email;
    isAdmin;

    constructor(model) {
        this.id = model._id;
        this.username = model.username;
        this.email = model.email;
        this.isAdmin = model.isAdmin;
    }
}