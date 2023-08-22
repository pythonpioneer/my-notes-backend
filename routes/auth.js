const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// signature for JSON Web tokens
const signature = "jaishreekrishna-raadhe-raadhe";


// Route 1: To create user: "/api/v1/auth/createuser" (login not required)
router.post('/createuser', [

    // specifying parameters specifications for validation
    body('name').isLength({ min: 3 }),
    body('email').isEmail().custom(async (email) => {

        // find any user with the given email
        if (await User.findOne({ email })) {
            throw new Error('Email already in use');
        }
    }),
    body('password').isLength({ min: 6 }),

], async (req, res) => {

    // validating errors for authentication (creating user)
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ "errors": result, "desc": result["errors"][0]["msg"], "where": result["errors"][0]["path"] });
    }

    // generating a secure password
    var salt = bcrypt.genSaltSync(10);  // no-need of await
    const securedPassword = bcrypt.hashSync(req.body.password, salt);  // no-need of await

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
            res.json({ authToken });
        })
        .catch(err => res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error"
        }));
});


// Route 2: To login user: "/api/v1/auth/loginuser" (login not required)
router.post('/loginuser', [

    // specifying parameters specifications for validation
    body('email').isEmail(),
    check('password').exists(),

], async (req, res) => {

    // validating errors for authentication (login user)
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ "errors": result, "desc": result["errors"][0]["msg"], "where": result["errors"][0]["path"] });
    }

    // exception handling, if any unrecogonized error occured
    try {

        // fetching value from request body
        const { email, password } = req.body;

        // find the user with given email and validate, if user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ "error": "Invalid Credentials" });

        // now, compare the password using bcrypt.js
        const isPasswordMatches = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ "error": "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // sign with RSA SHA256
        const authToken = jwt.sign(payloadData, signature);
        res.json({ authToken });
    } catch (err) { 
        res.status(500).json({errors: "Internal server error"});
    }
});

module.exports = router;