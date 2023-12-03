// importing requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the name fields.
 * @param {Array} names - This method takes an array of names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @returns {Array} - It returns validation array to validate name fields.
 */
 const validateName = (names, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(names)) throw new Error('This method accepts input as an array only.');

    // now validate the name field
    return names.map(name => {
        const validationChain = check(name, 'Enter a valid full name').isLength({ min: 3, max: 25 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateName };