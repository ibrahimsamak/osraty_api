var crypto = require('crypto');

exports.encryptPassword = function (password) {
    try {
        return crypto.createHash('md5').update(password).digest('hex');
    } catch (error) {
        console.error(error);
    }

};