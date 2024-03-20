const { Constants } = require('../common/Constants');
const { AllergyHelper } = require('./helpers/AllergyHelper');
const { AllergyAddressHelper } = require('./helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('./helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('./helpers/AllergyIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { ResponseObject } = require('../common/ResponseObject');

class AllergyClient {
    constructor() {
        this.AllergyHelper = new AllergyHelper();
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
    }

    async getAllergyList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_ALLERGY_LIST, true);
        }

        const address = this.AllergyAddressHelper.getAddressByTPName();
        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);

        //the registers are duplicated, using a filter to remove the duplicated registers by allergy_id
        registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.allergy_id === value.allergy_id) === index);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        if (registryList.error || registryList.data == undefined) {
            return registryList;
        }

        return this.AllergyHelper.transformRegistryList(registryList);
    }

    async getAllergyById(allergy_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);

        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const address = this.AllergyAddressHelper.getAddressByAllergyId(allergy_id);
        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        return registryList;
    }

    async getAllergyListByPatientId(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_ALLERGY_LIST, true);
        }

        const address = this.AllergyAddressHelper.getAddressByPatientId(patient_id);
        var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

        if (registryList.error || registryList.data == undefined) {
            return registryList;
        }

        return this.AllergyHelper.transformRegistryList(registryList);
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var registryList = await this.AllergyBlockchainHelper.getRegistry(address);
        if (registryList.error) {
            registryList.data = "There is no allergy with this identifier";
            return registryList;
        }
        registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(registryList);

        return registryList;
    }

    async createAllergy(allergy_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        payload['allergy_id'] = allergy_id;

        // Send to IPFS
        payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);

        // Send to blockchain
        const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, payload.patient_id);
        payload['action'] = Constants.ACTION_CREATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async updateAllergy(allergy_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_WRITE, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }
        
        // Sent to IPFS
        payload['allergy_id'] = allergy_id;
        payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);
        
        // Send to blockchain
        const patient_id = payload['patient_id'];
        const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, patient_id);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
    }

    async deleteAllergy(allergy_id, patient_id, current_user) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_DELETE, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

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

module.exports.AllergyClient = AllergyClient;