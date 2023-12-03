// importing all requirements
const User = require('../../models/User');

/**
 * find field/record in database
 * @param {Object} record - It takes a field and find the field in db
 * @throws {Error} - It throws an error if record in database
 */
exports.findRecord = async (modelName, record) => {

    if (!modelName) throw new Error(`Model name must be in function argumens`);

    if (modelName === 'User') {  // finding data in user db
        if (await User.findOne(record)) throw new Error(`${Object.keys(record)} is already in use.`);
    }
    else {  // any unrecogonized model
        throw new Error(`${modelName} model does not exists.`);
    }
};
