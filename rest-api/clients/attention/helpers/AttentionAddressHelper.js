const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class AttentionAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.ATTENTION_REGISTRY_TP_NAME,
            Constants.ATTENTION_REGISTRY_TP_CODE,
            Constants.ATTENTION_REGISTRY_TP_VERSION
        );
    }

    getAttentionPatientAddress(attention_id, patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var attentionAddr = this.hash(attention_id).substring(0, 22);
        var patientAddr = this.hash(patient_id).substring(0, 40);
        return pref + this.TP_CODE + attentionAddr + patientAddr;
    }

    getPatientAttentionAddress(patient_id, attention_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        var attentionAddr = this.hash(attention_id).substring(0, 40);
        return pref + this.TP_CODE + patientAddr + attentionAddr;
    }

    getAddresses(attention_id, patient_id) {
        var attentionPatientAddr = this.getAttentionPatientAddress(attention_id, patient_id);
        var patientAttentionAddr = this.getPatientAttentionAddress(patient_id, attention_id);
        return [attentionPatientAddr, patientAttentionAddr];
    }

    getAddressByPatientId(patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        return pref + this.TP_CODE + patientAddr;
    }

    getAddressByAttentionId(attention_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var attentionAddr = this.hash(attention_id).substring(0, 22);
        return pref + this.TP_CODE + attentionAddr;
    }
}

module.exports.AttentionAddressHelper = AttentionAddressHelper;