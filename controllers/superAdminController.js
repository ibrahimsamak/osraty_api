// External Dependancies
const boom = require('boom')
const jwt = require('jsonwebtoken');
const config = require('config');
const util = require('util');

// Get Data Models
const { SuperAdmin } = require('../models/superAdmin')

// Get all Admins
exports.getAdmins = async (req, reply) => {
    try {
        const SuperAdmins = await SuperAdmin.find().sort({ _id: -1 });
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: SuperAdmins
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single Admin by ID
exports.getSingleAdmin = async (req, reply) => {
    try {
        const SuperAdmins = await SuperAdmin.findById((req.params.id))

        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: SuperAdmins
        }
        reply.send(response)

    } catch (err) {
        throw boom.boomify(err)
    }
}

// Add a new Admin
exports.addAdmin = async (req, reply) => {
    try {
        let Admins = new SuperAdmin({
            full_name: req.body.full_name,
            email: String(req.body.email).toLowerCase(),
            password: req.body.password,
            phone_number: req.body.phone_number,
            roles: req.body.roles,
            token: jwt.sign({ _id: req.body.id }, config.get('jwtPrivateKey'), {
                expiresIn: '365d'
            }),
            job_id: req.body.job_id
        });

        let rs = await Admins.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: rs
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}

//login
exports.login = async (req, reply) => {
    try {

        const Admins = await SuperAdmin.findOne({ $and: [{ email: String(req.body.email).toLowerCase() }, { password: req.body.password }] })

        if (Admins) {
             let newAdmin =  await SuperAdmin.findByIdAndUpdate((Admins._id), {
                token: jwt.sign({ _id: Admins._id }, config.get('jwtPrivateKey'), {
                    expiresIn: '365d'
                }),
            }, { new: true })

            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: newAdmin
            }
            reply.send(response)
            return

        } else {
            const response = {
                status_code: 404,
                status: false,
                message: 'return succssfully',
                items: null
            }
            reply.send(response)

        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

// refresh token
exports.refreshToken = async (req, reply) => {
    try {

        const user = await SuperAdmin.findByIdAndUpdate((req.body._id), {
            fcmToken: req.body.fcmToken
        }, { new: true })

        if (!user) {
            const response = {
                status_code: 404,
                status: false,
                message: 'حدث خطأ الرجاء المحاولة مرة اخرى',
                items: []
            }
            reply.send(response)

        }
        else {
            const response = {
                status_code: 200,
                status: true,
                message: '',
                items: user
            }
            reply.send(response)

        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

// delete admin
exports.deleteAdmin = async (req, reply) => {
    const Admins = await SuperAdmin.findByIdAndRemove(req.params.id);
    const response = {
        status_code: 200,
        status: true,
        message: 'تمت العملية بنجاح',
        items: []
    }
    reply.send(response)


}

// Update an existing Admin
exports.updateAdmin = async (req, reply) => {
    try {
        const Admins = await SuperAdmin.findByIdAndUpdate((req.params.id), {
            full_name: req.body.full_name,
            email: String(req.body.email).toLowerCase(),
            password: req.body.password,
            phone_number: req.body.phone_number,
            roles: req.body.roles,
            job_id: req.body.job_id
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: Admins
        }
        reply.send(response)


    } catch (err) {
        throw boom.boomify(err)
    }
}

//logout
exports.logout = async (req, reply) => {
    try {
        const User_id = req.user._id
        const user = await SuperAdmin.findByIdAndUpdate((User_id), {
            fcmToken: '',
            token: ''
        }, { new: true })

        if (!user) {
            const response = {
                status_code: 404,
                status: false,
                message: 'حدث خطأ الرجاء المحاولة مرة اخرى',
                items: []
            }
            reply.send(response)

        }
        else {
            const response = {
                status_code: 200,
                status: true,
                message: 'تم تسجيل الخروج بنجاح',
                items: user
            }
            reply.send(response)

        }
    } catch (err) {
        throw boom.boomify(err)
    }
}


