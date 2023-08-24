const jwt = require('jsonwebtoken');

// signature for JSON Web tokens
const signature = "jaishreekrishna-raadhe-raadhe";

// this function will fetch the user-id from jwt token (used when login is required)
const fetchuser = (req, res, next) => {

    // fetch the user-id from jwt token header and send it with req object
    const token = req.header('auth-token');

    // if token is not present then send bad request
    if (!token) res.status(401).json({ errors: "please authenticate with a valid token" });

    // now fetch the id
    try {
        const data = jwt.verify(token, signature);
        req.user = data.user;

        next();  // calling next funciton after fetchuser runs
    }
    catch (err) {
        res.status(401).json({ errors: "please authenticate with a valid token" });
    }
}

module.exports = fetchuser;