const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class ConsentAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.CONSENT_REGISTRY_TP_NAME,
            Constants.CONSENT_REGISTRY_TP_CODE,
            Constants.CONSENT_REGISTRY_TP_VERSION
        );
    }

    getAddress(identifier) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var addr = this.hash(identifier).substring(0, 22);
        return pref + this.TP_CODE + addr;
    }

    getAddresses(patient_id, practitioner_id) {
        var patientPractitionerAddr = this.getPatientPractitionerAddress(patient_id, practitioner_id);
        var practitionerPatientAddr = this.getPractitionerPatientAddress(practitioner_id, patient_id);
        return [patientPractitionerAddr, practitionerPatientAddr];
    }

    getPatientPractitionerAddress(patient_id, practitioner_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        var practitioner = this.hash(practitioner_id).substring(0, 40);
        return pref + this.TP_CODE + patientAddr + practitioner;
    }

    getPractitionerPatientAddress(practitioner_id, patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var practitionerAddr = this.hash(practitioner_id).substring(0, 22);
        var patientAddr = this.hash(patient_id).substring(0, 40);
        return pref + this.TP_CODE + practitionerAddr + patientAddr;
    }
}

module.exports.ConsentAddressHelper = ConsentAddressHelper;