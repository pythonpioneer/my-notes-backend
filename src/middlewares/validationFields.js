// importing requirements
const { validateName } = require("../utility/validateFields/nameField");
const { validateEmail } = require("../utility/validateFields/emailField");
const { validatePassword } = require("../utility/validateFields/passwordField");
const { validateString } = require("../utility/validateFields/stringField");
const { validateMongoId } = require("../utility/validateFields/mongoField");
const { validateOtp } = require("../utility/validateFields/otpField");


// generating validation array for registration fields
exports.validateRegistrationField = [
    ...validateEmail(['email'], false, { checkInDb: true, modelName: 'User' }),
    ...validateName(['fullName']),
    ...validatePassword(['password']),
];

// generating validation array for login fields
exports.validateLoginFields = [
    ...validateEmail(['email']),
    ...validatePassword(['password']),
];

// generating validation array for task title and task descriptions
exports.validateTaskFields = [
    ...validateString(['title'], false, { min: 1, max: 200 }),
    ...validateString(['category'], true, { min: 1, max: 100 }),
    ...validateString(['desc'], false, { min: 1, max: 5000 }),
];

// validating the mongoose object id, especially for update and delete not
exports.validateMongoFields = [
    ...validateMongoId(['note-id'])
];

// validating updation of task fields
exports.validateUpdationTaskFields = [
    ...validateString(['title'], true, { min: 1, max: 200 }),
    ...validateString(['category'], true, { min: 1, max: 100 }),
    ...validateString(['desc'], true, { min: 1, max: 5000 }),
];

// to validate email field
exports.validateEmailField = [
    ...validateEmail(['email']),
];

// to validate the otp field
exports.validateRecoverPasswordFields = [
    ...validateEmail(['email']),
    ...validateOtp(['otp'], false, 4),
    ...validatePassword(['password']),
];

exports.validateSearchFields = [
    ...validateString(['search'], true, { max: 100 }),
];