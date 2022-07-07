const Joi = require('joi');
const mongoose = require('mongoose');



const settingsSchema = mongoose.Schema({
  key: {
    type: String,
  },
  value: {
    type: String
  }
}, { versionKey: false });

const paymentMethodSchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  details: {
    type: String
  },
  type:{
    type:String,
    enum:["once","month","year"]
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

const FileSchema = mongoose.Schema({
  file_name: {
    type: String
  },
  file_url: {
    type: String
  },
  file_details: {
    type: String
  }
}, { versionKey: false });


function getCurrentDateTime() {
  var utc = new Date();
  var current = utc.setHours(utc.getHours() + 3);
  return current
}

const paymentMethod = mongoose.model('paymentmethods', paymentMethodSchema);
const category = mongoose.model('category', categorySchema);
const paymentFor = mongoose.model('paymentfors', categorySchema);
const loans = mongoose.model('loans', categorySchema);
const StaticPage = mongoose.model('staticpages', StaticPageSchema);
const BankAccount = mongoose.model('bank', StaticPageSchema);
const ContactOption = mongoose.model('contactoptions', ContactOptionSchema);
const Jobs = mongoose.model('jobs', categorySchema);
const Settings = mongoose.model('settings', settingsSchema);
const bankfiles = mongoose.model('bankfiles', FileSchema);


exports.paymentMethods = paymentMethod;
exports.categories = category;
exports.paymentFors = paymentFor;
exports.loans = loans;
exports.StaticPage = StaticPage;
exports.ContactOption = ContactOption;
exports.jobs = Jobs;
exports.settings = Settings;
exports.bankfiles = bankfiles;
exports.BankAccount = BankAccount;
exports.getCurrentDateTime = getCurrentDateTime;
