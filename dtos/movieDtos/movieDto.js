module.exports = class MovieDto{
    id;
    title;
    director;
    duration;
    year;
    genre;
    limit;
    cast;
    desc;
    img;
    imgSm;
    isSeries;

    constructor(model) {
        this.id = model._id;
        this.title = model.title;
        this.director = model.director;
        this.duration = model.duration;
        this.year = model.year;
        this.genre = model.genre;
        this.limit = model.limit;
        this.cast = model.cast;
        this.desc = model.desc;
        this.img = model.img;
        this.imgSm = model.imgSm;
        this.isSeries = model.isSeries;
    }
}