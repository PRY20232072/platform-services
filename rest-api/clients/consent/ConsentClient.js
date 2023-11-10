const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

class ConsentClient extends CommonClient {
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

    async wrap_and_send(payload, addresses) {
        var enc = new TextEncoder('utf8');

        //TODO: encrypt payload

        //send object to blockchain like a string
        payload = JSON.stringify(payload);
        var payloadBytes = enc.encode(payload);

        var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, addresses);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        var response = await this.saveDataInBlockchain('/batches', txnBytes);
        
        //TODO: validate if response has info

        return response;
    }

    async createConsent(payload) {
        payload['action'] = Constants.ACTION_CREATE;
        var patientPractitionerAddr = this.getPatientPractitionerAddress(payload.patient_id, payload.practitioner_id);
        var practitionerPatientAddr = this.getPractitionerPatientAddress(payload.practitioner_id, payload.patient_id);
        var addresses = [patientPractitionerAddr, practitionerPatientAddr];
        return await this.wrap_and_send(payload, addresses);
    }

    async revokeConsent(patient_id, practitioner_id) {
        var patientPractitionerAddr = this.getPatientPractitionerAddress(patient_id, practitioner_id);
        var practitionerPatientAddr = this.getPractitionerPatientAddress(practitioner_id, patient_id);
        var addresses = [patientPractitionerAddr, practitionerPatientAddr];

        var payload = {};
        payload['patient_id'] = patient_id;
        payload['practitioner_id'] = practitioner_id;
        payload['action'] = Constants.ACTION_REVOKE;
        return await this.wrap_and_send(payload, addresses);
    }
}

module.exports.ConsentClient = ConsentClient;