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

        var addresses = this.ConsentAddressHelper.getAddresses(payload['patient_id'], payload['practitioner_id']);

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async revokeConsent(patient_id, practitioner_id) {
        var payload = {};
        payload['patient_id'] = patient_id;
        payload['practitioner_id'] = practitioner_id;
        payload['action'] = Constants.ACTION_REVOKE;

        var addresses = this.ConsentAddressHelper.getAddresses(patient_id, practitioner_id);

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.ConsentClient = ConsentClient;