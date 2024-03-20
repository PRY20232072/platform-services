const { Constants } = require('../common/Constants');
const { PractitionerHelper } = require('./helpers/PractitionerHelper');
const { PractitionerAddressHelper } = require('./helpers/PractitionerAddressHelper');
const { PractitionerBlockchainHelper } = require('./helpers/PractitionerBlockchainHelper');
const { PractitionerIPFSHelper } = require('./helpers/PractitionerIPFSHelper');
const { ResponseObject } = require('../common/ResponseObject');

class PractitionerClient {
    constructor() {
        this.PractitionerHelper = new PractitionerHelper();
        this.PractitionerAddressHelper = new PractitionerAddressHelper();
        this.PractitionerBlockchainHelper = new PractitionerBlockchainHelper();
        this.PractitionerIPFSHelper = new PractitionerIPFSHelper();
    }

    async getPractitionerList(current_user) {
        const address = this.PractitionerAddressHelper.getAddressByTPName();
        var practitionerRegistryList = await this.PractitionerBlockchainHelper.getRegistryList(address);
        practitionerRegistryList = await this.PractitionerIPFSHelper.getIPFSDataOfRegistryList(practitionerRegistryList);

        if (practitionerRegistryList.error) {
            return practitionerRegistryList;
        }

        return this.PractitionerHelper.transformPractitionerList(practitionerRegistryList);
    }

    async getPractitionerById(practitioner_id, current_user) {
        if (current_user.role === Constants.PRACTITIONER && current_user.id !== practitioner_id) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_GET_PRACTITIONER, true);
        }

        const address = this.PractitionerAddressHelper.getAddress(practitioner_id);
        var practitionerRegistry = await this.PractitionerBlockchainHelper.getRegistry(address);
        if (practitionerRegistry.error) {
            practitionerRegistry.data = "There is no practitioner with this identifier";
            return practitionerRegistry;
        }
        practitionerRegistry = await this.PractitionerIPFSHelper.getIPFSDataOfRegistry(practitionerRegistry.data);

        if (practitionerRegistry.error) {
            return practitionerRegistry;
        }

        if (current_user.role === Constants.PRACTITIONER) {
            return practitionerRegistry;
        } else { // Patient
            return this.PractitionerHelper.transformPractitioner(practitionerRegistry);
        }
    }

    async createPractitioner(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_PRACTITIONER, true);
        }

        if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_CREATE_A_REGISTRY, true);
        }

        payload['practitioner_id'] = identifier;

        // Send to IPFS
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PractitionerAddressHelper.getAddress(identifier);
        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE];
        payload['action'] = Constants.ACTION_CREATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePractitioner(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_A_PRACTITIONER, true);
        }

        if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_CREATE_A_REGISTRY, true);
        }

        payload['practitioner_id'] = identifier;

        // Send to IPFS
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PractitionerAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePractitioner(identifier, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_A_PRACTITIONER, true);
        }

        var payload = {};
        payload['practitioner_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        const address = this.PractitionerAddressHelper.getAddress(identifier);
        var registry = await this.PractitionerBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        const ipfsResponse = await this.PractitionerIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }
}

module.exports.PractitionerClient = PractitionerClient;