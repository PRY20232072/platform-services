const { Constants } = require('../common/Constants');
const { AllergyAddressHelper } = require('./helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('./helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('./helpers/AllergyIPFSHelper');

class AllergyClient {
    constructor() {
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
    }

    async getAllergyList() {
        var address = this.AllergyAddressHelper.getAddressByTPName();
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        //only get the even position of the list, because the odd position is the address
        data.data = data.data.filter((_, i) => i % 2 == 0);

        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getAllergyById(allergy_id) {
        var address = this.AllergyAddressHelper.getAddressByAllergyId(allergy_id);
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getAllergyByPatientId(patient_id) {
        var address = this.AllergyAddressHelper.getAddressByPatientId(patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async createAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;

        var addresses = this.AllergyAddressHelper.getAddresses(identifier, payload['patient_id']);
        payload = await this.AllergyIPFSHelper.sentToIPFS(identifier, payload);

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;

        var addresses = this.AllergyAddressHelper.getAddresses(identifier, payload['patient_id']);
        payload = await this.AllergyIPFSHelper.sentToIPFS(identifier, payload);

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteAllergy(identifier, patient_id) {
        var payload = {};
        payload['allergy_id'] = identifier;
        payload['patient_id'] = patient_id;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.AllergyAddressHelper.getAllergyPatientAddress(identifier, patient_id);
        var registry = await this.AllergyBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        var ipfsResponse = await this.AllergyIPFSHelper.InfuraIPFSClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        var addresses = this.AllergyAddressHelper.getAddresses(identifier, patient_id);

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.AllergyClient = AllergyClient;