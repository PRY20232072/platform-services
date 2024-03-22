const { Constants } = require('../../common/Constants');
const { AllergyAddressHelper } = require('../helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('../helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('../helpers/AllergyIPFSHelper');
const { AllergyRepositoryInterface } = require("../interfaces/AllergyRepositoryInterface");

class AllergyRepositoryImpl extends AllergyRepositoryInterface {
    constructor() {
        super();
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
    }

    async getAllergyList() {
        const address = this.AllergyAddressHelper.getAddressByTPName();

        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
        //the registers are duplicated, using a filter to remove the duplicated registers by allergy_id
        registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.allergy_id === value.allergy_id) === index);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getAllergyById(allergy_id) {
        const address = this.AllergyAddressHelper.getAddressByAllergyId(allergy_id);

        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getAllergyListByPatientId(patient_id) {
        const address = this.AllergyAddressHelper.getAddressByPatientId(patient_id);

        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id) {
        const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);

        var registryList = await this.AllergyBlockchainHelper.getRegistry(address);
        if (registryList.error) {
            registryList.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return registryList;
        }
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(registryList);

        return registryList;
    }

    async existAllergyByIdAndPatientId(allergy_id, patient_id) {
        const result = await this.getAlleryByIdAndPatientId(allergy_id, patient_id);
        return !result.error;
    }

    async createAllergy(allergy_id, payload) {
        payload['allergy_id'] = allergy_id;
        payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);

        const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, payload.patient_id);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateAllergy(allergy_id, payload) {
        payload['allergy_id'] = allergy_id;
        payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);

        const patient_id = payload['patient_id'];
        const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, patient_id);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteAllergy(allergy_id, patient_id) {
        var payload = {};
        payload['allergy_id'] = allergy_id;
        payload['patient_id'] = patient_id;
        payload['action'] = Constants.ACTION_DELETE;

        const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var registry = await this.AllergyBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        const ipfsResponse = await this.AllergyIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse === undefined) {
            return response;
        }

        const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, patient_id);

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.AllergyRepositoryImpl = AllergyRepositoryImpl;
