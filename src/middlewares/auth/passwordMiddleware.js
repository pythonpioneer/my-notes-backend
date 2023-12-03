const bcrypt = require('bcryptjs');

/**
 * This function generate the hash of given password
 * @param {String} password - It takes password as a plain text
 * @returns {String} - It return a hash password
 */
exports.generatePassword = (password) => {
    const salt = bcrypt.genSaltSync(10);  // salt of 10 characters
    const securePassword = bcrypt.hashSync(password, salt);

    return securePassword;
};

/**
 *  This funtion compare the hashed passwords using bcrypt
 * @param {String} currentPassword - It takes the non-hashed pssword or a simple text
 * @param {String} actualPassword - It takes the hashed password
 * @returns {Boolean} - It returns true, if password mathches else false
 * */ 
exports.comparePassword = (currentPassword, actualPassword) => {
    if(!currentPassword || !actualPassword) 
        throw new Error('All Fields are required');
    return bcrypt.compareSync(currentPassword, actualPassword);
};