const Joi = require('joi');
const mongoose = require('mongoose');

const paymentMethodSchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  details: {
    type: String
  }
}, { versionKey: false });

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  }
}, { versionKey: false });

const StaticPageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  }
}, { versionKey: false });

const ContactOptionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  email: {
    type: String
  },
  title: {
    type: String
  },
  createAt: {
    type: Date
  }
}, { versionKey: false });


const paymentMethod = mongoose.model('paymentMethod', paymentMethodSchema);
const category = mongoose.model('category', categorySchema);
const paymentFor = mongoose.model('paymentFor', categorySchema);
const loans = mongoose.model('loan', categorySchema);
const StaticPage = mongoose.model('StaticPage', StaticPageSchema);
const ContactOption = mongoose.model('ContactOption', ContactOptionSchema);
const Jobs = mongoose.model('Jobs', categorySchema);


exports.paymentMethods = paymentMethod;
exports.categories = category;
exports.paymentFors = paymentFor;
exports.loans = loans;
exports.StaticPage = StaticPage;
exports.ContactOption = ContactOption;
exports.jobs = Jobs;

