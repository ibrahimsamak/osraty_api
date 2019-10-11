const moment = require('moment')
const boom = require('boom')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const { settings,getCurrentDateTime } = require('../models/Constant')
const { payments, requests, request_approve } = require('../models/Payment')
const { Users } = require('../models/User')
const { Admins } = require('../models/Admin')
const { Notifications } = require('../models/Notifications')


function CreateNotification(deviceId, msg, order_id, from_userName, to_user_id) {
    return new Promise(function (resolve, reject) {

        let _Notification = new Notifications({
            from: 'الادراة',
            user_id: to_user_id,
            title: 'متابعة طلب استفادة',
            msg: msg,
            dt_date: getCurrentDateTime(),
            type: 1,
            body_parms: '',
            isRead: false
        });

        let rs = _Notification.save();
        console.log(rs);
        let postModel =
        {
            "notification": {
                "title": "متابعة طلب استفادة",
                "body": msg,
                "sound": "default",
                "badge": 1
            },
            "data": {
                "data": order_id,
            },
            "to": deviceId
        };
        var data = JSON.stringify(postModel);
        var xhr = new XMLHttpRequest();
        //xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log('send' + this.responseText);
            }
        });

        xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
        xhr.setRequestHeader("Authorization", 'key=AAAAqt1KWqo:APA91bGORnlJSjsolVNsBTp8WWUE9w8R_yAX77KJNThmwSBum6fDKAwTTzJChayvU1yNzxOK806Z1lGG05m_pUmrQoirSfcpaZV8lv5Gx_-NAW_XZaOeQpcgNUOfTBPzmeyDmtNUbA3k');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        resolve(data);
    });
}

//add payment
exports.addPayment = async (req, reply) => {
    try {
        // status
        // 1: Payment from user
        // 2: verify payment from admin

        let _payments = new payments({
            ammount: req.body.ammount,
            from_user: req.body.from_user,
            methodType: req.body.methodType,
            isActive: true,
            status: 1,
            flag: 1,
            createAt: getCurrentDateTime()
        });

        let rs = await _payments.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addPaymentToUser = async (req, reply) => {
    try {
        // status
        // 1: Payment from user
        // 2: verify payment from admin

        let _payments = new payments({
            ammount: req.body.ammount,
            to_user: req.body.to_user,
            methodFor: req.body.methodFor,
            isActive: true,
            status: 1,
            flag: -1,
            createAt: getCurrentDateTime()
        });

        let rs = await _payments.save();
        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

//get single user
exports.getSinglePayment = async (req, reply) => {
    try {

        const _payments = await payments.findById(req.params.id)
            .populate('from_user')
            .populate('methodType')

        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: _payments
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

// get for super admins
exports.getPaymentAllForAdmin = async (req, reply) => {
    try {
        const rs = await payments.find().sort({ _id: -1 })
            .populate('from_user')
            .populate('to_user')
            .populate('type')

        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

// get for admin
exports.getPaymentAdmin = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        var totalPayment = 0

        await payments.find({ from_user: req.params.id }).sort({ _id: -1 })
            .exec(function (err, result) {
                result.forEach(element => {
                    totalPayment += element.ammount
                });
            })

        const total = await payments.find({ from_user: req.params.id }).count();
        await payments.find({ from_user: req.params.id }).sort({ _id: -1 })
            .populate('from_user')
            .populate('methodType')
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    total_payment: totalPayment,
                    status: true,
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

// de-activate payments
exports.deActivate = async (req, reply) => {
    try {
        const LastPayments = await payments.find({ $and: [{ user_id: req.body.user_id }, { isActive: true }] }).sort({ id: -1 })
            .limit(1)
        var id = ""
        if (LastPayments.length > 0) {
            id = LastPayments[0]._id
        }
        const _payments = await payments.findByIdAndUpdate((id), {
            isActive: false
        }, { new: true })

        const _admin = await Admins.findByIdAndUpdate((id), {
            isActivePayment: false
        }, { new: true })


        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العميلة بنجاح',
            items: _payments
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

// get last 20 payments for user in cp 
exports.getlast20PaymentForUser = async (req, reply) => {
    try {
        var totalPayment = 0
        await payments.find({ $and: [{ to_user: req.body.to_user }, { methodFor: req.body.methodFor }, { isActive: true }] }).sort({ _id: -1 })
            .exec(function (err, result) {
                result.forEach(element => {
                    totalPayment += element.ammount
                });
            })

        await payments.find({ $and: [{ to_user: req.body.to_user }, { methodFor: req.body.methodFor }, { isActive: true }] }).sort({ _id: -1 })
            .populate('from_user')
            .populate('methodType')
            .populate('methodFor')
            .limit(20)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    total_payment: totalPayment,
                    status: true,
                    status_code: 200,
                    message: 'returned successfully'
                }
                reply.send(response)
            });

    } catch (err) {
        throw boom.boomify(err)
    }
}


//add request
exports.addRequest = async (req, reply) => {
    try {
        // stauts 
        // 1: new order 
        // 2: accept 
        // 3: reject admin 
        // 4: stopped by user
        // 5: finish

        let prevRequest = await requests.find({ user_id: req.body.user_id }).sort({ _id: -1 })
        if (prevRequest.length > 0) {
            if (prevRequest[0].status == 1 || prevRequest[0].status == 2) {
                const response = {
                    status_code: 400,
                    status: false,
                    message: 'عذرا .. لا يمكن الطلب الان يوجد لديكم طلب سابقا',
                    items: null
                }
                return response
            } else {
                let _requests = new requests({
                    user_id: req.body.user_id,
                    status: 1,
                    createAt: getCurrentDateTime(),
                    ammount: req.body.ammount,
                    notes: req.body.notes,
                    // startDate: req.body.startDate,
                    // endDate: req.body.endDate,
                    type: req.body.type
                });

                let rs = await _requests.save();
                const response = {
                    status_code: 200,
                    status: true,
                    message: 'تمت العملية بنجاح',
                    items: rs
                }
                return response
            }
        } else {
            let _requests = new requests({
                user_id: req.body.user_id,
                status: 1,
                createAt: getCurrentDateTime(),
                ammount: req.body.ammount,
                notes: req.body.notes,
                // startDate: req.body.startDate,
                // endDate: req.body.endDate,
                type: req.body.type
            });

            let rs = await _requests.save();
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

// update status in request
exports.updateRequest = async (req, reply) => {
    try {
        // stauts 
        // 1: new order 
        // 2: accept 
        // 3: reject admin 
        // 4: stopped by user
        // 5: finish

        let prevRequest = await requests.findById(req.body.id)
        if (prevRequest.status != 2) {
            const _requests = await requests.findByIdAndUpdate((req.body.id), {
                ammount: req.body.ammount,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                notes: ''
            }, { new: true })

            const response = {
                status_code: 200,
                status: true,
                message: 'تمت العميلة بنجاح',
                items: _requests
            }
            return response
        } else {
            const response = {
                status_code: 400,
                status: false,
                message: 'عذرا .. لا يمكن ايقاف الخدمة لانها قيد الدراسة',
                items: _requests
            }
            return response
        }

    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateRequestByAdmin = async (req, reply) => {
    try {
        // stauts 
        // 1: new order 
        // 2: accept 
        // 3: reject admin 
        // 4: stopped by user
        // 5: finish

        var approve = false

        const _settings = await settings.findOne({ key: 'persons' })
        const approveCount = await request_approve.find({ $and: [{ request_id: req.body.id }] }).count()
        const persons = _settings.value

        if (approveCount <= persons) {
            const prevApprove = await request_approve.findOne({ $and: [{ superAdmin_id: req.body.superAdmin_id }, { request_id: req.body.id }] })
            if (prevApprove) {
                const response = {
                    status_code: 200,
                    status: true,
                    message: 'تم الاعتماد مسبقا',
                    items: null
                }
                return response
            } else {

                if (req.body.status == 2) {
                    approve = true
                    let _request_approve = new request_approve({
                        superAdmin_id: req.body.superAdmin_id,
                        request_id: req.body.id,
                        approve: approve
                    });
                    await _request_approve.save();
                } else if (req.body.status == 3) {
                    approve = false
                    let _request_approve = new request_approve({
                        superAdmin_id: req.body.superAdmin_id,
                        request_id: req.body.id,
                        approve: approve
                    });
                    await _request_approve.save();
                }

                const approveCount = await request_approve.find({ $and: [{ request_id: req.body.id }, { approve: true }] }).count()
                const notapproveCount = await request_approve.find({ $and: [{ request_id: req.body.id }, { approve: false }] }).count()

                const _requests = await requests.findByIdAndUpdate((req.body.id), {
                    ammount: req.body.ammount,
                    status: req.body.status,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    notes: ''
                }, { new: true })

                if (approveCount == persons) {
                    //اخر واحد ببعت تنبيه
                    if (approveCount > notapproveCount) {
                        // تنبيه قبول
                        const userData = await Users.findById(_requests.user_id)
                        CreateNotification(userData.fcmToken, 'تم قبول طلبكم وسيتم موعد تحديد ايداع الدفعات في وقت لاحق', '', '', _requests.user_id)
                    } else {
                        // تنبيه رفض
                        const userData = await Users.findById(_requests.user_id)
                        CreateNotification(userData.fcmToken, 'عذرا .. لقد تم رفض طلبكم', '', '', _requests.user_id)
                    }
                }

                const response = {
                    status_code: 200,
                    status: true,
                    message: 'تمت العميلة بنجاح',
                    items: _requests
                }
                return response
            }
        } else {
            const response = {
                status_code: 400,
                status: false,
                message: 'تجاوزت الحد المسموح به للاعتماد',
                items: null
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}


// get request for super admins
exports.getRequestAllForAdmin = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        const total = await requests.find().count();
        const rs = await requests.find().sort({ _id: -1 })
            .populate('user_id')
            .populate('type')
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

// Get search
exports.getRequsetSearch = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        var options = { page: page + 1, limit: limit }

        const aggregate = requests.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_id'
                }
            },
            {
                "$unwind": {
                    "path": "$user_id",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                $match:
                {
                    '$or': [{ 'user_id.phone_number': { "$regex": req.body.phone_number, "$options": "i" } }, { 'user_id.full_name': { "$regex": req.body.full_name, "$options": "i" } }, { 'user_id.Id_no': { "$regex": req.body.Id_no, "$options": "i" } }]
                }
            },
            {
                $lookup: {
                    from: 'paymentfors',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'type'
                }
            },
            {
                "$unwind": {
                    "path": "$type",
                    "preserveNullAndEmptyArrays": false
                }
            },
        ])

        requests.aggregatePaginate(aggregate, options)
            .then(function (value) {
                console.log(value.data, value.pageCount, value.totalCount)
                const response = {
                    items: value.data,
                    status_code: 200,
                    message: 'returned successfully',
                    pagenation: {
                        size: value.data.length,
                        totalElements: value.totalCount,
                        totalPages: value.pageCount,
                        pageNumber: page
                    }
                }
                reply.send(response)
            })
            .catch(function (err) {
                console.log(err)
            })
    } catch (err) {
        throw boom.boomify(err)
    }
}

// get for user
exports.getRequestUser = async (req, reply) => {
    try {

        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)
        var totalPayment = 0

        await payments.find({ to_user: req.params.id }).sort({ _id: -1 })
            .exec(function (err, result) {
                result.forEach(element => {
                    totalPayment += element.ammount
                });
            })

        const total = await requests.find({ user_id: req.params.id }).count();
        await requests.find({ user_id: req.params.id }).sort({ _id: -1 })
            .populate('user_id')
            .populate('type')
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    status_code: 200,
                    message: 'returned successfully',
                    total_payment: totalPayment,
                    pagenation: {
                        size: result.length,
                        totalElements: total,
                        totalPages: Math.floor(total / limit),
                        pageNumber: page
                    }
                }
                reply.send(response)
            })

    } catch (err) {
        throw boom.boomify(err)
    }
}

//get single request
exports.getSingleRequest = async (req, reply) => {
    try {
        const _requests = await requests.findById(req.params.id)
            .populate('user_id')
            .populate('type')
        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: _requests
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

//get single request
exports.getLastRequest = async (req, reply) => {
    try {
        var totalPayment = 0
        await requests.findById(req.params.id).exec(async function (err, _result) {
            console.log(_result)
            await payments.find({ $and: [{ to_user: _result.user_id }, { methodFor: _result.type }, { isActive: true }] }).sort({ _id: -1 })
                .exec(function (err, result) {
                    console.log(result)
                    result.forEach(element => {
                        totalPayment += element.ammount
                    });
                    const response = {
                        status_code: 200,
                        status: true,
                        totalPayment: totalPayment,
                        message: 'تمت العملية بنجاح',
                        items: _result
                    }
                    reply.send(response)
                })
        })
    } catch (err) {
        throw boom.boomify(err)
    }
}

//get active request for user
exports.getActiveRequestUser = async (req, reply) => {
    try {
        await requests.find({ $and: [{ user_id: req.params.id }, { status: 2 }] }).sort({ _id: -1 })
            .populate('user_id')
            .populate('type')
            .exec(function (err, result) {
                const response = {
                    items: result,
                    status_code: 200,
                    message: 'returned successfully'
                }
                reply.send(response)
            })

    } catch (err) {
        throw boom.boomify(err)
    }
}