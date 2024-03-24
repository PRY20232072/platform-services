const { HttpStatusCode } = require("axios");
const { Constants } = require("../Constants");

class UnauthorizedPractitionerError extends Error {
    constructor() {
        super(Constants.UNAUTHORIZED_PRACTITIONER_MSG);
        this.status = HttpStatusCode.Unauthorized;
        this.message = Constants.UNAUTHORIZED_PRACTITIONER_MSG;
    }
}

module.exports.UnauthorizedPractitionerError = UnauthorizedPractitionerError;
