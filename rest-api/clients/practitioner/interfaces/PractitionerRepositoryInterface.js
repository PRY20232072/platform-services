const { Constants } = require("../../common/Constants");

class PractitionerRepositoryInterface {
    getPractitionerList() {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getPractitionerById(patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    existPractitionerById(practitioner_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createPractitioner(identifier, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updatePractitioner(identifier, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deletePractitioner(identifier) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports = { PractitionerRepositoryInterface };
