const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    director: {type: String},
    duration: {type: String},
    year: {type: String},
    genre: [{type: String}],
    limit: {type: String},
    cast: [{type: String}],
    desc: {type: String},
    img: {type: String},
    imgSm: {type: String},
    isSeries: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('Movie', MovieSchema);