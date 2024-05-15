const { Constants } = require("../../common/Constants");

class AttentionRepositoryInterface {
    getAttentionById(attention_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getAttentionListByPatientId(patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createAttention(attention_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updateAttention(attention_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deleteAttention(attention_id, patient_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports.AttentionRepositoryInterface = AttentionRepositoryInterface;
