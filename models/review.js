const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    author: {type: String, ref: 'User', require: true},
    item: {type: String, ref: 'onItem', require: true},
    onItem: {type: String, enum: ['Movie', 'Series', 'Book'], require: true},
    likes: [{type: String, ref: 'User'}],
    title: {type: String, require: true},
    tags: [{type: String}],
    textReview: {type: String, require: true}
}, {timestamps: true})

module.exports = mongoose.model('Review', ReviewSchema)