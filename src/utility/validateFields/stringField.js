// importing requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the name fields.
 * @param {Array} messages - This method takes an array of names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Object} length - It takes length object to represent minimum and maximum values, length: { min: 1, max: 100 }.
 * @returns {Array} - It returns validation array to validate name fields.
 */
 const validateString = (messages, isOptional, length) => {

    // check that the given input is array type
    if (!Array.isArray(messages)) throw new Error('This method accepts input as an array only.');

    // now validate the name field
    return messages.map(name => {
        const validationChain = check(name, `Enter a valid ${name}`).isLength(length);

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateString };