const moment = require("moment");
const boom = require("boom");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const _ = require("underscore");
const lodash = require("lodash");
const cron = require("node-cron");
const fs = require("fs");
const cloudinary = require('cloudinary');

const {
  payments,
  requests,
  request_approve,
  bankDetails
} = require("../models/Payment");
const { Users } = require("../models/User");
const { Admins } = require("../models/Admin");
const { Notifications } = require("../models/Notifications");
const { SuperAdmin } = require("../models/superAdmin");
const {
  bankfiles,
  getCurrentDateTime,
  jobs,
  categories,
  paymentMethods,
  paymentFors,
  loans,
  StaticPage,
  ContactOption,
  settings
} = require("../models/Constant");
const { payment_type } = require("../utils/constant");
cloudinary.config({
  cloud_name: 'dztwo3qso',
  api_key: '761391876145368',
  api_secret: 'Sqfov5ua8c3514TJtzj27gpU9CY'
});


function CreateNotification(
  deviceId,
  msg,
  order_id,
  from_userName,
  to_user_id
) {
  return new Promise(async function(resolve, reject) {
    let _Notification = new Notifications({
      from: "الادراة",
      user_id: to_user_id,
      title: "متابعة طلب استفادة",
      msg: msg,
      dt_date: getCurrentDateTime(),
      type: 1,
      body_parms: "",
      isRead: false
    });

    let rs = await _Notification.save();
    // let postModel = {
    //   notification: {
    //     title: "متابعة طلب استفادة",
    //     body: msg,
    //     sound: "default",
    //     badge: 1
    //   },
    //   data: {
    //     title: "متابعة طلب استفادة",
    //     body: msg,
    //     sound: "default",
    //     data: order_id
    //   },
    //   to: deviceId
    // };
    // var data = JSON.stringify(postModel);
    // var xhr = new XMLHttpRequest();
    // //xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function() {
    //   if (this.readyState === 4) {
    //     console.log("send" + this.responseText);
    //   }
    // });

    // xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
    // xhr.setRequestHeader(
    //   "Authorization",
    //   "key=AAAAqt1KWqo:APA91bGORnlJSjsolVNsBTp8WWUE9w8R_yAX77KJNThmwSBum6fDKAwTTzJChayvU1yNzxOK806Z1lGG05m_pUmrQoirSfcpaZV8lv5Gx_-NAW_XZaOeQpcgNUOfTBPzmeyDmtNUbA3k"
    // );
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.send(data);
    resolve({});
  });
}

// function CreateNotificationMultiple(
//   deviceId,
//   title,
//   msg,
//   order_id,
//   from_userName,
//   to_user_id
// ) {
//   return new Promise(function(resolve, reject) {
//     let postModel = {
//       notification: {
//         title: title,
//         body: msg,
//         sound: "default",
//         icon: "assets/images/logo.png",
//         badge: 1
//       },
//       data: {
//         title: title,
//         body: msg,
//         sound: "default",
//         data: ""
//       },
//       registration_ids: deviceId
//     };
//     var data = JSON.stringify(postModel);
//     var xhr = new XMLHttpRequest();
//     //xhr.withCredentials = true;

//     xhr.addEventListener("readystatechange", function() {
//       if (this.readyState === 4) {
//         console.log("send" + this.responseText);
//       }
//     });

//     xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
//     xhr.setRequestHeader(
//       "Authorization",
//       "key=AAAAqt1KWqo:APA91bGORnlJSjsolVNsBTp8WWUE9w8R_yAX77KJNThmwSBum6fDKAwTTzJChayvU1yNzxOK806Z1lGG05m_pUmrQoirSfcpaZV8lv5Gx_-NAW_XZaOeQpcgNUOfTBPzmeyDmtNUbA3k"
//     );
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.send(data);
//     resolve(data);
//   });
// }

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


exports.reminderMonthlyJob = async (req,reply) => {
  //0 0 0 1 * *
  cron.schedule("0 0 0 1 * *", async () => {
    const arr = [];
    var docs = []
    var Notification = []
    const devicesID = await Admins.find({
      $and: [{ paymentMethod_type: payment_type.month }, { isActivePayment: true }]
    });
    devicesID.forEach(element => {
      arr.push(element["fcmToken"]);
    });

    devicesID.forEach(element => {
      let _payments = new payments({
        ammount: element.ammount,
        from_user: element._id,
        methodType: element.paymentMethod_id,
        isActive: true,
        status: 0,
        flag: 1,
        createAt: getCurrentDateTime()
      });

      let _Notification = new Notifications({
        from: "الادراة",
        user_id: element._id,
        title: "تذكير بالتبرع",
        msg: "تنبيه بتأكيد ايداع دفعة التبرع وشكرا لتعاونكم معنا",
        dt_date: getCurrentDateTime(),
        type: 1,
        body_parms: "",
        isRead: false
      });
    
    
      Notification.push(_Notification)
      docs.push(_payments)
    });
    await payments.insertMany(docs, (err, _docs) => {});
    await Notifications.insertMany(Notification, (err, _docs) => {});

    // CreateNotificationMultiple(
    //   arr,
    //   "تذكير بالتبرع",
    //   "تنبيه بتأكيد ايداع دفعة التبرع وشكرا لتعاونكم معنا"
    // );
  });
}

exports.reminderYearlyJob = async (req,reply) => {
  cron.schedule("0 0 1 1 *", async () => {
    const arr = [];
    var docs = []
    var Notification = []

    const devicesID = await Admins.find({
      $and: [{ paymentMethod_type: payment_type.yearly }, { isActivePayment: true }]
    });
    devicesID.forEach(element => {
      arr.push(element["fcmToken"]);
    });
    devicesID.forEach(element => {
      let _payments = new payments({
        ammount: element.ammount,
        from_user: element._id,
        methodType: element.paymentMethod_id,
        isActive: true,
        status: 0,
        flag: 1,
        createAt: getCurrentDateTime()
      });

      let _Notification = new Notifications({
        from: "الادراة",
        user_id: element._id,
        title: "تذكير بالتبرع",
        msg: "تنبيه بتأكيد ايداع دفعة التبرع وشكرا لتعاونكم معنا",
        dt_date: getCurrentDateTime(),
        type: 1,
        body_parms: "",
        isRead: false
      });
    
    
      Notification.push(_Notification)
      docs.push(_payments)
    });
    await payments.insertMany(docs, (err, _docs) => {});
    await Notifications.insertMany(Notification, (err, _docs) => {});

    // CreateNotificationMultiple(
    //   arr,
    //   "تذكير بالزكاة",
    //   "تنبيه بايداع الزكاة وشكرا لتعاونكم معنا"
    // );
  }); 
}

// Get Bank Details
exports.getBankDetails = async (req, reply) => {
  try {
    const _bankDetails = await bankDetails.findOne({ user_id: req.params.id });

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: _bankDetails
    };
    reply.send(response)
    return
  } catch (err) {
    throw boom.boomify(err);
  }
};

// add bank details
exports.addBankDetails = async (req, reply) => {
  try {
    // status
    // 1: Payment from user
    // 2: verify payment from admin
    const _PrevBankDetails = await bankDetails.findOne({
      user_id: req.body.user_id
    });
    if (_PrevBankDetails) {
      if (req.body.type == "admin"){
      const _bankDetails = await bankDetails.findByIdAndUpdate(
        _PrevBankDetails._id,
        req.body,
        { new: true }
      );

      const userData = await Admins.findByIdAndUpdate(
        req.body.user_id,
        {
          isActivePayment: true
        },
        { new: true }
      );
      CreateNotification(
        userData.fcmToken,
        "أهلا بكم في تطبيق صندوق الغشيان",
        "",
        "",
        userData._id
      );

      const response = {
        status_code: 200,
        status: true,
        message: "تمت العملية بنجاح",
        items: _bankDetails
      };
      reply.send(response)
    }else{
      const _bankDetails = await bankDetails.findByIdAndUpdate(
        _PrevBankDetails._id,
        req.body,
        { new: true }
      );

      const userData = await Users.findByIdAndUpdate(
        req.body.user_id,
        {
          isActivePayment: true,
          Id_no: req.body.id_no

        },
        { new: true }
      );
      CreateNotification(
        userData.fcmToken,
        "أهلا بكم في تطبيق صندوق الغشيان",
        "",
        "",
        userData._id
      );

      const response = {
        status_code: 200,
        status: true,
        message: "تمت العملية بنجاح",
        items: _bankDetails
      };
      reply.send(response)
    }
         
  } else {
      let _bankDetails = new bankDetails(req.body);
      let rs = await _bankDetails.save();

      if (req.body.type == "admin") {
        const userData = await Admins.findByIdAndUpdate(
          req.body.user_id,
          {
            isActivePayment: true
          },
          { new: true }
        );

        CreateNotification(
          userData.fcmToken,
          "أهلا بكم في تطبيق صندوق الغشيان",
          "",
          "",
          userData._id
        );
      } else {
        const userData = await Users.findByIdAndUpdate(
          req.body.user_id,
          {
            isActivePayment: true,
            Id_no: req.body.id_no
          },
          { new: true }
        );

        CreateNotification(
          userData.fcmToken,
          "أهلا بكم في تطبيق صندوق الغشيان",
          "",
          "",
          userData._id
        );
      }

      const response = {
        status_code: 200,
        status: true,
        message: "تمت العملية بنجاح",
        items: rs
      };
      reply.send(response)

    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

//add payment
exports.addPayment = async (req, reply) => {
  try {
    // status
    // 1: Payment from user
    // 2: verify payment from admin
    if(String(req.body.isComplete) == "1"){
      let _payments = new payments({
        ammount: req.body.ammount,
        from_user: req.body.from_user,
        methodType: req.body.methodType,
        isActive: true,
        status: 0,
        flag: 1,
        createAt: getCurrentDateTime()
      });
  
      let rs = await _payments.save();
    }else{
     await Admins.findByIdAndUpdate((req.body.from_user), {
        createAt: getCurrentDateTime(),
        paymentMethod_type: req.body.paymentMethod_type,
        ammount: req.body.ammount,
        paymentMethod_id: req.body.paymentMethod_id,
    }, { new: true })

    }

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: {}
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};


exports.approvePaymentByUser = async (req, reply) => {
  try {
    let rs = await payments.findByIdAndUpdate(req.body.id,{status:1},{new:true})
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: rs
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.verfiyPayment = async (req, reply) => {
  try {
    // status
    // 1: Payment from user
    // 2: verify payment from admin

    // let _payments = new payments({
    //   ammount: req.body.ammount,
    //   from_user: req.body.from_user,
    //   methodType: req.body.methodType,
    //   isActive: true,
    //   status: 2,
    //   flag: 1,
    //   createAt: getCurrentDateTime()
    // });

    // let rs = await _payments.save();

    let rs = await payments.findByIdAndUpdate(req.body.id,{status:2},{new:true})
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: rs
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

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
      status: 2,
      flag: -1,
      createAt: getCurrentDateTime()
    });

    let rs = await _payments.save();

    const userData = await Users.findById(req.body.to_user);
    CreateNotification(
      userData.fcmToken,
      "تم ايداع دفعة نقدية في حسابكم",
      "",
      "",
      userData._id
    );

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: rs
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

//get single user
exports.getSinglePayment = async (req, reply) => {
  try {
    const _payments = await payments
      .findById(req.params.id)
      .populate("from_user")
      .populate("methodType");

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: _payments
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

// get for super admins
exports.getPaymentAllForAdmin = async (req, reply) => {
  try {
    const rs = await payments
      .find()
      .sort({ _id: -1 })
      .populate("from_user")
      .populate("to_user")
      .populate("type");

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: rs
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

// get for admin
exports.getPaymentAdmin = async (req, reply) => {
  try {
    // var page = parseInt(req.query.page, 10);
    // var limit = parseInt(req.query.limit, 10);
    var totalPayment = 0;

    var _result = await payments
    .find({ $and:[{from_user: req.params.id},{status:2}]})
    .sort({ _id: -1 })
      _result.forEach(element => {
          totalPayment += element.ammount;
        });

    // const total = await payments.find({ from_user: req.params.id }).count();
    const result = await payments
      .find({ $and:[{from_user: req.params.id}]})
      .sort({ _id: -1 })
      .populate("from_user")
      .populate("methodType")
      // .skip(page * limit)
      .limit(50)
      const response = {
        items: result,
        total_payment: totalPayment,
        status: true,
        status_code: 200,
        message: "returned successfully",
        // pagenation: {
        //   size: result.length,
        //   totalElements: total,
        //   totalPages: Math.floor(total / limit),
        //   pageNumber: page
        // }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// de-activate payments
exports.deActivate = async (req, reply) => {
  try {
    // const LastPayments = await payments
    //   .find({ $and: [{ from_user: req.body.user_id }, { isActive: true }] })
    //   .sort({ id: -1 })
    //   .limit(1);
    // if (LastPayments.length > 0) {
    //   let id = LastPayments[0]._id;
    //    await payments.findByIdAndRemove(id);
    // }


    let newAdmin = await Admins.findByIdAndUpdate(req.body.user_id,
      {
        isActivePayment: req.body.isActivePayment
      },
      { new: true }
     );

    const response = {
      status_code: 200,
      status: true,
      message: "تم تعديل حالة التبرع بنجاح",
      items: newAdmin
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

// get last 20 payments for user in cp
exports.getlast20PaymentForUser = async (req, reply) => {
  try {
    var totalPayment = 0;
    var result = await payments
      .find({
        $and: [
          { to_user: req.body.to_user },
          { methodFor: req.body.methodFor },
          { isActive: true }
        ]
      })
      .sort({ _id: -1 })
     
      result.forEach(element => {
        totalPayment += element.ammount;
      });

    var result2 = await payments
      .find({
        $and: [
          { to_user: req.body.to_user },
          { methodFor: req.body.methodFor },
          { isActive: true }
        ]
      })
      .sort({ _id: -1 })
      .populate("from_user")
      .populate("methodType")
      .populate("methodFor")
      .limit(20)
      const response = {
        items: result2,
        total_payment: totalPayment,
        status: true,
        status_code: 200,
        message: "returned successfully"
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

//add request
exports.addRequest = async (req, reply) => {
  try {
    // stauts
    // 1: new order
    // 2: accept
    // 3: reject admin
    // 4: stopped by user
    // 5: finish
    var other_file3 = '';
    var other_file2 = '';

    if (req.raw.files) {
      const files = req.raw.files
      let fileArr = []
      for (let key in files) {
          fileArr.push({
              name: files[key].name,
              mimetype: files[key].mimetype
          })
      }
      var data = new Buffer(files.other_file1.data);
      fs.writeFile('./uploads/' + files.other_file1.name, data, 'binary', function (err) {
          if (err) {
              console.log("There was an error writing the image")
          }
          else {
              console.log("The sheel file was written")
          }
      });

      let other_file1 = '';
      await uploadImages(files.other_file1.name).then((x) => {
        other_file1 = x;
      });

      if(files.other_file2){
        var data = new Buffer(files.other_file2.data);
        fs.writeFile('./uploads/' + files.other_file2.name, data, 'binary', function (err) {
            if (err) {
                console.log("There was an error writing the image")
            }
            else {
                console.log("The sheel file was written")
            }
        });
  
        await uploadImages(files.other_file2.name).then((x) => {
          other_file2 = x;
        });
      }

      if(files.other_file3){
        var data = new Buffer(files.other_file3.data);
        fs.writeFile('./uploads/' + files.other_file3.name, data, 'binary', function (err) {
            if (err) {
                console.log("There was an error writing the image")
            }
            else {
                console.log("The sheel file was written")
            }
        });
  
        let other_file3 = '';
        await uploadImages(files.other_file3.name).then((x) => {
          other_file3 = x;
        });
      }

      let _requests = new requests({
        other_file1: other_file1,
        other_file2: other_file2,
        other_file3: other_file3,
        user_id:  req.raw.body.user_id,
        status: 1,
        createAt: getCurrentDateTime(),
        ammount:  req.raw.body.ammount,
        notes:    req.raw.body.notes,
        type:     req.raw.body.type,
        // other: req.body.other
      });
  
      let rs = await _requests.save();


      const response = {
        status_code: 200,
        status: true,
        message: "تمت العملية بنجاح",
        items: rs
      };
      reply.send(response)
      return
  }
  


  } catch (err) {
    throw boom.boomify(err);
  }
};

// update status in request
exports.updateRequest = async (req, reply) => {
  try {
    // stauts
    // 1: new order
    // 2: accept
    // 3: reject admin
    // 4: stopped by user
    // 5: finish

    let prevRequest = await requests.findById(req.body.id);
    if (prevRequest.status != 2) {
      const _requests = await requests.findByIdAndUpdate(
        req.body.id,
        {
          // ammount: req.body.ammount,
          status: req.body.status,
          // startDate: req.body.startDate,
          // endDate: req.body.endDate,
          notes: "طلب ملفي من المستفيد"
        },
        { new: true }
      );

      const response = {
        status_code: 200,
        status: true,
        message: "تمت العميلة بنجاح",
        items: _requests
      };
      reply.send(response)

    } else {
      const response = {
        status_code: 400,
        status: false,
        message: "عذرا .. لا يمكن ايقاف الخدمة لانها قيد الدراسة",
        items: _requests
      };
      reply.send(response)

    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.updateRequestByAdmin = async (req, reply) => {
  try {
    // stauts
    // 1: new order
    // 2: accept
    // 3: reject admin
    // 4: stopped by user
    // 5: finish

    var approve = false;

    const _settings = await settings.findOne({ key: "persons" });
    const approveCount = await request_approve.find({ $and: [{ request_id: req.body.id }] }).count();
    const persons = _settings.value;
    if (approveCount <= persons) {
      const prevApprove = await request_approve.findOne({
        $and: [
          { superAdmin_id: req.body.superAdmin_id },
          { request_id: req.body.id }
        ]
      });
      if (prevApprove) {
        const response = {
          status_code: 200,
          status: false,
          message: "تم الاعتماد مسبقا",
          items: null
        };
        reply.send(response)
      } else {
        if (req.body.status == 2) {
          approve = true;
          let _request_approve = new request_approve({
            superAdmin_id: req.body.superAdmin_id,
            request_id: req.body.id,
            approve: approve
          });
          await _request_approve.save();
        } else if (req.body.status == 3) {
          approve = false;
          let _request_approve = new request_approve({
            superAdmin_id: req.body.superAdmin_id,
            request_id: req.body.id,
            approve: approve
          });
          await _request_approve.save();
        }

        const approveCount = await request_approve
          .find({ $and: [{ request_id: req.body.id }, { approve: true }] })
          .count();
        const notapproveCount = await request_approve
          .find({ $and: [{ request_id: req.body.id }, { approve: false }] })
          .count();

        if (approveCount == persons) {
          //اخر واحد ببعت تنبيه
          if (approveCount > notapproveCount) {
            // تنبيه قبول
            const _requests = await requests.findByIdAndUpdate(
              req.body.id,
              {
                ammount: req.body.ammount,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                notes: req.body.notes
              },
              { new: true }
            );
          
            const userData = await Users.findById(_requests.user_id);
            CreateNotification(
              userData.fcmToken,
              "تم قبول طلبكم وسيتم موعد تحديد ايداع الدفعات في وقت لاحق",
              "",
              "",
              _requests.user_id
            );
          } else {
            // تنبيه رفض
            const userData = await Users.findById(_requests.user_id);
            CreateNotification(
              userData.fcmToken,
              "عذرا .. لقد تم رفض طلبكم",
              "",
              "",
              _requests.user_id
            );
          }
        }

        const response = {
          status_code: 200,
          status: true,
          message: "تمت العميلة بنجاح",
          items: {}
        };
        reply.send(response)

      }
    } else {
      const response = {
        status_code: 400,
        status: false,
        message: "تجاوزت الحد المسموح به للاعتماد",
        items: null
      };
      reply.send(response)

    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

// get request for super admins
exports.getRequestAllForAdmin = async (req, reply) => {
  try {
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    const total = await requests.find().count();
    const result = await requests
      .find()
      .sort({ _id: -1 })
      .populate("user_id")
      .populate("type")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      const response = {
        items: result,
        status_code: 200,
        message: "returned successfully",
        pagenation: {
          size: result.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get search
exports.getRequsetSearch = async (req, reply) => {
  try {
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    var options = { page: page + 1, limit: limit };

    const aggregate = requests.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      {
        $unwind: {
          path: "$user_id",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $match: {
          $or: [
            {
              "user_id.phone_number": {
                $regex: req.body.phone_number,
                $options: "i"
              }
            },
            {
              "user_id.full_name": { $regex: req.body.full_name, $options: "i" }
            },
            { "user_id.Id_no": { $regex: req.body.Id_no, $options: "i" } }
          ]
        }
      },
      {
        $lookup: {
          from: "paymentfors",
          localField: "type",
          foreignField: "_id",
          as: "type"
        }
      },
      {
        $unwind: {
          path: "$type",
          preserveNullAndEmptyArrays: false
        }
      }
    ]);

    requests
      .aggregatePaginate(aggregate, options)
      .then(function(value) {
        const response = {
          items: value.data,
          status_code: 200,
          message: "returned successfully",
          pagenation: {
            size: value.data.length,
            totalElements: value.totalCount,
            totalPages: value.pageCount,
            pageNumber: page
          }
        };
        reply.send(response);
      })
      .catch(function(err) {
        console.log(err);
      });
  } catch (err) {
    throw boom.boomify(err);
  }
};

// get for user
exports.getRequestUser = async (req, reply) => {
  try {
    // var page = parseInt(req.query.page, 10);
    // var limit = parseInt(req.query.limit, 10);
    var totalPayment = 0;

    var result = await payments
      .find({ $and: [{ to_user: req.params.id }, { status: 2 }] })
      .sort({ _id: -1 })
      result.forEach(element => {
        totalPayment += element.ammount;
      });

    // const total = await requests.find({ user_id: req.params.id }).count();
    var result = await requests
      .find({ user_id: req.params.id })
      .sort({ _id: -1 })
      .populate("user_id")
      .populate("type")
      // .skip(page * limit)
      .limit(50)
      const response = {
        items: result,
        status_code: 200,
        message: "returned successfully",
        total_payment: totalPayment,
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

//get single request
exports.getSingleRequest = async (req, reply) => {
  try {
    const _requests = await requests
      .findById(req.params.id)
      .populate("user_id")
      .populate("type");
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: _requests
    };
    reply.send(response)

  } catch (err) {
    throw boom.boomify(err);
  }
};

//get single request
exports.getLastRequest = async (req, reply) => {
  try {
    var totalPayment = 0;
    var req1 = await requests.findById(req.params.id)
    var result = await payments
    .find({
      $and: [
        { to_user: req1.user_id },
        { methodFor: req1.type },
        { isActive: true },
        { status: 2 }
      ]
    })
    .sort({ _id: -1 })
    result.forEach(element => {
      totalPayment += element.ammount;
    });
    const response = {
      status_code: 200,
      status: true,
      totalPayment: totalPayment,
      message: "تمت العملية بنجاح",
      items: _result
    };
    reply.send(response);

  } catch (err) {
    throw boom.boomify(err);
  }
};

//get active request for user
exports.getActiveRequestUser = async (req, reply) => {
  try {
    var result = await requests
      .find({ $and: [{ user_id: req.params.id }, { status: 2 }] })
      .sort({ _id: -1 })
      .populate("user_id")
      .populate("type")
      
      const response = {
        items: result,
        status_code: 200,
        message: "returned successfully"
      };
      reply.send(response);;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// reports for history
exports.rpt_history = async (req, reply) => {
  try {
    var query = {};
    var sum = 0;
    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;

    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.type == "user") {
      query["to_user"] = req.body.user_id;
      query["flag"] = -1;
      if (req.body.methodFor) {
        query["methodFor"] = req.body.methodFor;
      }
    } else {
      query["from_user"] = req.body.user_id;
      query["flag"] = 1;
      if (req.body.methodType) {
        query["methodType"] = req.body.methodType;
      }
    }

    query["status"] = 2;
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    const total = await payments.find(query).count();

    var item = await payments
      .find(query)
      .sort({ _id: -1 })
      .populate("methodFor")
      .populate("methodType")
      .skip(page * limit)
      .limit(limit)
      
      item.forEach(element => {
        sum += element.ammount;
      });
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: item,
        total: sum,
        pagenation: {
          size: item.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// reports for funder
exports.rpt_funder = async (req, reply) => {
  try {
    var query = {};
    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;

    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.methodType && req.body.methodType != "") {
      query["methodType"] = req.body.methodType;
    }
    if (req.body.status && req.body.status != "") {
      if (String(req.body.status) == "0") {
        query["status"] = 0;
      } 
      if (String(req.body.status) == "2") {
        query["status"] = 2;
      } 
      if (String(req.body.status) == "1") {
        query["status"] = 1;
      }
    }
    query["flag"] = 1;
  
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    var sum = 0;
    const total = await payments.find(query).count();

   var item =  await payments
      .find(query)
      .sort({ _id: -1 })
      .populate("from_user")
      .populate("methodType")
      .skip(page * limit)
      .limit(limit)
      item.forEach(element => {
        sum += element.ammount;
      });
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: item,
        total: sum,
        pagenation: {
          size: item.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
      
  } catch (err) {
    throw boom.boomify(err);
  }
};

// reports for funder excel
exports.rpt_funder_excel = async (req, reply) => {
  try {
    var query = {};
    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;

    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.methodType && req.body.methodType != "") {
      query["methodType"] = req.body.methodType;
    }
    if (req.body.status && req.body.status != "") {
      if (String(req.body.status) == "0") {
        query["status"] = 0;
      } 
      if (String(req.body.status) == "2") {
        query["status"] = 2;
      } 
      if (String(req.body.status) == "1") {
        query["status"] = 1;
      }
    }
    query["flag"] = 1;
  
   var sum = 0;

   var item =  await payments
      .find(query)
      .sort({ _id: -1 })
      .populate("from_user")
      .populate("methodType")
      item.forEach(element => {
        sum += element.ammount;
      });
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: item,
        total: sum,
      };
      reply.send(response);
      
  } catch (err) {
    throw boom.boomify(err);
  }
};

// reports for beneficiary
exports.rpt_beneficiary = async (req, reply) => {
  try {
    var query = {};
    var sum = 0;

    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;

    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.methodFor) {
      query["methodFor"] = req.body.methodFor;
    }
    query["flag"] = -1;
    query["status"] = 2;
    // query['to_user'] = { $exists: true }
    // query['methodFor'] = { $exists: true }

    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);

    const total = await payments.find(query).count();
    var item = await payments
      .find(query)
      .sort({ _id: -1 })
      .populate("to_user")
      .populate("methodFor")
      .skip(page * limit)
      .limit(limit)

      item.forEach(element => {
        sum += element.ammount;
      });
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: item,
        total: sum,
        pagenation: {
          size: item.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// reports for beneficiary excel
exports.rpt_beneficiary_excel = async (req, reply) => {
  try {
    var query = {};
    var sum = 0;

    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;

    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.methodFor) {
      query["methodFor"] = req.body.methodFor;
    }
    query["flag"] = -1;
    query["status"] = 2;
    // query['to_user'] = { $exists: true }
    // query['methodFor'] = { $exists: true }

   var item = await payments
      .find(query)
      .sort({ _id: -1 })
      .populate("to_user")
      .populate("methodFor")
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: item,
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// report request
exports.rpt_request = async (req, reply) => {
  try {
    var query = {};
    var start_date = req.body.dt_start;
    var end_date = req.body.dt_end;
    
    if (end_date != "" && end_date != undefined && end_date) {
      end_date = new Date(end_date);
      end_date = end_date.setHours(23, 59, 59, 999);
      end_date = new Date(end_date);
      query = { createAt: { $lt: end_date } };
    }
    if (start_date != "" && start_date != undefined && start_date) {
      start_date = new Date(start_date);
      start_date = start_date.setHours(0, 0, 0, 0);
      start_date = new Date(start_date);
      query = {
        createAt: { $gte: start_date },
      };
    }
    if (
      start_date != "" &&
      start_date != undefined &&
      start_date &&
      end_date != "" &&
      end_date != undefined &&
      end_date
    ) {
      query = {
        createAt: { $gte: start_date, $lt: end_date },
      };
    }

    if (req.body.status) {
      query["status"] = req.body.status;
    }
    if (req.body.user_id) {
      query["user_id"] = req.body.user_id;
    }
    if (req.body.type) {
      query["type"] = req.body.type;
    }
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    const total = await requests.find(query).count();
    var result = await requests
      .find(query)
      .sort({ _id: -1 })
      .populate("user_id")
      .populate("type")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      const response = {
        items: result,
        status_code: 200,
        message: "returned successfully",
        pagenation: {
          size: result.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// satistics
exports.getMethodFor = async (req, reply) => {
  try {
    var company_arr = [];
    var orderedResult = [];

    //نوكيا
    var _doneOrders = await userOrders.find({
      $and: [
        { network_id: "5d639bb5a777633ff6c75eba" },
        { company_id: "5d639ba3a777633ff6c75eb7" }
      ]
    });
    var notAttachedImage = lodash.sumBy(_doneOrders, function(o) {
      return o.notAttachedImage;
    });
    var imageNotComplete = lodash.sumBy(_doneOrders, function(o) {
      return o.imageNotComplete;
    });
    var problems = lodash.sumBy(_doneOrders, function(o) {
      return o.problems;
    });
    var total1 = notAttachedImage + imageNotComplete + problems;

    var _doneOrders2 = await userOrders.find({
      $and: [
        { network_id: "5d639bb0a777633ff6c75eb9" },
        { company_id: "5d639ba3a777633ff6c75eb7" }
      ]
    });
    var notAttachedImage2 = lodash.sumBy(_doneOrders2, function(o) {
      return o.notAttachedImage;
    });
    var imageNotComplete2 = lodash.sumBy(_doneOrders2, function(o) {
      return o.imageNotComplete;
    });
    var problems2 = lodash.sumBy(_doneOrders2, function(o) {
      return o.problems;
    });
    var total2 = notAttachedImage2 + imageNotComplete2 + problems2;

    //قنوات الشبكة
    var _doneOrders3 = await userOrders.find({
      $and: [
        { network_id: "5d639bb5a777633ff6c75eba" },
        { company_id: "5d64eae1cd3c9c0024e6fb7f" }
      ]
    });
    var notAttachedImage3 = lodash.sumBy(_doneOrders3, function(o) {
      return o.notAttachedImage;
    });
    var imageNotComplete3 = lodash.sumBy(_doneOrders3, function(o) {
      return o.imageNotComplete;
    });
    var problems3 = lodash.sumBy(_doneOrders3, function(o) {
      return o.problems;
    });
    var total3 = notAttachedImage3 + imageNotComplete3 + problems3;

    var _doneOrders4 = await userOrders.find({
      $and: [
        { network_id: "5d639bb0a777633ff6c75eb9" },
        { company_id: "5d64eae1cd3c9c0024e6fb7f" }
      ]
    });
    var notAttachedImage4 = lodash.sumBy(_doneOrders4, function(o) {
      return o.notAttachedImage;
    });
    var imageNotComplete4 = lodash.sumBy(_doneOrders4, function(o) {
      return o.imageNotComplete;
    });
    var problems4 = lodash.sumBy(_doneOrders4, function(o) {
      return o.problems;
    });
    var total4 = imageNotComplete4 + notAttachedImage4 + problems4;

    orderedResult.push(
      {
        name: "نوكيا - فايبر",
        value: total1
      },
      {
        name: "نوكيا - نحاس",
        value: total2
      },
      {
        name: "قنوات الشبكة - فايبر",
        value: total3
      },
      {
        name: "قنوات الشبكة - نحاس",
        value: total4
      }
    );

    // company_arr.push({ name: result.full_name, series: orderedResult })
    reply.send(orderedResult);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getMotstMethodFor = async (req, reply) => {
  try {
    var products = [];
    var item = await payments
      .find({ methodFor: { $exists: true } }, { status: 2 })
      .populate("methodFor");

      item.forEach(element => {
        products.push(element.methodFor);
      });

      var _result = lodash(products)
        .groupBy("name")
        .map(function(items, _name) {
          return { name: _name, value: items.length };
        })
        .value();

      var orderedResult = lodash.orderBy(_result, ["count"], ["desc"]);
      var FinalResult = lodash.take(orderedResult, 10);

      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: FinalResult
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getMotstMethodType = async (req, reply) => {
  try {
    var products = [];
    var item = await payments
      .find({ methodType: { $exists: true } }, { status: 2 })
      .populate("methodType")
     
      item.forEach(element => {
        products.push(element.methodType);
      });

      var _result = lodash(products)
        .groupBy("name")
        .map(function(items, _name) {
          return { name: _name, value: items.length };
        })
        .value();

      var orderedResult = lodash.orderBy(_result, ["count"], ["desc"]);
      var FinalResult = lodash.take(orderedResult, 10);

      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: FinalResult
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// تسجيل المستفيدين
exports.getUsersPerYear = async (req, reply) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var items = [];

    var result =  await Users.find()
      .sort({ createAt: 1 })
      result.forEach(element => {
        var month_number = new Date(element.createAt).getMonth();
        var month_name = monthNames[month_number];
        items.push({ month: month_name, user: element._id });
      });

      var _result = lodash(items)
        .groupBy("month")
        .map(function(items, _name) {
          return { name: _name, value: items.length };
        })
        .value();

      var orderedResult = lodash.orderBy(_result, ["count"], ["desc"]);

      const response = {
        name: "مستخدم جديد",
        series: orderedResult
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};
// تسجيل المتبرعين
exports.getAdminsPerYear = async (req, reply) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var items = [];

    var result = await Admins.find()
      .sort({ createAt: 1 })
      result.forEach(element => {
        var month_number = new Date(element.createAt).getMonth();
        var month_name = monthNames[month_number];
        items.push({ month: month_name, user: element._id });
      });

      var _result = lodash(items)
        .groupBy("month")
        .map(function(items, _name) {
          return { name: _name, value: items.length };
        })
        .value();

      var orderedResult = lodash.orderBy(_result, ["count"], ["desc"]);

      const response = {
        name: "مستخدم جديد",
        series: orderedResult
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

//الوارد
exports.PaymentPerYear = async (req, reply) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var items = [];
    var result = await payments.find({ status: 2 })
    result.forEach(element => {
      var month_number = new Date(element.createAt).getMonth();
      var month_name = monthNames[month_number];
      if (element.flag == 1) {
        items.push({
          month: month_name,
          Total: element.ammount,
          flag: element.flag
        });
      }
    });

    var _result = lodash(items)
      .groupBy("month")
      .map(function(items, _name) {
        return {
          name: _name,
          value: lodash.sumBy(items, function(o) {
            return o.Total;
          })
        };
      })
      .value();

    // var _result2 = lodash(items2)
    //     .groupBy('month')
    //     .map(function (items, _name) {
    //         return { name: _name, value: lodash.sumBy(items, function (o) { return o.Total; }), }
    //     }).value()

    // const response = [
    //     {
    //         name: 'الوارد في الصندوق',
    //         items: _result
    //     },
    //     {
    //         name: 'الصادر في الصندوق',
    //         items: _result2
    //     }
    // ]

    // var _result3 = lodash(_result)
    //     .groupBy('name')
    //     .map(function (items, _name) {
    //         return { name: _name, value: lodash.sumBy(items, function (o) { return o.value; }), }
    //     }).value()

    reply.send(_result);
  } catch (err) {
    throw boom.boomify(err);
  }
};

//الصادر
exports.PaymentPerYear2 = async (req, reply) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var items = [];
    var result = await payments.find({ status: 2 })
    result.forEach(element => {
      var month_number = new Date(element.createAt).getMonth();
      var month_name = monthNames[month_number];
      if (element.flag == -1) {
        items.push({
          month: month_name,
          Total: element.ammount,
          flag: element.flag
        });
      }
    });

    var _result = lodash(items)
      .groupBy("month")
      .map(function(items, _name) {
        return {
          name: _name,
          value: lodash.sumBy(items, function(o) {
            return o.Total;
          })
        };
      })
      .value();

    reply.send(_result);
  } catch (err) {
    throw boom.boomify(err);
  }
};
