const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// signature for JSON Web tokens
const signature = "jaishreekrishna-raadhe-raadhe";

// Route 1: To create user, (login not required)
router.post('/createuser', [

    // specifying parameters specifications for validation
    body('name').isLength({min: 3}),
    body('email').isEmail().custom(async (email) => {

        // find any user with the given email
        if (await User.findOne({ email })) {
            throw new Error('Email already in use');
        }
    }),
    body('password').isLength({min: 6}),

] , async (req, res) => {

    // validating errors for authentication (creating user)
    const result = validationResult(req);
    if(!result.isEmpty()) {
        return res.status(400).json({"errors": result, "desc": result["errors"][0]["msg"], "where": result["errors"][0]["path"]});
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
        res.json({authToken});
    })  
    .catch(err => res.send({  // any unrecogonize error will be raised from here
        "issue": "Something went wrong.",
        "error": err
    }));
});

module.exports = router;