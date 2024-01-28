// to genearate a 4 digit otp
exports.generateOtp = () => {
    let otp = Math.floor(Math.random()*10000).toString();

    // send otp if the length of the otp is 4
    if (otp.length === 4) return otp;

    else {  // if otp is not 4 char long then add 1 to all the missing places
        return otp.padEnd(4, '1');
    }
}