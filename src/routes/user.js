// importing requirements
const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/user');
const { validateValidationResult } = require('../middlewares/validationMiddleware');
const { validateRegistrationField, validateLoginFields } = require('../middlewares/validationFields');


// Route 1: To create user: '/todo/v1/user/register' [using POST] (login not required)
router.post('/register', validateRegistrationField, validateValidationResult, registerUser);

// Route 2: To login user: '/todo/v1/user/login' [using POST] (login not required)
router.post('/login', validateLoginFields, validateValidationResult, loginUser);

// exporting the router object
module.exports = router;