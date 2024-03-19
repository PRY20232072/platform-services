const { Constants } = require('../common/Constants');
const { FamilyHistoryHelper } = require('./helpers/FamilyHistoryHelper');
const { FamilyHistoryAddressHelper } = require('./helpers/FamilyHistoryAddressHelper');
const { FamilyHistoryBlockchainHelper } = require('./helpers/FamilyHistoryBlockchainHelper');
const { FamilyHistoryIPFSHelper } = require('./helpers/FamilyHistoryIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { ResponseObject } = require('../common/ResponseObject');

class FamilyHistoryClient {
    constructor() {
        this.FamilyHistoryHelper = new FamilyHistoryHelper();
        this.FamilyHistoryAddressHelper = new FamilyHistoryAddressHelper();
        this.FamilyHistoryBlockchainHelper = new FamilyHistoryBlockchainHelper();
        this.FamilyHistoryIPFSHelper = new FamilyHistoryIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
    }

    async getFamilyHistoryList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_FAMILY_HISTORY_LIST, true);
        }

        const address = this.FamilyHistoryAddressHelper.getAddressByTPName();
        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);

        //the registers are duplicated, using a filter to remove the duplicated registers by familyHistory_id
        registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.familyHistory_id === value.familyHistory_id) === index);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        if (registryList.error) {
            return registryList;
        }

        return this.FamilyHistoryHelper.transformRegistryList(registryList);
    }

    async getFamilyHistoryById(familyHistory_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);

        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const address = this.FamilyHistoryAddressHelper.getAddressByFamilyHistoryId(familyHistory_id);
        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getFamilyHistoryByPatientId(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_FAMILY_HISTORY_LIST, true);
        }

        const address = this.FamilyHistoryAddressHelper.getAddressByPatientId(patient_id);
        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return this.FamilyHistoryHelper.transformRegistryList(registryList);
    }

    async getAlleryByIdAndPatientId(familyHistory_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
        if (registryList.error) {
            registryList.data = "There is no familyHistory with this identifier";
            return registryList;
        }
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(registryList);

        return registryList;
    }

    async createFamilyHistory(familyHistory_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        payload['familyHistory_id'] = familyHistory_id;

        // Send to IPFS
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);

        // Send to blockchain
        const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, payload.patient_id);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateFamilyHistory(familyHistory_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_WRITE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }
        
        // Sent to IPFS
        payload['familyHistory_id'] = familyHistory_id;
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);
        
        // Send to blockchain
        const patient_id = payload['patient_id'];
        const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, patient_id);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteFamilyHistory(familyHistory_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_DELETE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        var payload = {};
        payload['familyHistory_id'] = familyHistory_id;
        payload['patient_id'] = patient_id;
        payload['action'] = Constants.ACTION_DELETE;

        const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
        var registry = await this.FamilyHistoryBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        const ipfsResponse = await this.FamilyHistoryIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse === undefined) {
            return response;
        }

        const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, patient_id);

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.FamilyHistoryClient = FamilyHistoryClient;