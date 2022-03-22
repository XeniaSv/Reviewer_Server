const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    director: {type: String},
    duration: {type: String},
    year: {type: String},
    genre: [{type: String}],
    limit: {type: String},
    cast: [{type: String}],
    desc: {type: String},
    img: {type: String},
    imgSm: {type: String}
}, {timestamps: true});

module.exports = mongoose.model('Series', SeriesSchema);