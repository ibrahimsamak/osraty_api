const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    title: {
        type: String
    },
    details: {
        type: String
    },
    image: {
        type: String
    },
    createAt: {
        type: Date
    },
    type: {
        type: Number
    },
    place:{
        type: String
    }
}, { versionKey: false });

const News = mongoose.model('news', NewsSchema);

exports.News = News
