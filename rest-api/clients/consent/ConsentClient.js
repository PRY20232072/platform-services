const { Constants } = require('../common/Constants');
const { ConsentAddressHelper } = require('./helpers/ConsentAddressHelper');
const { ConsentBlockchainHelper } = require('./helpers/ConsentBlockchainHelper');

class ConsentClient {
    constructor() {
        this.ConsentAddressHelper = new ConsentAddressHelper();
        this.ConsentBlockchainHelper = new ConsentBlockchainHelper();
    }

    async getConsentByRegisterId(register_id) {
        var address = this.ConsentAddressHelper.getAddress(register_id);
        var data = await this.ConsentBlockchainHelper.getRegistryList(address);
        return data;
    }

    async getConsentByPractitionerId(practitioner_id) {
        var address = this.ConsentAddressHelper.getAddress(practitioner_id);
        var data = await this.ConsentBlockchainHelper.getRegistryList(address);
        return data;
    }

    async getConsentByRegisterIdAndPractitionerId(register_id, practitioner_id) {
        var address = this.ConsentAddressHelper.getRegisterPractitionerAddress(register_id, practitioner_id);
        var data = await this.ConsentBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no consent with this identifier";
            return data;
        }
        return data;
    }

    async createConsent(payload) {
        var addresses = this.ConsentAddressHelper.getAddresses(payload['register_id'], payload['practitioner_id']);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async approveConsent(register_id, practitioner_id) {
        var payload = {};
        payload['register_id'] = register_id;
        payload['practitioner_id'] = practitioner_id;
        payload['action'] = Constants.ACTION_APPROVE;

        var addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async revokeConsent(register_id, practitioner_id) {
        var payload = {};
        payload['register_id'] = register_id;
        payload['practitioner_id'] = practitioner_id;
        payload['action'] = Constants.ACTION_REVOKE;

        var addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);

        return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.ConsentClient = ConsentClient;