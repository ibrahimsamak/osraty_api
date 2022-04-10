const jwt = require("jsonwebtoken");
const config = require("config");

const { Users } = require("../models/User");
const { Admins } = require("../models/Admin");

/**
 * Authentication guard: verifies the JWT from the `token` header,
 * loads the matching user/admin and rejects blocked accounts.
 *
 * @param {object} request - Incoming Fastify request.
 * @param {object} reply - Fastify reply used to send the response.
 * @param {Function} done - Callback continuing or aborting the request lifecycle.
 */
exports.getToken = async (request, reply, done) => {
  const token = request.headers["token"];
  if (!token) {
    const response = {
      status_code: 400,
      status: false,
      message: "Access denied. No token provided."
    };
    reply.code(400);
    done(response);
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    request.user = decoded;
    if (request.user.user_type == "admin") {
      let admin = await Admins.findById(request.user._id);
      if (admin.isBlock) {
        const response = {
          status_code: 400,
          status: false,
          message: "عذرا هذا السمتخدم محظور من قبل الادارة"
        };
        done(response);
      }
    } else if (request.user.user_type == "user") {
      let user = await Users.findById(request.user._id);
      if (user.isBlock) {
        const response = {
          status_code: 400,
          status: false,
          message: "عذرا هذا السمتخدم محظور من قبل الادارة"
        };
        done(response);
      }
    } else {
      //done();
    }
  } catch (ex) {
    reply.code(400);
    done(new Error("Invalid token."));
  }
};
