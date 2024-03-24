const { Constants } = require('../../common/Constants');
const { CustomError } = require('../../common/errors/CustomError');
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
        try {
            const address = this.AllergyAddressHelper.getAddressByTPName();

            var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
            //the registers are duplicated, using a filter to remove the duplicated registers by allergy_id
            registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.allergy_id === value.allergy_id) === index);
            registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getAllergyById(allergy_id) {
        try {
            const address = this.AllergyAddressHelper.getAddressByAllergyId(allergy_id);

            var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
            registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async getAllergyListByPatientId(patient_id) {
        try {
            const address = this.AllergyAddressHelper.getAddressByPatientId(patient_id);

            var registryList = await this.AllergyBlockchainHelper.getRegistryList(address);
            registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistryList(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getAllergyByIdAndPatientId(allergy_id, patient_id) {
        try {
            const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);

            var registryList = await this.AllergyBlockchainHelper.getRegistry(address);
            registryList = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async existAllergyByIdAndPatientId(allergy_id, patient_id) {
        try {
            const result = await this.getAllergyByIdAndPatientId(allergy_id, patient_id);
            return !result.error;
        } catch (error) {
            throw error;
        }
    }

    async createAllergy(allergy_id, payload) {
        try {
            payload['allergy_id'] = allergy_id;
            payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);

            const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, payload.patient_id);
            payload['action'] = Constants.ACTION_CREATE;

            return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_REGISTRY,
                error.message,
            );
        }
    }

    async updateAllergy(allergy_id, payload) {
        try {
            payload['allergy_id'] = allergy_id;
            payload = await this.AllergyIPFSHelper.sentToIPFS(allergy_id, payload);

            const patient_id = payload['patient_id'];
            const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, patient_id);
            payload['action'] = Constants.ACTION_UPDATE;

            return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_REGISTRY,
                error.message,
            );
        }
    }

    async deleteAllergy(allergy_id, patient_id) {
        try {
            var payload = {};
            payload['allergy_id'] = allergy_id;
            payload['patient_id'] = patient_id;
            payload['action'] = Constants.ACTION_DELETE;

            const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
            var registry = await this.AllergyBlockchainHelper.getRegistry(address);

            registry = registry.data;

            await this.AllergyIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

            const addresses = this.AllergyAddressHelper.getAddresses(allergy_id, patient_id);

            return await this.AllergyBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_REGISTRY,
                error.message,
            );
        }
    }
}

module.exports.AllergyRepositoryImpl = AllergyRepositoryImpl;
