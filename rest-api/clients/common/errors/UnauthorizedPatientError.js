const { HttpStatusCode } = require("axios");
const { Constants } = require("../Constants");
const { CustomError } = require("./CustomError");

class UnauthorizedPatientError extends CustomError {
    constructor(currentMessage = '') {
        super(Constants.UNAUTHORIZED_PATIENT_MSG, currentMessage, HttpStatusCode.Unauthorized);
    }
}

module.exports.UnauthorizedPatientError = UnauthorizedPatientError;
