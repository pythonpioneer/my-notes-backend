// importing all requirements
const { validationResult } = require('express-validator');


// This middleware funciton is used to validate the validation array
exports.validateValidationResult = (req, res, next) => {
    
    // validating errors for authentication (creating user)
    const result = validationResult(req);

    // when validation not satisfied
    let obj = {
        status: 400,
        message: result["errors"][0]?.msg,
        where: result["errors"][0]?.path,
    };

    // user will not created
    if (!result.isEmpty()) return res.status(400).json(obj);

    next();  // to pass controls to the next function
};