const { Constants } = require('../common/Constants');
const { AllergyAddressHelper } = require('./helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('./helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('./helpers/AllergyIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");

class AllergyClient {
    constructor() {
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
    }

    async getAllergyList() {
        var address = this.AllergyAddressHelper.getAddressByTPName();
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);

        //the registers are duplicated, using a filter to remove the duplicated registers by allergy_id
        data.data = data.data.filter((value, index, self) => self.findIndex(v => v.allergy_id === value.allergy_id) === index);

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

    async getAlleryByIdAndPatientId(allergy_id, patient_id, practitioner_id) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, allergy_id, Constants.PERMISSION_READ);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        var address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no allergy with this identifier";
            return data;
        }
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async createAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        
        var addresses = this.AllergyAddressHelper.getAddresses(identifier, payload['patient_id']);
        payload = await this.AllergyIPFSHelper.sentToIPFS(identifier, payload);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateAllergy(identifier, practitioner_id, payload) {
        var patient_id = payload['patient_id'];
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, identifier, Constants.PERMISSION_WRITE);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        payload['allergy_id'] = identifier;
        var addresses = this.AllergyAddressHelper.getAddresses(identifier, patient_id);
        payload = await this.AllergyIPFSHelper.sentToIPFS(identifier, payload);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteAllergy(identifier, patient_id, practitioner_id) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(patient_id, practitioner_id, identifier, Constants.PERMISSION_DELETE);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

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
        var ipfsResponse = await this.AllergyIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        var addresses = this.AllergyAddressHelper.getAddresses(identifier, patient_id);

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }
}

module.exports.AllergyClient = AllergyClient;