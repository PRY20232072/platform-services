const { Constants } = require("../../common/Constants");
const { CustomError } = require("../../common/errors/CustomError");
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
        try {
            const address = this.FamilyHistoryAddressHelper.getAddressByTPName();
    
            var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
            //the registers are duplicated, using a filter to remove the duplicated registers by familyHistory_id
            registryList.data = registryList.data.filter((value, index, self) => self.findIndex(v => v.familyHistory_id === value.familyHistory_id) === index);
            registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);
    
            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getFamilyHistoryById(familyHistory_id) {
        try {
            const address = this.FamilyHistoryAddressHelper.getAddressByFamilyHistoryId(familyHistory_id);
    
            var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
            registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);
    
            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async getFamilyHistoryListByPatientId(patient_id) {
        try {
            const address = this.FamilyHistoryAddressHelper.getAddressByPatientId(patient_id);
    
            var registryList = await this.FamilyHistoryBlockchainHelper.getRegistryList(address);
            registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistryList(registryList);
    
            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id) {
        try {
            const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
    
            var registryList = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
            if (registryList.error) {
                registryList.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
                return registryList;
            }
            registryList = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(registryList);
    
            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async existFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id) {
        try {
            const result = await this.getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id);
            return !result.error;
        } catch (error) {
            throw error;
        }
    }

    async createFamilyHistory(familyHistory_id, payload) {
        try {
            payload['familyHistory_id'] = familyHistory_id;
            payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);
    
            const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, payload.patient_id);
            payload['action'] = Constants.ACTION_CREATE;
    
            return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_REGISTRY,
                error.message,
            );
        }
    }

    async updateFamilyHistory(familyHistory_id, payload) {
        try {
            payload['familyHistory_id'] = familyHistory_id;
            payload = await this.FamilyHistoryIPFSHelper.sentToIPFS(familyHistory_id, payload);
    
            const patient_id = payload['patient_id'];
            const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, patient_id);
            payload['action'] = Constants.ACTION_UPDATE;
    
            return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_REGISTRY,
                error.message,
            );
        }
    }

    async deleteFamilyHistory(familyHistory_id, patient_id) {
        try {
            var payload = {};
            payload['familyHistory_id'] = familyHistory_id;
            payload['patient_id'] = patient_id;
            payload['action'] = Constants.ACTION_DELETE;
    
            const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(familyHistory_id, patient_id);
            var registry = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
    
            registry = registry.data;
            await this.FamilyHistoryIPFSHelper.ipfsClient.rm(registry.ipfs_hash);
    
            const addresses = this.FamilyHistoryAddressHelper.getAddresses(familyHistory_id, patient_id);
    
            return await this.FamilyHistoryBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_REGISTRY,
                error.message,
            );
        }
    }
}

module.exports.FamilyHistoryRepositoryImpl = FamilyHistoryRepositoryImpl;
