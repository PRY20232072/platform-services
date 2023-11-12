const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class PatientAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.PATIENT_REGISTRY_TP_NAME,
            Constants.PATIENT_REGISTRY_TP_CODE,
            Constants.PATIENT_REGISTRY_TP_VERSION
        );
    }

    getAddress(identifier) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var addr = this.hash(identifier).substring(0, 62);
        return pref + this.TP_CODE + addr;
    }
}

module.exports.PatientAddressHelper = PatientAddressHelper;