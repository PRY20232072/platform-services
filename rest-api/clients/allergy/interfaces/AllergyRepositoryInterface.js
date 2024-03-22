const { Constants } = require("../../common/Constants");

class AllergyRepositoryInterface {
    getAllergyList() {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getAllergyById(allergy_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getAllergyListByPatientId(patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getAlleryByIdAndPatientId(allergy_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    existAllergyByIdAndPatientId(allergy_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createAllergy(allergy_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updateAllergy(allergy_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deleteAllergy(allergy_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports.AllergyRepositoryInterface = AllergyRepositoryInterface;
