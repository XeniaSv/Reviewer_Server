module.exports = class RatingDto {
    id;
    user;
    item;
    onItem;
    rate;

    constructor(module) {
        this.id = module._id;
        this.user = module.user;
        this.item = module.item;
        this.onItem = module.onItem;
        this.rate = module.rate;
    }
}