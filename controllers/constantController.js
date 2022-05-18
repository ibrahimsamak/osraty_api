const boom = require('boom')
const util = require('util');
const cloudinary = require('cloudinary');
const fs = require('fs');


// Get Data Models
const { settings,bankfiles, getCurrentDateTime, jobs, categories, paymentMethods, paymentFors, loans, StaticPage, ContactOption, BankAccount } = require('../models/Constant')


cloudinary.config({
    cloud_name: 'dztwo3qso',
    api_key: '761391876145368',
    api_secret: 'Sqfov5ua8c3514TJtzj27gpU9CY'
});

async function uploadImages(img) {
    return new Promise(function (resolve, reject) {
        cloudinary.v2.uploader.upload('./uploads/' + img,
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log(result, error)
                    img = result['url']
                    resolve(img);
                }
            });
    });

}

// cPanel
/**
 * Retrieve all settings.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getAllSettings = async (req, reply) => {
    try {
        const _settings = await settings.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _settings,
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Retrieve all constants.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
            paymentfor: paymentfor,
            paymentMethod: paymentMethod
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Addcategories.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Updatecategories.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Deletecategories.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deletecategories = async (req, reply) => {
    try {
        const _categories = await categories.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Getcategories.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getcategories = async (req, reply) => {
    try {
        const _categories = await categories.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _categories
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Addpayment method.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Updatepayment method.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Deletepayment methods.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deletepaymentMethods = async (req, reply) => {
    try {
        const _paymentMethods = await paymentMethods.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Getpayment methods.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getpaymentMethods = async (req, reply) => {
    try {
        const _paymentMethods = await paymentMethods.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentMethods
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Addloans.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Updateloans.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Deleteloans.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deleteloans = async (req, reply) => {
    try {
        const _loans = await loans.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Getloans.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getloans = async (req, reply) => {
    try {
        const _loans = await loans.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _loans
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Create jobs.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Update jobs.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Remove jobs.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deleteJobs = async (req, reply) => {
    try {
        const _jobs = await jobs.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Retrieve jobs.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getJobs = async (req, reply) => {
    try {
        const _jobs = await jobs.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _jobs
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}



/**
 * Addpaymentfor.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Updatepayment fors.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Deletepayment fors.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deletepaymentFors = async (req, reply) => {
    try {
        const _paymentFors = await paymentFors.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Getpaymentfor.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getpaymentfor = async (req, reply) => {
    try {
        const _paymentFors = await paymentFors.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _paymentFors
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Retrieve static page.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getStaticPage = async (req, reply) => {
    try {
        const staticpages = await StaticPage.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: staticpages
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Retrieve single static.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getSingleStatic = async (req, reply) => {
    try {
        const StaticPages = await StaticPage.findById(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: StaticPages
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Create static.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Update static.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
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
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Remove static.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deleteStatic = async (req, reply) => {
    try {
        const staticpages = await StaticPage.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}



/**
 * Retrieve bank account.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getBankAccount = async (req, reply) => {
    try {
        const _BankAccount = await BankAccount.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _BankAccount
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Retrieve single bank account.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getSingleBankAccount = async (req, reply) => {
    try {
        const _BankAccount = await BankAccount.findById(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _BankAccount
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Update bank account.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.updateBankAccount = async (req, reply) => {
    try {
        const _BankAccount = await BankAccount.findByIdAndUpdate((req.params.id), {
            title: req.body.title, content: req.body.content
        }, { new: true })
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _BankAccount
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Remove bank.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deleteBank = async (req, reply) => {
    try {
        const _BankAccount = await BankAccount.findByIdAndRemove(req.params.id);

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: {}
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}



/**
 * Retrieve contact.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getContact = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await ContactOption.find().count();
        var result = await ContactOption.find()
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
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
    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Contact search.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.contactSearch = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await ContactOption.find({ $or: [{ "name": { "$regex": req.body.name, "$options": "i" } }, { "title": { "$regex": req.body.title, "$options": "i" } }] }).count();
        var result = await ContactOption.find({ $or: [{ "name": { "$regex": req.body.name, "$options": "i" } }, { "title": { "$regex": req.body.title, "$options": "i" } }] })
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
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
    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Create contact.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.addContact = async (req, reply) => {
    try {
        let ContactOptions = new ContactOption({
            name: req.body.name,
            title: req.body.title,
            message: req.body.message,
            email: String(req.body.email).toLowerCase(),
            createAt: getCurrentDateTime()
        });


        let rs = await ContactOptions.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'تم ارسال رسالتك الى الادارة .. سيتم الرد عليكم عبر البريد الالكتروني في أقرب وقت',
            items: rs
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Remove contact.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.deleteContact = async (req, reply) => {
    try {
        const ContactOptions = await ContactOption.findByIdAndRemove(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}


/**
 * Retrieve files.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getFiles = async (req, reply) => {
    try {
        const _bankfiles = await bankfiles.find();
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _bankfiles
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Retrieve single files.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.getSingleFiles = async (req, reply) => {
    try {
        const _bankfiles = await bankfiles.findById(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _bankfiles
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Create file.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.addFile = async (req, reply) => {
    try {
        if (req.raw.files) {
            const files = req.raw.files
            let fileArr = []
            for (let key in files) {
                fileArr.push({
                    name: files[key].name,
                    mimetype: files[key].mimetype
                })
            }
            var data = new Buffer(files.filename.data);
            fs.writeFile('./uploads/' + files.filename.name, data, 'binary', function (err) {
                if (err) {
                    console.log("There was an error writing the image")
                }
                else {
                    console.log("The sheel file was written")
                }
            });

            let img = '';
            await uploadImages(files.filename.name).then((x) => {
                img = x;
            });
            console.log(img)

            let Advs = new bankfiles({
                file_details: req.raw.body.title,
                file_url: img
            });
            let rs = await Advs.save();
            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: rs
            }
            reply.send(response);
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

/**
 * Update file.
 *
 * @param {object} req - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @returns {Promise<void>}
 */
exports.updateFile = async (req, reply) => {
    try {
        if (req.raw.files) {
            const files = req.raw.files
            let fileArr = []
            for (let key in files) {
                fileArr.push({
                    name: files[key].name,
                    mimetype: files[key].mimetype
                })
            }
            var data = new Buffer(files.filename.data);
            fs.writeFile('./uploads/' + files.filename.name, data, 'binary', function (err) {
                if (err) {
                    console.log("There was an error writing the image")
                }
                else {
                    console.log("The sheel file was written")
                }
            });

            let img = '';
            await uploadImages(files.filename.name).then((x) => {
                img = x;
            });

            const _bankfiles = await bankfiles.findByIdAndUpdate((req.params.id), {
                file_details: req.raw.body.title,
                file_url: img
            }, { new: true })
            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: _bankfiles
            }
            reply.send(response)


        } else {
            const _bankfiles = await bankfiles.findByIdAndUpdate((req.params.id), {
                file_details: req.raw.body.title
            }, { new: true })

            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: _bankfiles
            }
            reply.send(response)

        }
    } catch (err) {
        throw boom.boomify(err)
    }
}