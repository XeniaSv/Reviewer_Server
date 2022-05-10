module.exports = class AvgRatingDto {
    item;
    onItem;
    rate;

    constructor(item, onItem, rate) {
        this.item = item;
        this.onItem = onItem;
        this.rate = rate;
    }
}