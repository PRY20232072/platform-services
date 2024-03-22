const { Constants } = require("../../common/Constants");

class PatientRepositoryInterface {
    getPatientList() {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getPatientById(patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createPatient(identifier, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updatePatient(identifier, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deletePatient(identifier) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports = { PatientRepositoryInterface };
