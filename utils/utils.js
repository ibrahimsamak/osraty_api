var crypto = require('crypto');

/**
 * Hash a plaintext password using an MD5 digest.
 *
 * @param {string} password - The plaintext password to hash.
 * @returns {string} The hexadecimal MD5 hash of the password.
 */
exports.encryptPassword = function (password) {
    try {
        return crypto.createHash('md5').update(password).digest('hex');
    } catch (error) {
        console.error(error);
    }

};