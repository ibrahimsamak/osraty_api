const mongoose = require('mongoose');

const NewsAttendSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    news_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'news'
    },
    createAt: {
        type: Date
    },
    isGoing: {
        type: Boolean
    }
}, { versionKey: false });

const NewsAttend = mongoose.model('newsattends', NewsAttendSchema);

exports.NewsAttend = NewsAttend
