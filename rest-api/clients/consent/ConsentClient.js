const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');
const { ConsentAddressHelper } = require('./helpers/ConsentAddressHelper');
const { ConsentBlockchainHelper } = require('./helpers/ConsentBlockchainHelper');

class ConsentClient extends CommonClient {
    constructor() {
        super();
        this.ConsentAddressHelper = new ConsentAddressHelper();
        this.ConsentBlockchainHelper = new ConsentBlockchainHelper();
    }

    async getByIdentifier(identifier) {
        var address = this.ConsentAddressHelper.getAddress(identifier);
        var data = await this.ConsentBlockchainHelper.getRegistryList(address);
        return data;
    }

    async createConsent(payload) {
        payload['action'] = Constants.ACTION_CREATE;

        var patientPractitionerAddr = this.ConsentAddressHelper.getPatientPractitionerAddress(payload.patient_id, payload.practitioner_id);
        var practitionerPatientAddr = this.ConsentAddressHelper.getPractitionerPatientAddress(payload.practitioner_id, payload.patient_id);
        var addresses = [patientPractitionerAddr, practitionerPatientAddr];

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async revokeConsent(patient_id, practitioner_id) {
        var payload = {};
        payload['patient_id'] = patient_id;
        payload['practitioner_id'] = practitioner_id;
        payload['action'] = Constants.ACTION_REVOKE;

        var patientPractitionerAddr = this.ConsentAddressHelper.getPatientPractitionerAddress(patient_id, practitioner_id);
        var practitionerPatientAddr = this.ConsentAddressHelper.getPractitionerPatientAddress(practitioner_id, patient_id);
        var addresses = [patientPractitionerAddr, practitionerPatientAddr];

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.ConsentClient = ConsentClient;