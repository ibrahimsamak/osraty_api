const boom = require('boom')

// Get Data Models
const { Notifications } = require('../models/Notifications')

// Get all notfications
exports.getNotfications = async (req, reply) => {
  try {
    var user_id = req.params.id
    var result = await Notifications.find({ user_id: user_id })
      .sort({ _id: -1 })
      .limit(50)
      const response = {
        items: result,
        status: true,
        status_code: 200,
        message: 'returned successfully',
      }
      reply.send(response)

  } catch (err) {
    throw boom.boomify(err)
  }
}

//read notifications
exports.readNotifications = async (req, reply) => {
  try {
    const _Notification = await Notifications.findByIdAndUpdate((req.params.id), {
      isRead: true
    }, { new: true })

    const response = {
      status_code: 200,
      status: true,
      message: 'تم تعديل حالة التنبيه بنجاح',
      items: _Notification
    }
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.updateNotifications = async (req, reply) => {
  try {
    Notifications.update({ "user_id": req.params.id }, { isRead: true }, { multi: true }, function (err, res) {
      console.log(err, res)
      if (err) {
        const response = {
          status_code: 400,
          status: false,
          message: 'حدث خطأ الرجاء المحاولة مرة اخرى',
          items: []
        }
        reply.send(response)
      } else {
        const response = {
          status_code: 200,
          status: true,
          message: 'تم تعديل حالة التنبيه بنجاح',
          items: []
        }
        reply.send(response)
      }
    });
  } catch (err) {
    throw boom.boomify(err)
  }
}