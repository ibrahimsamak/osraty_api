

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
    isActivePayment: {
        type: Boolean,
    },
    isBlock: {
        type: Boolean,
    },
    token: {
        type: String,
    },
    fcmToken: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentmethods'
    },
    user_type:{
        type:String
    }
}, { versionKey: false });

const Admin = mongoose.model('admins', Adminschema)
exports.Admins = Admin; 
