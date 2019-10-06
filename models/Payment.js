

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
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentMethod'
    },
    methodFor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentFor'
    }
}, { versionKey: false });


// الطلبات
const RequestSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
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
    type: {
        type: mongoose.Schema.Types.ObjectId, ref: 'paymentFor'
    }
}, { versionKey: false });

RequestSchema.plugin(mongooseAggregatePaginate);
const payment = mongoose.model('payments', PaymetSchema)
const request = mongoose.model('requests', RequestSchema)
exports.requests = request;
exports.payments = payment; 
