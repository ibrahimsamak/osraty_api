

const Joi = require('joi');
const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


//العمليات المالية
const PaymetSchema = mongoose.Schema({
    createAt: {
        type: Date,
    },
    ammount: {
        type: Number,
    },
    isActive: {
        type: Boolean
    },
    status: {
        type: Number
    },
    flag: {
        type: Number
    },
    from_user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'admins'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    methodType: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentmethods'
    },
    methodFor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentfors'
    }
}, { versionKey: false });


// الطلبات
const RequestSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    status: {
        type: Number
    },
    createAt: {
        type: Date,
    },
    ammount: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    notes: {
        type: String
    },
    other:{
        type:String,
        default:""
    },
    type: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentfors'
    },
    other_file1:{
        type:String
    },
    other_file2:{
        type:String
    },
    other_file3:{
        type:String
    },
}, { versionKey: false });

const RequestApproveSchema = mongoose.Schema({
    superAdmin_id: {
        type: String
    },
    approve: {
        type: Boolean
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'requests'
    }
}, { versionKey: false });

const BankSchema = mongoose.Schema({

    // branch_ar: {
    //     type: String
    // },
    // branch_en: {
    //     type: String
    // },
    // name_ar: {
    //     type: String
    // },
    // name_en: {
    //     type: String
    // },
    // nationality_ar: {
    //     type: String
    // },
    // nationality_en: {
    //     type: String
    // },
    // id_no: {
    //     type: String
    // },
 
    type: {
        type: String
    },
    user_id: {
        type: String
    }
}, { versionKey: false });

RequestSchema.plugin(mongooseAggregatePaginate);
const payment = mongoose.model('payments', PaymetSchema)
const request = mongoose.model('requests', RequestSchema)
const request_approve = mongoose.model('request_approve', RequestApproveSchema)
const bankDetails = mongoose.model('bankdetails', BankSchema)

exports.requests = request;
exports.payments = payment;
exports.request_approve = request_approve;
exports.bankDetails = bankDetails; 
