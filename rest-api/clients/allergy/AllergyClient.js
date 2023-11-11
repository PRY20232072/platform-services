const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');
const { AllergyAddressHelper } = require('./helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('./helpers/AllergyBlockchainHelper');
const { CommonIPFSHelper } = require('../common/helpers/CommonIPFSHelper');

class AllergyClient extends CommonClient {
    constructor() {
        super();
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.CommonIPFSHelper = new CommonIPFSHelper();
    }

    async getAllergyList() {
        var address = this.AllergyAddressHelper.getAddressByTPName();
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        //only get the even position of the list, because the odd position is the address
        data.data = data.data.filter((_, i) => i % 2 == 0);

        data = this.CommonIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getAllergyById(allergy_id) {
        var address = this.AllergyAddressHelper.getAddressByAllergyId(allergy_id);
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        data = this.CommonIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getAllergyByPatientId(patient_id) {
        var address = this.AllergyAddressHelper.getAddressByPatientId(patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistryList(address);
        data = this.CommonIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async createAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;

        var allergyPatientAddr = this.AllergyAddressHelper.getAllergyPatientAddress(identifier, payload['patient_id']);
        var patientAllergyAddr = this.AllergyAddressHelper.getPatientAllergyAddress(payload['patient_id'], identifier);

        return await this.AllergyBlockchainHelper.wrap_and_send(identifier, payload, [allergyPatientAddr, patientAllergyAddr]);
    }

    async updateAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;

        var allergyPatientAddr = this.AllergyAddressHelper.getAllergyPatientAddress(identifier, payload['patient_id']);
        var patientAllergyAddr = this.AllergyAddressHelper.getPatientAllergyAddress(payload['patient_id'], identifier);

        return await this.AllergyBlockchainHelper.wrap_and_send(identifier, payload, [allergyPatientAddr, patientAllergyAddr]);
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
        var ipfsResponse = await this.infuraIPFSClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.AllergyBlockchainHelper.wrap_and_send(identifier, payload, address);
    }
}

module.exports.AllergyClient = AllergyClient;