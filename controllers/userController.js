// External Dependancies
const boom = require("boom");
const jwt = require("jsonwebtoken");
const config = require("config");
const fs = require("fs");
const NodeGeocoder = require("node-geocoder");
const concat = require("concat-stream");
const pump = require("pump");
const cloudinary = require("cloudinary");
const multer = require("multer");
var moment = require("moment-timezone");
var nodemailer = require("nodemailer");

const { Users } = require("../models/User");
const { Admins } = require("../models/Admin");
const { encryptPassword } = require("../utils/utils");
const { getCurrentDateTime, bankfiles } = require("../models/Constant");

var transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@algoshayan.com",
    pass: "Nadia@1385"
  }
});

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Get all Users
exports.getUsers = async (req, reply) => {
  try {
    if (req.query.page) {
      var page = parseInt(req.query.page, 10);
      var limit = parseInt(req.query.limit, 10);

      const total = await Users.find().count();
      const _Users = await Users.find()
        .populate("payment_for")
        .sort({ _id: -1 })
        .skip(page * limit)
        .limit(limit)
        .exec(function(err, result) {
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
        });
    } else {
      await Users.find()
        .populate("payment_for")
        .sort({ _id: -1 })
        .exec(function(err, result) {
          const response = {
            items: result,
            status_code: 200,
            message: "returned successfully",
            pagenation: {
              size: 0,
              totalElements: 0,
              totalPages: 0,
              pageNumber: 0
            }
          };
          reply.send(response);
        });
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get search
exports.getUsersSearch = async (req, reply) => {
  try {
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    const total = await Users.find({
      $or: [
        { phone_number: { $regex: req.body.phone_number, $options: "i" } },
        { Id_no: { $regex: req.body.Id_no, $options: "i" } }
      ]
    }).count();
    await Users.find({
      $or: [
        { phone_number: { $regex: req.body.phone_number, $options: "i" } },
        { full_name: { $regex: req.body.full_name, $options: "i" } },
        { Id_no: { $regex: req.body.Id_no, $options: "i" } }
      ]
    })
      .populate("payment_for")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec(function(err, result) {
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
      });
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single User by ID
exports.getSingleUser = async (req, reply) => {
  try {
    const _Users = await Users.findById(req.params.id).populate("payment_for");

    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: _Users
    };
    return response;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new User
exports.addUser = async (req, reply) => {
  try {
    const pervAdminEmail = await Admins.findOne({
      $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }]
    }).lean();
    const pervUserEmail = await Users.findOne({
      $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }]
    }).lean();
    if (pervAdminEmail) {
      // emeail is exsits
      const response = {
        status_code: 400,
        status: false,
        message: "البريد الالكتروني او رقم الجوال موجود مسبقا",
        items: null
      };
      return response;
    } else if (pervUserEmail) {
      // emeail is exsits
      const response = {
        status_code: 400,
        status: false,
        message: "البريد الالكتروني او رقم الجوال موجود مسبقا",
        items: null
      };
      return response;
    } else {
      if (req.body.user_type == "user") {
        let _Users = new Users({
          full_name: req.body.full_name,
          email: req.body.email,
          password: encryptPassword(req.body.password),
          phone_number: req.body.phone_number,
          Id_no: req.body.Id_no,
          fcmToken: req.body.fcmToken,
          user_type: req.body.user_type
        });
        let rs = await _Users.save();
        let user = await Users.findByIdAndUpdate(
          rs._id,
          {
            token: jwt.sign(
              { _id: rs._id, user_type: req.body.user_type },
              config.get("jwtPrivateKey"),
              {
                expiresIn: "365d"
              }
            ),
            gender: req.body.gender,
            social_status: req.body.social_status,
            has_children: req.body.has_children,
            children_no: req.body.children_no,
            createAt: getCurrentDateTime(),
            isBlock: false,
            isWork: req.body.isWork,
            work_type: req.body.work_type,
            house_type: req.body.house_type,
            income: req.body.income,
            isObligation: req.body.isObligation,
            Obligation: req.body.Obligation,
            number_of_dependents: req.body.number_of_dependents,
            benefit_no: req.body.benefit_no,
            payment_for_no: req.body.payment_for_no,
            notes: req.body.notes,
            isActivate: req.body.isActivate,
            payment_for: req.body.payment_for,
            isActivePayment: false
          },
          { new: true }
        );
        const files = await bankfiles.find({ file_name: "وثيقة المستفيد" });

        const response = {
          status_code: 200,
          status: true,
          message: "تمت العملية بنجاح",
          items: user,
          files: files
        };
        return response;
      } else {
        let _Admins = new Admins({
          full_name: req.body.full_name,
          email: req.body.email,
          password: encryptPassword(req.body.password),
          phone_number: req.body.phone_number,
          Id_no: req.body.Id_no,
          fcmToken: req.body.fcmToken,
          user_type: req.body.user_type
        });

        let rs = await _Admins.save();
        const files = await bankfiles.find({ file_name: "وثيقة المتبرع" });

        let admin = await Admins.findByIdAndUpdate(
          rs._id,
          {
            createAt: getCurrentDateTime(),
            paymentMethod_type: req.body.paymentMethod_type,
            ammount: req.body.ammount,
            paymentMethod_id: req.body.paymentMethod_id,
            type: req.body.type,
            isActivePayment: false,
            token: jwt.sign(
              { _id: rs._id, user_type: req.body.user_type },
              config.get("jwtPrivateKey"),
              {
                expiresIn: "365d"
              }
            )
          },
          { new: true }
        );
        const response = {
          status_code: 200,
          status: true,
          message: "تمت العملية بنجاح",
          items: admin,
          files: files
        };
        return response;
      }
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

// delete User
exports.BlockeUser = async (req, reply) => {
  const _Users = await Users.findByIdAndUpdate(
    req.params.id,
    {
      isBlock: req.body.isBlock
    },
    { new: true }
  );

  const response = {
    status_code: 200,
    status: true,
    message: "تمت العملية بنجاح",
    items: _Users
  };
  return response;
};

// activate User
exports.activateUser = async (req, reply) => {
  const _Users = await Users.findByIdAndUpdate(
    req.params.id,
    {
      isActivate: req.body.isActivate
    },
    { new: true }
  );

  const response = {
    status_code: 200,
    status: true,
    message: "تمت العملية بنجاح",
    items: _Users
  };
  return response;
};

// Update an existing User
exports.updateUser = async (req, reply) => {
  try {
    const _Users = await Users.findByIdAndUpdate(
      req.params.id,
      {
        gender: req.body.gender,
        social_status: req.body.social_status,
        has_children: req.body.has_children,
        children_no: req.body.children_no,
        createAt: getCurrentDateTime(),
        isBlock: false,
        isWork: req.body.isWork,
        work_type: req.body.work_type,
        house_type: req.body.house_type,
        income: req.body.income,
        isObligation: req.body.isObligation,
        Obligation: req.body.Obligation,
        number_of_dependents: req.body.number_of_dependents,
        benefit_no: req.body.benefit_no,
        payment_for_no: req.body.payment_for_no,
        notes: req.body.notes,
        isActivate: req.body.isActivate,
        payment_for: req.body.payment_for
      },
      { new: true }
    );

    const response = {
      status_code: 200,
      status: true,
      message: "return succssfully",
      items: _Users
    };
    return response;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// login User
exports.loginUser = async (req, reply) => {
  try {
    const pass = encryptPassword(req.body.password);
    const _Users = await Users.findOne({
      $and: [{ email: req.body.email }, { password: pass }]
    });
    const _Admin = await Admins.findOne({
      $and: [{ email: req.body.email }, { password: pass }]
    });

    console.log(_Users);
    if (_Users) {
      if (_Users.isActivePayment == true) {
        await Users.findByIdAndUpdate(
          _Users._id,
          {
            fcmToken: req.body.fcmToken
          },
          { new: true }
        );

        const response = {
          type: "user",
          status_code: 200,
          status: true,
          message: "return succssfully",
          items: _Users
        };
        return response;
      } else {
        const response = {
          type: "user",
          status_code: 400,
          status: false,
          message: "عذرا .. الحساب قيد المراجعة",
          items: _Users
        };
        return response;
      }
    } else if (_Admin) {
      if (_Admin.isActivePayment == true) {
        await Admins.findByIdAndUpdate(
          _Admin._id,
          {
            fcmToken: req.body.fcmToken
          },
          { new: true }
        );

        const response = {
          type: "admin",
          status_code: 200,
          status: true,
          message: "return succssfully",
          items: _Admin
        };
        return response;
      } else {
        const response = {
          type: "admin",
          status_code: 400,
          status: false,
          message: "عذرا .. الحساب قيد المراجعة",
          items: _Admin
        };
        return response;
      }
    } else {
      const response = {
        status_code: 400,
        status: false,
        message: "خطأ في معلومات الدخول",
        items: null
      };
      return response;
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

//forget password
exports.forgetPassword = async (req, reply) => {
  try {
    const _Users = await Users.findOne({
      $and: [{ email: req.body.email }, { phone_number: req.body.phone_number }]
    });
    const _Admins = await Admins.findOne({
      $and: [{ email: req.body.email }, { phone_number: req.body.phone_number }]
    });
    const _newPassword = makeid();
    const newPassword = encryptPassword(_newPassword);
    if (_Users) {
      console.log(_Users);
      const update = await Users.findByIdAndUpdate(
        _Users._id,
        { password: newPassword },
        { new: true }
      );
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
                            <a href="www.Ghoshian.com"
                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#bbbfc3;font-size:19px;font-weight:bold;text-decoration:none"
                               target="_blank"
                               data-saferedirecturl="www.Ghoshian.com">
                               Ghoshian
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
                                                                                new password is: ${_newPassword}</a>
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
                                            Regards,<br>Ghoshian</p>

                                        <table class="m_1006477609114479258subcopy" width="100%" cellpadding="0"
                                               cellspacing="0"
                                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-top:1px solid #edeff2;margin-top:25px;padding-top:25px">
                                            <tbody>
                                            <tr>
                                                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                    <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;line-height:1.5em;margin-top:0;text-align:left;font-size:12px">
                                                         "Your password is: ${_newPassword}"
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
                                            © 2019 Ghoshian. All rights reserved.</p>
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
           `;

      var mailOptions = {
        from: '"صندوق الغشيان" <info@algoshayan.com>',
        to: req.body.email,
        subject: "استعادة كلمة المرور",
        html: msg
      };
      transporter.sendMail(mailOptions);
      const response = {
        status_code: 200,
        status: true,
        message: "تم ارسال كلمة المرور الى البريد الالكتروني بنجاح",
        items: update
      };
      return response;
    } else if (_Admins) {
      console.log(_Admins);
      const update = await Admins.findByIdAndUpdate(
        Admins._id,
        { password: newPassword },
        { new: true }
      );
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
                            <a href="www.Ghoshian.com"
                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#bbbfc3;font-size:19px;font-weight:bold;text-decoration:none"
                               target="_blank"
                               data-saferedirecturl="www.Ghoshian.com">
                               Ghoshian
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
                                            Hello ${_Admins.full_name}!</h1>
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
                                                                                new password is: ${_newPassword}</a>
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
                                            Regards,<br>Ghoshian</p>

                                        <table class="m_1006477609114479258subcopy" width="100%" cellpadding="0"
                                               cellspacing="0"
                                               style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-top:1px solid #edeff2;margin-top:25px;padding-top:25px">
                                            <tbody>
                                            <tr>
                                                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                    <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;line-height:1.5em;margin-top:0;text-align:left;font-size:12px">
                                                         "Your password is: ${_newPassword}"
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
                                            © 2019 Ghoshian. All rights reserved.</p>
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
           `;

      var mailOptions = {
        from: '"صندوق الغشيان" <info@algoshayan.com>',
        to: req.body.email,
        subject: "استعادة كلمة المرور",
        html: msg
      };
      transporter.sendMail(mailOptions);
      const response = {
        status_code: 200,
        status: true,
        message: "تم ارسال كلمة المرور الى البريد الالكتروني بنجاح",
        items: update
      };
      return response;
    } else {
      const response = {
        status_code: 404,
        status: false,
        message: "البريد الالكتروني غير مسجل لدينا",
        items: []
      };
      return response;
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

//reset password
exports.resetPasswordUsers = async (req, reply) => {
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
    const pass = encryptPassword(req.body.password);
    const _user = await Users.findByIdAndUpdate(
      req.params.id,
      {
        password: pass
      },
      { new: true }
    );
    const response = {
      status_code: 200,
      status: true,
      message: "تم تعديل كلمة المرور بنجاح",
      items: _user
    };
    return response;
    // }
  } catch (err) {
    throw boom.boomify(err);
  }
};

//reset email
exports.resetEmailUsers = async (req, reply) => {
  try {
    const pervAdminEmail = await Admins.findOne({
      email: req.body.email
    }).lean();
    const pervUserEmail = await Users.findOne({ email: req.body.email }).lean();
    if (pervAdminEmail) {
      // emeail is exsits
      const response = {
        status_code: 400,
        status: false,
        message: "الايميل موجود مسبقا",
        items: null
      };
      return response;
    } else if (pervUserEmail) {
      // emeail is exsits
      const response = {
        status_code: 400,
        status: false,
        message: "الايميل موجود مسبقا",
        items: null
      };
      return response;
    } else {
      const _user = await Users.findByIdAndUpdate(
        req.params.id,
        {
          email: req.body.email
        },
        { new: true }
      );
      const response = {
        status_code: 200,
        status: true,
        message: "تم تعديل البريد الالكتروني بنجاح",
        items: _user
      };
      return response;
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};
