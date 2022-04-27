const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    author: {type: String, ref: 'User', require: true},
    item: {type: String, refPath: 'onItem', require: true},
    onItem: {type: String, enum: ['Movie', 'Series', 'Book'], require: true},
    likes: {
        type: [
            {type: String, ref: 'User'}
        ],
        default: []
    },
    title: {type: String, require: true},
    tags: [{type: String, require: true}],
    textReview: {type: String, require: true}
}, {timestamps: true})

module.exports = mongoose.model('Review', ReviewSchema)

// likes: [{type: String, ref: 'User', default: []}],
