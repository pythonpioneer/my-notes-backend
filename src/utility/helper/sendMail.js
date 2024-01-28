// importing requirements
const nodemailer = require('nodemailer');
require('dotenv').config();  // to access environment variables


// to send the mail to the user
exports.sendMail = (options) => {
    return new Promise((resolve, reject) => {
        // create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // create mail options to send the content
        let mailOptions = {
            from: process.env.MAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        // send the mail to the recipient
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err); // Log the error
                reject(400);        // Reject the promise with the error
            } else {
                resolve(200); // Resolve the promise with a success message
            }
        });
    });
};