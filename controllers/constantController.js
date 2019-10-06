const boom = require('boom')
const util = require('util');


// Get Data Models
const { jobs, categories, paymentMethods, paymentFors, loans, StaticPage, ContactOption } = require('../models/Constant')

// cPanel
exports.getAllConstants = async (req, reply) => {
    try {
        const staticpages = await StaticPage.find().sort({ _id: -1 });
        const paymentfor = await paymentFors.find().sort({ _id: -1 });
        const paymentMethod = await paymentMethods.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            staticpages: staticpages,
            paymentfor:paymentfor,
            paymentMethod:paymentMethod
        }
        return response

    } catch (err) {
        throw boom.boomify(err)
    }
}


exports.addcategories = async (req, reply) => {
    try {
        let _categories = new categories({
            name: req.body.name
        });

        let rs = await _categories.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updatecategories = async (req, reply) => {
    try {
        const _categories = await categories.findByIdAndUpdate((req.params.id), {
            name: req.body.name,
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _categories
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deletecategories = async (req, reply) => {
    try {
        const _categories = await categories.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getcategories = async (req, reply) => {
    try {
        const _categories = await categories.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _categories
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}


exports.addpaymentMethod = async (req, reply) => {
    try {
        let _paymentMethods = new paymentMethods({
            name: req.body.name,
            details: req.body.details
        });

        let rs = await _paymentMethods.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updatepaymentMethod = async (req, reply) => {
    try {
        const _paymentMethods = await paymentMethods.findByIdAndUpdate((req.params.id), {
            name: req.body.name,
            details: req.body.details
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentMethods
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deletepaymentMethods = async (req, reply) => {
    try {
        const _paymentMethods = await paymentMethods.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getpaymentMethods = async (req, reply) => {
    try {
        const _paymentMethods = await paymentMethods.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentMethods
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}


exports.addloans = async (req, reply) => {
    try {
        let _loans = new loans({
            name: req.body.name
        });

        let rs = await _loans.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateloans = async (req, reply) => {
    try {
        const _loans = await loans.findByIdAndUpdate((req.params.id), {
            name: req.body.name
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _loans
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteloans = async (req, reply) => {
    try {
        const _loans = await loans.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getloans = async (req, reply) => {
    try {
        const _loans = await loans.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _loans
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}


exports.addJobs = async (req, reply) => {
    try {
        let _jobs = new jobs({
            name: req.body.name
        });

        let rs = await _jobs.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateJobs = async (req, reply) => {
    try {
        const _jobs = await jobs.findByIdAndUpdate((req.params.id), {
            name: req.body.name,
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _jobs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteJobs = async (req, reply) => {
    try {
        const _jobs = await jobs.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getJobs = async (req, reply) => {
    try {
        const _jobs = await jobs.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _jobs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}



exports.addpaymentfor = async (req, reply) => {
    try {
        let _paymentFors = new paymentFors({
            name: req.body.name
        });

        let rs = await _paymentFors.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updatepaymentFors = async (req, reply) => {
    try {
        const _paymentFors = await paymentFors.findByIdAndUpdate((req.params.id), {
            name: req.body.name
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentFors
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deletepaymentFors = async (req, reply) => {
    try {
        const _paymentFors = await paymentFors.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getpaymentfor = async (req, reply) => {
    try {
        const _paymentFors = await paymentFors.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentFors
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}


exports.getStaticPage = async (req, reply) => {
    try {
        const staticpages = await StaticPage.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: staticpages
        }
        return response

    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getSingleStatic = async (req, reply) => {
    try {
        const StaticPages = await StaticPage.findById(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: StaticPages
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addStatic = async (req, reply) => {
    try {
        let staticpages = new StaticPage({
            title: req.body.title,
            content: req.body.content
        });

        let rs = await staticpages.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateStatic = async (req, reply) => {
    try {
        const staticpages = await StaticPage.findByIdAndUpdate((req.params.id), {
            title: req.body.title, content: req.body.content
        }, { new: true })
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: staticpages
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteStatic = async (req, reply) => {
    try {
        const staticpages = await StaticPage.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}



exports.getContact = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await ContactOption.find().count();
        await ContactOption.find()
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    status_code: 200,
                    message: 'returned successfully',
                    pagenation: {
                        size: result.length,
                        totalElements: total,
                        totalPages: Math.floor(total / limit),
                        pageNumber: page
                    }
                }
                reply.send(response)
            });
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.contactSearch = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await ContactOption.find({ $or: [{ "name": { "$regex": req.body.name, "$options": "i" } }, { "title": { "$regex": req.body.title, "$options": "i" } }] }).count();
        await ContactOption.find({ $or: [{ "name": { "$regex": req.body.name, "$options": "i" } }, { "title": { "$regex": req.body.title, "$options": "i" } }] })
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    status_code: 200,
                    message: 'returned successfully',
                    pagenation: {
                        size: result.length,
                        totalElements: total,
                        totalPages: Math.floor(total / limit),
                        pageNumber: page
                    }
                }
                reply.send(response)
            });
    } catch (err) {
        throw boom.boomify(err)
    }
}



exports.addContact = async (req, reply) => {
    try {
        let ContactOptions = new ContactOption({
            name: req.body.name,
            title: req.body.title,
            message: req.body.message,
            email: req.body.email,
            createAt: Date()
        });


        let rs = await ContactOptions.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteContact = async (req, reply) => {
    try {
        const ContactOptions = await ContactOption.findByIdAndRemove(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}
