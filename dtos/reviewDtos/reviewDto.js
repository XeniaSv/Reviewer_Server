module.exports = class ReviewDto {
    id;
    author;
    itemId;
    onItem;
    title;
    tags;
    textReview;

    constructor(model) {
        this.id = model._id;
        this.author = model.author;
        this.itemId = model.item;
        this.onItem = model.onItem;
        this.title = model.title;
        this.tags = model.tags;
        this.textReview = model.textReview;
    }
}