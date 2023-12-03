// importing all requirements
const { check } = require('express-validator');


/**
 * This method is only used to validate the password fields.
 * @param {Array} passwordNames - This method takes an array of password-names as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate password fields
 */
const validatePassword = (passwordNames, isOptional) => {  // the password names can contain many password name

    // check that the given input is array type
    if (!Array.isArray(passwordNames)) throw new Error('This method accepts input as an array only.');
    
    // traverse in the password Names
    return passwordNames.map(passwordName => {
        const validationChain = check(passwordName, `Enter a valid ${passwordName}`).isLength({ min: 6, max: 15 });

        // making the validation array optional
        if (isOptional) validationChain.optional();
        return validationChain;
    });
};


// exporting all fields to be validated
module.exports = { validatePassword };