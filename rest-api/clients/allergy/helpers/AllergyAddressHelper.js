const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class AllergyAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.ALLERGY_REGISTRY_TP_NAME,
            Constants.ALLERGY_REGISTRY_TP_CODE,
            Constants.ALLERGY_REGISTRY_TP_VERSION
        );
    }

    getAllergyPatientAddress(allergy_id, patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var allergyAddr = this.hash(allergy_id).substring(0, 22);
        var patientAddr = this.hash(patient_id).substring(0, 40);
        return pref + this.TP_CODE + allergyAddr + patientAddr;
    }

    getPatientAllergyAddress(patient_id, allergy_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        var allergyAddr = this.hash(allergy_id).substring(0, 40);
        return pref + this.TP_CODE + patientAddr + allergyAddr;
    }

    getAddressByPatientId(patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        return pref + this.TP_CODE + patientAddr;
    }

    getAddressByAllergyId(allergy_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var allergyAddr = this.hash(allergy_id).substring(0, 22);
        return pref + this.TP_CODE + allergyAddr;
    }
}

module.exports.AllergyAddressHelper = AllergyAddressHelper;