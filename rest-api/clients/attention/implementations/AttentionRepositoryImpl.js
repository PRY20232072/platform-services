const { Constants } = require('../../common/Constants');
const { CustomError } = require('../../common/errors/CustomError');
const { AttentionAddressHelper } = require('../helpers/AttentionAddressHelper');
const { AttentionBlockchainHelper } = require('../helpers/AttentionBlockchainHelper');
const { AttentionIPFSHelper } = require('../helpers/AttentionIPFSHelper');
const { AttentionRepositoryInterface } = require("../interfaces/AttentionRepositoryInterface");

class AttentionRepositoryImpl extends AttentionRepositoryInterface {
    constructor() {
        super();
        this.AttentionAddressHelper = new AttentionAddressHelper();
        this.AttentionBlockchainHelper = new AttentionBlockchainHelper();
        this.AttentionIPFSHelper = new AttentionIPFSHelper();
    }

    async getAttentionById(attention_id) {
        try {
            const address = this.AttentionAddressHelper.getAddressByAttentionId(attention_id);

            var registryList = await this.AttentionBlockchainHelper.getRegistryList(address);
            registryList = await this.AttentionIPFSHelper.getIPFSDataOfRegistryList(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async getAttentionListByPatientId(patient_id) {
        try {
            const address = this.AttentionAddressHelper.getAddressByPatientId(patient_id);

            var registryList = await this.AttentionBlockchainHelper.getRegistryList(address);
            registryList = await this.AttentionIPFSHelper.getIPFSDataOfRegistryList(registryList);

            return registryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async createAttention(attention_id, payload) {
        try {
            payload['attention_id'] = attention_id;
            payload = await this.AttentionIPFSHelper.sentToIPFS(attention_id, payload);

            const addresses = this.AttentionAddressHelper.getAddresses(attention_id, payload.patient_id);
            payload['action'] = Constants.ACTION_CREATE;

            return await this.AttentionBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_REGISTRY,
                error.message,
            );
        }
    }

    async updateAttention(attention_id, payload) {
        try {
            payload['attention_id'] = attention_id;
            payload = await this.AttentionIPFSHelper.sentToIPFS(attention_id, payload);

            const patient_id = payload['patient_id'];
            const addresses = this.AttentionAddressHelper.getAddresses(attention_id, patient_id);
            payload['action'] = Constants.ACTION_UPDATE;

            return await this.AttentionBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_REGISTRY,
                error.message,
            );
        }
    }

    async deleteAttention(attention_id, patient_id) {
        try {
            var payload = {};
            payload['attention_id'] = attention_id;
            payload['patient_id'] = patient_id;
            payload['action'] = Constants.ACTION_DELETE;

            const address = this.AttentionAddressHelper.getAttentionPatientAddress(attention_id, patient_id);
            var registry = await this.AttentionBlockchainHelper.getRegistry(address);

            registry = registry.data;

            await this.AttentionIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

            const addresses = this.AttentionAddressHelper.getAddresses(attention_id, patient_id);

            return await this.AttentionBlockchainHelper.wrap_and_send(payload, addresses);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_REGISTRY,
                error.message,
            );
        }
    }
}

module.exports.AttentionRepositoryImpl = AttentionRepositoryImpl;