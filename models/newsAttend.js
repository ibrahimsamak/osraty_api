const mongoose = require('mongoose');

const NewsAttendSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    },
    news_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'News'
    },
    createAt: {
        type: Date
    },
    isGoing: {
        type: Boolean
    }
}, { versionKey: false });

const NewsAttend = mongoose.model('NewsAttend', NewsAttendSchema);

exports.NewsAttend = NewsAttend
