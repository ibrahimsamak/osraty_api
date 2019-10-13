
const Joi = require('joi');
const mongoose = require('mongoose');


//المشرفين
const Rateschema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    customer_deal: {
        type: Number
    },
    tool_deal: {
        type: Number
    },
    install_deal: {
        type: Number
    },
    network_deal: {
        type: Number
    },
    safe: {
        type: Number
    },
    tools_safe: {
        type: Number
    },
    looks: {
        type: Number
    },
    car: {
        type: Number
    },
    total: {
        type: Number
    },
    Notes: {
        type: String
    }, createAt: {
        type: Date
    },
    dayName: {
        type: String
    },
    dayValue: {
        type: Number
    },
    Order_id: {
        type: String
    },
    superadmin_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'superadmins'
    }
}, { versionKey: false });

const Rates = mongoose.model('rate', Rateschema)
exports.Rates = Rates; 
