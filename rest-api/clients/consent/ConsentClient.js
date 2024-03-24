const { Constants } = require('../common/Constants');
const { CustomError } = require('../common/errors/CustomError');
const { ConsentAddressHelper } = require('./helpers/ConsentAddressHelper');
const { ConsentBlockchainHelper } = require('./helpers/ConsentBlockchainHelper');

class ConsentClient {
    constructor() {
        this.ConsentAddressHelper = new ConsentAddressHelper();
        this.ConsentBlockchainHelper = new ConsentBlockchainHelper();
    }

    async getConsentByRegisterId(register_id) {
        try {
            var address = this.ConsentAddressHelper.getAddress(register_id);
            var data = await this.ConsentBlockchainHelper.getRegistryList(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async getConsentByPractitionerId(practitioner_id) {
        try {
            var address = this.ConsentAddressHelper.getAddress(practitioner_id);
            var data = await this.ConsentBlockchainHelper.getRegistryList(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async getConsentByRegisterIdAndPractitionerId(register_id, practitioner_id) {
        try {
            var address = this.ConsentAddressHelper.getRegisterPractitionerAddress(register_id, practitioner_id);
            var data = await this.ConsentBlockchainHelper.getRegistry(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async createConsent(payload) {
        try {
            var addresses = this.ConsentAddressHelper.getAddresses(payload['register_id'], payload['practitioner_id']);
            payload['action'] = Constants.ACTION_CREATE;
    
            return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_CONSENT,
                error.message,
            );
        }
    }

    async approveConsent(register_id, practitioner_id) {
        try {
            var payload = {};
            payload['register_id'] = register_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_APPROVE;
    
            var addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);
    
            return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_APPROVING_CONSENT,
                error.message,
            );
        }
    }

    async revokeConsent(register_id, practitioner_id) {
        try {
            var payload = {};
            payload['register_id'] = register_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_REVOKE;
    
            var addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);
    
            return await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_REVOKING_CONSENT,
                error.message,
            );
        }
    }
}

module.exports.ConsentClient = ConsentClient;