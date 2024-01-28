// importing requirements
const router = require('express').Router();
const { registerUser, loginUser, generateOtp } = require('../controllers/user');
const { validateValidationResult } = require('../middlewares/validationMiddleware');
const { validateRegistrationField, validateLoginFields, validateEmailField } = require('../middlewares/validationFields');


// Route 1: To create user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationField, validateValidationResult, registerUser);

// Route 2: To login user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateLoginFields, validateValidationResult, loginUser);

// Route 3: To generate otp to change password: '/api/v1/user/generate' [using POST] (login not required)
router.post('/generate', validateEmailField, validateValidationResult, generateOtp);

// exporting the router object
module.exports = router;