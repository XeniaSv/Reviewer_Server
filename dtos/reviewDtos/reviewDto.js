module.exports = class ReviewDto {
    id;
    author;
    authorId;
    itemId;
    itemTitle;
    onItem;
    likes;
    title;
    tags;
    textReview;
    createdAt;

    constructor(username, model, itemTitle='') {
        this.id = model._id;
        this.authorId = model.author;
        this.author = username;
        this.itemId = model.item;
        this.itemTitle = itemTitle;
        this.onItem = model.onItem;
        this.likes = model.likes.length;
        this.title = model.title;
        this.tags = model.tags;
        this.textReview = model.textReview;
        this.createdAt = model.createdAt;
    }
}