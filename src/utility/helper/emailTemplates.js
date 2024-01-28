// define a template to send the otp to the user
exports.otpEmailTemplate = (name, otp, title) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container {
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>${title}</h1>
        <p>Hello, ${name}!</p>
        <p>This email contains a One-Time Passcode (OTP) for your password recovery.</p>
        <p><strong>Your OTP:</strong></p>
        <p class="button">${otp}</p>
        <p>If you did not initiate this password recovery request, please ignore this email.</p>
        <p>If you have any questions or concerns, contact at (kumarhritiksinha@gmail.com).</p>
        <p>Thank you for choosing Notes!</p>
    </div>
</body>

</html>

`