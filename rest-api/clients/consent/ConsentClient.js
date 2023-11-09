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

    getPatientProfessionalAddress(patient_id, professional_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 22);
        var professionalAddr = this.hash(professional_id).substring(0, 40);
        return pref + this.TP_CODE + patientAddr + professionalAddr;
    }

    getProfessionalPatientAddress(professional_id, patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var professionalAddr = this.hash(professional_id).substring(0, 22);
        var patientAddr = this.hash(patient_id).substring(0, 40);
        return pref + this.TP_CODE + professionalAddr + patientAddr;
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
        var patientProfessionalAddr = this.getPatientProfessionalAddress(payload.patient_id, payload.professional_id);
        var professionalPatientAddr = this.getProfessionalPatientAddress(payload.professional_id, payload.patient_id);
        var addresses = [patientProfessionalAddr, professionalPatientAddr];
        return await this.wrap_and_send(payload, addresses);
    }

    async revokeConsent(patient_id, professional_id) {
        var patientProfessionalAddr = this.getPatientProfessionalAddress(patient_id, professional_id);
        var professionalPatientAddr = this.getProfessionalPatientAddress(professional_id, patient_id);
        var addresses = [patientProfessionalAddr, professionalPatientAddr];

        var payload = {};
        payload['patient_id'] = patient_id;
        payload['professional_id'] = professional_id;
        payload['action'] = Constants.ACTION_REVOKE;
        return await this.wrap_and_send(payload, addresses);
    }
}

module.exports.ConsentClient = ConsentClient;