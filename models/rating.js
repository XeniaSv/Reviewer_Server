const mongoose = require('mongoose');

const RatingModel = mongoose.Schema({
    user: {type: String, ref: 'User', require: true},
    item: {type: String, refPath: 'onItem', require: true},
    onItem: {type: String, enum: ['Movie', 'Series', 'Book'], require: true},
    rate: {type: Number, min: 1, max: 5, require: true}
}, {timestamps: true});

module.exports = mongoose.model('Rating', RatingModel)