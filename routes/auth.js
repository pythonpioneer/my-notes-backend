const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// signature for JSON Web tokens
const signature = "jaishreekrishna-raadhe-raadhe";


// Route 1: To create user: "/api/v1/auth/createuser" [ using POST ] (login not required)
router.post('/createuser', [

    // specifying parameters specifications for validation
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail().custom(async (email) => {

        // find any user with the given email
        if (await User.findOne({ email })) {
            throw new Error('Email already in use');
        }
    }),
    body('password', 'Enter a valid Password').isLength({ min: 6 }),

], async (req, res) => {

    // validating errors for authentication (creating user)
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ status: 400, message: result["errors"][0]["msg"], where: result["errors"][0]["path"] });
    }

    // generating a secure password
    var salt = bcrypt.genSaltSync(10);  // no-need of await (using sync methods)
    const securedPassword = bcrypt.hashSync(req.body.password, salt);  // no-need of await (using sync methods)

    // creating user after validating fields
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPassword
    })
        .then((user) => {  // sending response, when user is created

            // sending user id as payload, accesssing data using id is easier
            const payloadData = {
                user: {
                    id: user.id
                },
            };

            // sign with RSA SHA256
            const authToken = jwt.sign(payloadData, signature);
            res.json({ status: 200, "auth-token": authToken});
        })
        .catch(err => res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error", issue: err
        }));
});

// Route 2: To login user: "/api/v1/auth/loginuser" [ using POST ] (login not required)
router.post('/loginuser', [

    // specifying parameters specifications for validation
    body('email').isEmail(),
    check('password').exists(),

], async (req, res) => {

    try {
        // validating errors for authentication (login user)
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ status: 400, message: result["errors"][0]["msg"], where: result["errors"][0]["path"] });
        }

        // exception handling, if any unrecogonized error occured

        // fetching value from request body
        const { email, password } = req.body;

        // find the user with given email and validate, if user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, compare the password using bcrypt.js
        const isPasswordMatches = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // sign with RSA SHA256
        const authToken = jwt.sign(payloadData, signature);
        res.json({ status: 200, "auth-token": authToken});
    } catch (err) {
        res.status(500).json({ status: 500, errors: "Internal server error" });
    }
});

// Route 3: To get logged in user detail: "/api/v1/auth/getuser" [ using POST ] (login required)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');  // excluding password (because only hash stored)
        res.send(user);
    }
    catch (err) {
        res.status(500).json({ status: 500, errors: "Internal server error" });
    }
});

module.exports = router;