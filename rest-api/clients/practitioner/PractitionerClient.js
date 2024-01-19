const { Constants } = require('../common/Constants');
const { PractitionerAddressHelper } = require('./helpers/PractitionerAddressHelper');
const { PractitionerBlockchainHelper } = require('./helpers/PractitionerBlockchainHelper');
const { PractitionerIPFSHelper } = require('./helpers/PractitionerIPFSHelper');

class PractitionerClient {
    constructor() {
        this.PractitionerAddressHelper = new PractitionerAddressHelper();
        this.PractitionerBlockchainHelper = new PractitionerBlockchainHelper();
        this.PractitionerIPFSHelper = new PractitionerIPFSHelper();
    }

    async getPractitionerList() {
        var address = this.PractitionerAddressHelper.getAddressByTPName();
        var data = await this.PractitionerBlockchainHelper.getRegistryList(address);

        data = this.PractitionerIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getPractitionerById(practitioner_id) {
        var address = this.PractitionerAddressHelper.getAddress(practitioner_id);
        var data = await this.PractitionerBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no practitioner with this identifier";
            return data;
        }
        data = await this.PractitionerIPFSHelper.getIPFSDataOfRegistry(data.data);
        return data;
    }

    async createPractitioner(identifier, payload) {
        payload['practitioner_id'] = identifier;
        
        var address = this.PractitionerAddressHelper.getAddress(identifier);
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE];
        payload['action'] = Constants.ACTION_CREATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePractitioner(identifier, payload) {
        payload['practitioner_id'] = identifier;
        
        var address = this.PractitionerAddressHelper.getAddress(identifier);
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);
        
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePractitioner(identifier) {
        var payload = {};
        payload['practitioner_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.PractitionerAddressHelper.getAddress(identifier);
        var registry = await this.PractitionerBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        var ipfsResponse = await this.PractitionerIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }
}

module.exports.PractitionerClient = PractitionerClient;