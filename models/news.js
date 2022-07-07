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

const ArticlsSchema = mongoose.Schema({
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

const Article = mongoose.model('article', ArticlsSchema);

const CommentSchema = mongoose.Schema({
    user_name: { type: String },
    news_id: {  type: String },
    comment: { type: String },
    createAt: { type: Date },

}, { versionKey: false });

const Comments = mongoose.model('comment', CommentSchema);

exports.News = News
exports.Articles = Article
exports.Comments = Comments
