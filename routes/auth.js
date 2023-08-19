const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// managing all routes for the user (doesn't required authentication)
router.post('/', [
    body('name').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 6}),

] , (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({erros: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    .then(user => res.json(user))
    .catch(err => res.send(
        {"issue": "Please send unique values",
        "error": err
    }
    ));
});

module.exports = router;