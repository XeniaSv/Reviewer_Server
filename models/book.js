const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    author: {type: String},
    pages: {type: Number},
    year: {type: String},
    genre: [{type: String}],
    language: {type: String},
    desc: {type: String},
    img: {type: String},
    imgSm: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('Book', BookSchema)