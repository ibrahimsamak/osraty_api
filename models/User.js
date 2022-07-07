const Joi = require('joi');
const mongoose = require('mongoose');

//المستفيد
const UserSchema = mongoose.Schema({
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
    gender: {
        type: String
    },
    social_status: {
        type: String,
    },
    has_children: {
        type: Boolean
    },
    children_no: {
        type: Number
    },
    createAt: {
        type: Date
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isWork: {
        type: Boolean
    },
    work_type: {
        type: String
    },
    house_type: {
        type: String
    },
    income: {
        type: Number
    },
    isObligation: {
        type: Boolean
    },
    Obligation: {
        type: Number
    },
    number_of_dependents: {
        type: Number
    },
    benefit_no: {
        type: Number
    },
    payment_for_no: {
        type: Number
    },
    notes: {
        type: String
    },
    isActivate: {
        type: Boolean
    },
    isActivePayment:{
        type: Boolean
    },
    fcmToken: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    payment_for: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentfors'
    },
    user_type:{
        type:String
    },
    id_file:{
        type:String
    },
    bank_name:{
        type:String
    },
    account_no:{
        type:String
    },
    iban_file:{
        type:String
    },
    iban:{
        type:String
    },
}, { versionKey: false });

const Users = mongoose.model('users', UserSchema);


exports.Users = Users;
