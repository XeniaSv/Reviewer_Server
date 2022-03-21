module.exports = class BookDto {
    id;
    title;
    author;
    pages;
    year;
    genre;
    language;
    desc;
    img;
    imgSm;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.author = model.author;
        this.pages = model.pages;
        this.year = model.year;
        this.genre = model.genre;
        this.language = model.language;
        this.desc = model.desc;
        this.img = model.img;
        this.imgSm = model.imgSm;
    }
}