// importing requirements
const { check } = require('express-validator');
const { findRecord } = require('../db/findDb');

/**
 * This method is only used to validate the email fields.
 * @param {Array} emails - This method takes an array of email-names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Object} object - It contain two things, one checkInDb and the other is the modelName => object: { checkInDb: True, modelName: 'User' }
 * @returns {Array} - It returns validation array to validate email fields.
 */
const validateEmail = (emails, isOptional, object) => {

    // check that the given input is array type
    if (!Array.isArray(emails)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return emails.map(email => {
        const validationChain = check(email, `Enter a valid ${email}`).isEmail().isLength({ max: 50 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // find the record in the database, if present then throw an error
        if (object?.checkInDb) {
            validationChain.custom(async (email) => await findRecord(object?.modelName, { email }));
        }

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateEmail };