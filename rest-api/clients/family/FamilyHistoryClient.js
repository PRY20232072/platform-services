const { Constants } = require('../common/Constants');
const { FamilyHistoryAddressHelper } = require('./helpers/FamilyHistoryAddressHelper');
const { FamilyHistoryBlockchainHelper } = require('./helpers/FamilyHistoryBlockchainHelper');
const { FamilyHistoryIPFSHelper } = require('./helpers/FamilyHistoryIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");

class FamilyHistoryClient {
    constructor() {
        this.FamilyHistoryAddressHelper = new FamilyHistoryAddressHelper();
        this.FamilyHistoryBlockchainHelper = new FamilyHistoryBlockchainHelper();
        this.FamilyHistoryIPFSHelper = new FamilyHistoryIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
    }

    async getFamilyHistoryList() {
        var address = this.FamilyHistoryAddressHelper.getAddressByTPName();
        var data = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);

        //the registers are duplicated, using a filter to remove the duplicated registers by familyHistory_id
        data.data = data.data.filter((value, index, self) => self.findIndex(v => v.familyHistory_id === value.familyHistory_id) === index);

        data = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getFamilyHistoryById(familyHistory_id) {
        var address = this.FamilyHistoryAddressHelper.getAddressByFamilyHistoryId(familyHistory_id);
        var data = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        data = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getFamilyHistoryByPatientId(patient_id) {
        var address = this.FamilyHistoryAddressHelper.getAddressByPatientId(patient_id);
        var data = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        data = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getAlleryByIdAndPatientId(familyHistory_id, patient_id, practitioner_id) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, familyHistory_id, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        var address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
        var data = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no familyHistory with this identifier";
            return data;
        }
        data = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async createFamilyHistory(identifier, payload) {
        payload['familyHistory_id'] = identifier;

        // Send to IPFS
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(identifier, payload);

        // Send to blockchain
        var addresses = this.FamilyHistoryAddressHelper.getAddresses(identifier, payload.patient_id);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateFamilyHistory(identifier, practitioner_id, payload) {
        var patient_id = payload['patient_id'];
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, identifier, Constants.PERMISSION_WRITE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        // Sent to IPFS
        payload['familyHistory_id'] = identifier;
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(identifier, payload);

        // Send to blockchain
        var addresses = this.FamilyHistoryAddressHelper.getAddresses(identifier, patient_id);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteFamilyHistory(identifier, patient_id, practitioner_id) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, identifier, Constants.PERMISSION_DELETE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        var payload = {};
        payload['familyHistory_id'] = identifier;
        payload['patient_id'] = patient_id;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(identifier, patient_id);
        var registry = await this.FamilyHistoryBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        var ipfsResponse = await this.FamilyHistoryIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        var addresses = this.FamilyHistoryAddressHelper.getAddresses(identifier, patient_id);

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.FamilyHistoryClient = FamilyHistoryClient;