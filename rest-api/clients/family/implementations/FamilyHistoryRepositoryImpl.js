const { Constants } = require("../../common/Constants");
const { FamilyHistoryAddressHelper } = require('../helpers/FamilyHistoryAddressHelper');
const { FamilyHistoryBlockchainHelper } = require('../helpers/FamilyHistoryBlockchainHelper');
const { FamilyHistoryIPFSHelper } = require('../helpers/FamilyHistoryIPFSHelper');
const { FamilyHistoryRepositoryInterface } = require('../interfaces/FamilyHistoryRepositoryInterface');

class FamilyHistoryRepositoryImpl extends FamilyHistoryRepositoryInterface {
    constructor() {
        super();
        this.FamilyHistoryAddressHelper = new FamilyHistoryAddressHelper();
        this.FamilyHistoryBlockchainHelper = new FamilyHistoryBlockchainHelper();
        this.FamilyHistoryIPFSHelper = new FamilyHistoryIPFSHelper();
    }

    async getFamilyHistoryList() {
        const address = this.FamilyHistoryAddressHelper.getAddressByTPName();

        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        //the registers are duplicated, using a filter to remove the duplicated registers by familyHistory_id
        registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.familyHistory_id === value.familyHistory_id) === index);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getFamilyHistoryById(familyHistory_id) {
        const address = this.FamilyHistoryAddressHelper.getAddressByFamilyHistoryId(familyHistory_id);

        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getFamilyHistoryListByPatientId(patient_id) {
        const address = this.FamilyHistoryAddressHelper.getAddressByPatientId(patient_id);

        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id) {
        const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);

        var registryList = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
        if (registryList.error) {
            registryList.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return registryList;
        }
        registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(registryList);

        return registryList;
    }

    async existFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id) {
        const result = await this.getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id);
        return !result.error;
    }

    async createFamilyHistory(familyHistory_id, payload) {
        payload['familyHistory_id'] = familyHistory_id;
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);

        const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, payload.patient_id);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateFamilyHistory(familyHistory_id, payload) {
        payload['familyHistory_id'] = familyHistory_id;
        payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);

        const patient_id = payload['patient_id'];
        const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, patient_id);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteFamilyHistory(familyHistory_id, patient_id) {
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

module.exports.FamilyHistoryRepositoryImpl = FamilyHistoryRepositoryImpl;
