// importing all requirements
const User = require('../models/User');
const { generateToken } = require('../middlewares/auth/authMiddleware');
const { generatePassword, comparePassword } = require('../middlewares/auth/passwordMiddleware');


// to create a user
const registerUser = async (req, res) => {
    try {
        // fetching the data from the request body
        const { fullName, password } = req.body;
        const email = req.body.email.toLowerCase();

        // generate a secure password using bcrypt js
        const securePassword = generatePassword(password);

        // now, create a new user with these credentials
        User.create({
            email,
            fullName,
            password: securePassword
        })
            .then(user => {  // user created successfully

                // now, sending user id as payload, accesssing data using id is easier
                const payloadData = {
                    user: {
                        id: user.id
                    },
                };

                // generate the authentication user
                const authToken = generateToken(payloadData);
                return res.status(200).json({ status: 200, message: `Hello ${user?.fullName?.split(' ')[0] || 'User Logged In'}!!`, "auth-token": authToken });
            })
            .catch(err => {  // error while saving the user in User model
                return res.status(500).json({ status: 500, message: "User Not Created!", errors: err });
            });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error!" });
    }
};

// to login the existing users
const loginUser = async (req, res) => {
    try {
        // fetch the credentials from the request body
        const { email, password } = req.body;

        // now, find the user 
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ status: 401, message: "Invalid Credentials!" });  // use not found here but returning invalid credentials for security purpose

        // now, compare the password of the existing user with the current user
        const isPasswordMatched = comparePassword(password, user.password);
        if (!isPasswordMatched) return res.status(401).json({ status: 401, message: "Invalid Credentials!" });  // password not matched

        // now, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate the authentication user
        const authToken = generateToken(payloadData);
        return res.status(200).json({ status: 200, message: `Hello ${user?.fullName?.split(' ')[0] || 'User Logged In'}!!`, "auth-token": authToken });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error!" });
    }
};

// exporting all the controller functions
module.exports = { registerUser, loginUser };