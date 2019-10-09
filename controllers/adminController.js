// External Dependancies
const boom = require('boom')
const jwt = require('jsonwebtoken');
const config = require('config');
const util = require('util');
var nodemailer = require('nodemailer');
const cron = require('node-cron');


const { Admins } = require('../models/Admin')
const { Users } = require('../models/User')
const { encryptPassword } = require('../utils/utils')

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });

var transporter = nodemailer.createTransport({
    host: 'webhosting2035.is.cc',
    port: 465,
    secure: true,
    auth: {
        user: 'no-reply@souqgaz.com',
        pass: 'no-reply@souqgaz.com'
    }
});


// Get all Admins
exports.getAdmins = async (req, reply) => {
    try {
        if (req.query.page) {
            var page = parseInt(req.query.page, 10)
            var limit = parseInt(req.query.limit, 10)

            const total = await Admins.find().count();
            const _Users = await Admins.find()
                .populate('paymentMethod_id')
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
        } else {
            await Admins.find()
                .populate('paymentMethod_id')
                .sort({ _id: -1 })
                .exec(function (err, result) {
                    const response = {
                        items: result,
                        status_code: 200,
                        message: 'returned successfully',
                        pagenation: {
                            size: 0,
                            totalElements: 0,
                            totalPages: 0,
                            pageNumber: 0
                        }
                    }
                    reply.send(response)
                });
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get search
exports.getUsersSearch = async (req, reply) => {
    try {

        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await Admins.find({ $or: [{ "phone_number": { "$regex": req.body.phone_number, "$options": "i" } }, { "Id_no": { "$regex": req.body.Id_no, "$options": "i" } }] }).count();
        await Admins.find({ $or: [{ "phone_number": { "$regex": req.body.phone_number, "$options": "i" } }, { "full_name": { "$regex": req.body.full_name, "$options": "i" } }, { "Id_no": { "$regex": req.body.Id_no, "$options": "i" } }] })
            .populate('paymentMethod_id')
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

// Get single Admins by ID
exports.getSingleAdmins = async (req, reply) => {
    try {
        const _Admins = await Admins.findById((req.params.id))
            .populate('payment_for')

        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: _Admins
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Add a new Admins
exports.addAdmins = async (req, reply) => {
    try {
        const pervAdminEmail = await Admins.findOne({ $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }] }).lean()
        const pervUserEmail = await Users.findOne({ $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }] }).lean()
        if (pervAdminEmail) {
            // emeail is exsits 
            const response = {
                status_code: 400,
                status: false,
                message: 'البريد الالكتروني او رقم الجوال موجود مسبقا',
                items: null
            }
            return response
        } else if (pervUserEmail) {
            // emeail is exsits 
            const response = {
                status_code: 400,
                status: false,
                message: 'البريد الالكتروني او رقم الجوال موجود مسبقا',
                items: null
            }
            return response
        } else {
            let _Admins = new Admins({
                full_name: req.body.full_name,
                email: req.body.email,
                password: encryptPassword(req.body.password),
                phone_number: req.body.phone_number,
                Id_no: req.body.Id_no,
                fcmToken: req.body.fcmToken,
                token: jwt.sign({ _id: req.body.id }, config.get('jwtPrivateKey'), {
                    expiresIn: '365d'
                }),
            });

            let rs = await _Admins.save();
            const response = {
                status_code: 200,
                status: true,
                message: 'تمت العملية بنجاح',
                items: rs
            }
            return response
        }

    } catch (err) {
        throw boom.boomify(err)
    }
}

// delete Admins
exports.BlockeAdmins = async (req, reply) => {
    const _Admins = await Admins.findByIdAndUpdate((req.params.id), {
        isBlock: req.body.isBlock,
    }, { new: true })

    const response = {
        status_code: 200,
        status: true,
        message: 'تمت العملية بنجاح',
        items: _Admins
    }
    return response

}

// activate Admins 
exports.activateAdmins = async (req, reply) => {
    const _Admins = await Admins.findByIdAndUpdate((req.params.id), {
        isActivate: req.body.isActivate,
    }, { new: true })

    const response = {
        status_code: 200,
        status: true,
        message: 'تمت العملية بنجاح',
        items: _Admins
    }
    return response

}

// Update an existing Admins
exports.updateAdmins = async (req, reply) => {
    try {
        const _Admins = await Admins.findByIdAndUpdate((req.params.id), {
            createAt: Date(),
            paymentMethod_type: req.body.paymentMethod_type,
            ammount: req.body.ammount,
            paymentMethod_id: req.body.paymentMethod_id,
            type: req.body.type
        }, { new: true })

        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _Admins
        }
        return response

    } catch (err) {
        throw boom.boomify(err)
    }
}

// login Admins
exports.loginAdmins = async (req, reply) => {
    try {
        const pass = encryptPassword(req.body.password)
        const _Admins = await Admins.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }] }, { password: pass }] })

        if (_Admins) {
            await Admins.findByIdAndUpdate((_Admins._id), {
                fcmToken: req.body.fcmToken,
            }, { new: true })

            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: _Admins
            }
            return response
        } else {
            const response = {
                status_code: 400,
                status: false,
                message: 'email or passord are incorret',
                items: _Admins
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}


//forget password
exports.forgetPasswordAdmins = async (req, reply) => {
    try {
        const _Users = await Admins.findOne({ $and: [{ email: req.body.email }, { phone_number: req.body.phone_number }] })
        if (_Users) {
            var newPassword = makeid();
            const update = await Admins.findByIdAndUpdate(_Users._id, { password: newPassword }, { new: true })
            var msg = `
           <!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#f8fafc;color:#74787e;height:100%;line-height:1.4;margin:0;width:100%!important;word-break:break-word">


    <table class="m_1006477609114479258wrapper" width="100%" cellpadding="0" cellspacing="0"
           style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#f8fafc;margin:0;padding:0;width:100%">
        <tbody>
        <tr>
            <td align="center"
                style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                <table class="m_1006477609114479258content" width="100%" cellpadding="0" cellspacing="0"
                       style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:0;padding:0;width:100%">
                    <tbody>
                    <tr>
                        <td class="m_1006477609114479258header"
                            style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:25px 0;text-align:center">
                            <a href="www.souqgaz.com"
                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#bbbfc3;font-size:19px;font-weight:bold;text-decoration:none"
                               target="_blank"
                               data-saferedirecturl="www.souqgaz.com">
                                Souqgaz
                            </a>
                        </td>
                    </tr>


                    <tr>
                        <td class="m_1006477609114479258body" width="100%" cellpadding="0" cellspacing="0"
                            style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#ffffff;border-bottom:1px solid #edeff2;border-top:1px solid #edeff2;margin:0;padding:0;width:100%">
                            <table class="m_1006477609114479258inner-body" align="center" width="570" cellpadding="0"
                                   cellspacing="0"
                                   style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#ffffff;margin:0 auto;padding:0;width:570px">

                                <tbody>
                                <tr>
                                    <td class="m_1006477609114479258content-cell"
                                        style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:35px">
                                        <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:19px;font-weight:bold;margin-top:0;text-align:left">
                                            Hello ${_Users.full_name}!</h1>
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                                            we received your request to reset password</p>
                                        <table class="m_1006477609114479258action" align="center" width="100%"
                                               cellpadding="0" cellspacing="0"
                                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:30px auto;padding:0;text-align:center;width:100%">
                                            <tbody>
                                            <tr>
                                                <td align="center"
                                                    style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center"
                                                                style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                                            <a class="m_1006477609114479258button m_1006477609114479258button-primary"
                                                                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-radius:3px;color:#fff;display:inline-block;text-decoration:none;background-color:#3490dc;border-top:10px solid #3490dc;border-right:18px solid #3490dc;border-bottom:10px solid #3490dc;border-left:18px solid #3490dc">Your
                                                                                new password is: ${newPassword}</a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                                            Thank you for using our application!</p>
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                                            Regards,<br>Souqgaz</p>

                                        <table class="m_1006477609114479258subcopy" width="100%" cellpadding="0"
                                               cellspacing="0"
                                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-top:1px solid #edeff2;margin-top:25px;padding-top:25px">
                                            <tbody>
                                            <tr>
                                                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                    <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;line-height:1.5em;margin-top:0;text-align:left;font-size:12px">
                                                        If you’re having trouble clicking the "Your password is: ${newPassword}"
                                                        button</p>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                            <table class="m_1006477609114479258footer" align="center" width="570" cellpadding="0"
                                   cellspacing="0"
                                   style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:0 auto;padding:0;text-align:center;width:570px">
                                <tbody>
                                <tr>
                                    <td class="m_1006477609114479258content-cell" align="center"
                                        style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:35px">
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;line-height:1.5em;margin-top:0;color:#aeaeae;font-size:12px;text-align:center">
                                            © 2019 Souqgaz. All rights reserved.</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
    <div class="yj6qo"></div>
    <div class="adL">
    </div>
</div>
</body>
</html>
           `

            var mailOptions = {
                from: '"Souqgaz" <no-reply@souqgaz.com>',
                to: req.body.email,
                subject: 'Forget Password',
                html: msg
            };
            transporter.sendMail(mailOptions)
            const response = {
                status_code: 200,
                status: true,
                message: 'تم ارسال كلمة المرور الى البريد الالكتروني بنجاح',
                items: update
            }
            return response
        } else {
            const response = {
                status_code: 404,
                status: false,
                message: 'البريد الالكتروني غير مسجل لدينا',
                items: []
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

//reset password
exports.resetPasswordAdmins = async (req, reply) => {
    try {
        // const pervAdminEmail = await Admins.findOne({ phone_number: req.body.phone_number }).lean()
        // const pervUserEmail = await Users.findOne({ phone_number: req.body.phone_number }).lean()
        // if (pervAdminEmail) {
        //     // emeail is exsits 
        //     const response = {
        //         status_code: 400,
        //         status: false,
        //         message: 'رقم الجوال موجود مسبقا',
        //         items: null
        //     }
        //     return response
        // } else if (pervUserEmail) {
        //     // emeail is exsits 
        //     const response = {
        //         status_code: 400,
        //         status: false,
        //         message: 'رقم الجوال موجود مسبقا',
        //         items: null
        //     }
        //     return response
        // } else {
        const pass = encryptPassword(req.body.password)
        const _user = await Admins.findByIdAndUpdate((req.body.id), {
            password: pass
        }, { new: true })
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: _user
        }
        return response
        // }
    } catch (err) {
        throw boom.boomify(err)
    }
}

//reset email
exports.resetEmailAdmins = async (req, reply) => {
    try {
        const pervAdminEmail = await Admins.findOne({ email: req.body.email }).lean()
        const pervUserEmail = await Users.findOne({ email: req.body.email }).lean()
        console.log(pervUserEmail)
        console.log(pervAdminEmail)
        if (pervAdminEmail) {
            // emeail is exsits 
            const response = {
                status_code: 400,
                status: false,
                message: 'الايميل موجود مسبقا',
                items: null
            }
            return response
        } else if (pervUserEmail) {
            // emeail is exsits 
            const response = {
                status_code: 400,
                status: false,
                message: 'الايميل موجود مسبقا',
                items: null
            }
            return response
        } else {
            const _user = await Admins.findByIdAndUpdate((req.body.id), {
                email: req.body.email
            }, { new: true })
            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: _user
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}
