const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class FamilyHistoryAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.FAMILY_HISTORY_REGISTRY_TP_NAME,
            Constants.FAMILY_HISTORY_REGISTRY_TP_CODE,
            Constants.FAMILY_HISTORY_REGISTRY_TP_VERSION
        );
    }

    getFamilyHistoryPatientAddress(familyHistory_id, patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var familyHistoryAddr = this.hash(familyHistory_id).substring(0, 22);
        var patientAddr = this.hash(patient_id).substring(0, 40);
        return pref + this.TP_CODE + familyHistoryAddr + patientAddr;
    }

    getPatientFamilyHistoryAddress(patient_id, familyHistory_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        var familyHistoryAddr = this.hash(familyHistory_id).substring(0, 40);
        return pref + this.TP_CODE + patientAddr + familyHistoryAddr;
    }

    getAddresses(familyHistory_id, patient_id) {
        var familyHistoryPatientAddr = this.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
        var patientFamilyHistoryAddr = this.getPatientFamilyHistoryAddress(patient_id, familyHistory_id);
        return [familyHistoryPatientAddr, patientFamilyHistoryAddr];
    }

    getAddressByPatientId(patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        return pref + this.TP_CODE + patientAddr;
    }

    getAddressByFamilyHistoryId(familyHistory_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var familyHistoryAddr = this.hash(familyHistory_id).substring(0, 22);
        return pref + this.TP_CODE + familyHistoryAddr;
    }
}

module.exports.FamilyHistoryAddressHelper = FamilyHistoryAddressHelper;