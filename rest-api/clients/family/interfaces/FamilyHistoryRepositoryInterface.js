const { Constants } = require("../../common/Constants");

class FamilyHistoryRepositoryInterface {
    getFamilyHistoryList() {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getFamilyHistoryById(family_history_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getFamilyHistoryListByPatientId(patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getFamilyHistoryByIdAndPatientId(family_history_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    existFamilyHistoryByIdAndPatientId(family_history_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createFamilyHistory(family_history_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updateFamilyHistory(family_history_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deleteFamilyHistory(family_history_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports.FamilyHistoryRepositoryInterface = FamilyHistoryRepositoryInterface;
