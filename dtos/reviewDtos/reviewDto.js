module.exports = class ReviewDto {
    id;
    author;
    itemId;
    onItem;
    likes;
    title;
    tags;
    textReview;
    createdAt;

    constructor(username, model) {
        this.id = model._id;
        this.author = username;
        this.itemId = model.item;
        this.onItem = model.onItem;
        this.likes = model.likes.length;
        this.title = model.title;
        this.tags = model.tags;
        this.textReview = model.textReview;
        this.createdAt = model.createdAt;
    }
}