const jwt = require('jsonwebtoken');
const config = require('config');

exports.getToken = (request, reply, done) => {
  console.log('token' + request.headers['token'])
  const token = request.headers['token']
  if (!token) {
    const response = {
      status_code: 400,
      status: false,
      message: 'Access denied. No token provided.'
    }
    reply.code(400)
    done(new Error('Access denied. No token provided.'))
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    request.user = decoded;
    console.log(request.user._id)
    if (request.user.isBlock || request.user.isBlock == true) {
      const response = {
        status_code: 400,
        status: false,
        message: 'عذرا .. لقد تم حظرك من قبل الادارة'
      }
      reply.code(400)
      done(response)
    } else {
      done();
    }
  }
  catch (ex) {
    reply.code(400)
    done(new Error('Invalid token.'))
  }
}
