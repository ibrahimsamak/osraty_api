const Joi = require('joi');
const mongoose = require('mongoose');

const Notificationschema = mongoose.Schema({
    from: {
        type: String,
        required: false
    },
    user_id: {
        type: String
    },
    title: {
        type: String,
        required: false
    },
    msg: {
        type: String,
        required: false
    },
    dt_date: {
        type: Date,
        required: false
    },
    type: {
        type: Number,
        required: false
    },
    body_parms: {
        type: String,
        required: false
    },
    isRead: {
        type: Boolean,
        required: false
    },
}, { versionKey: false });


Notificationschema.index({ "user_id": 1, "isRead": 1 })
const Notifications = mongoose.model('notifications', Notificationschema);

exports.Notifications = Notifications;
