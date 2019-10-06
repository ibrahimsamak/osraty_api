

const Joi = require('joi');
const mongoose = require('mongoose');

//المتبرع
const Adminschema = mongoose.Schema({
    full_name: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    Id_no: {
        type: String,
    },
    isActivate: {
        type: Boolean,
    },
    isBlock: {
        type: Boolean,
    },
    token: {
        type: String,
        required: false
    },
    fcmToken: {
        type: String,
        required: false
    },
    paymentMethod_type: {
        type: String
    },
    type: {
        type: String
    },
    ammount: {
        type: Number
    },
    createAt: {
        type: Date
    },
    paymentMethod_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentMethod'
    }
}, { versionKey: false });

const Admin = mongoose.model('admins', Adminschema)
exports.Admins = Admin; 
