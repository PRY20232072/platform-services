const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class PatientBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.PATIENT_REGISTRY_TP_NAME,
            Constants.PATIENT_REGISTRY_TP_CODE,
            Constants.PATIENT_REGISTRY_TP_VERSION
        );
    }
}

module.exports.PatientBlockchainHelper = PatientBlockchainHelper;