const { Constants } = require("../../common/Constants");
const { CustomError } = require("../../common/errors/CustomError");
const { PractitionerAddressHelper } = require("../helpers/PractitionerAddressHelper");
const { PractitionerBlockchainHelper } = require("../helpers/PractitionerBlockchainHelper");
const { PractitionerIPFSHelper } = require("../helpers/PractitionerIPFSHelper");
const { PractitionerRepositoryInterface } = require("../interfaces/PractitionerRepositoryInterface");

class PractitionerRepositoryImpl extends PractitionerRepositoryInterface {
    constructor() {
        super();
        this.PractitionerAddressHelper = new PractitionerAddressHelper();
        this.PractitionerBlockchainHelper = new PractitionerBlockchainHelper();
        this.PractitionerIPFSHelper = new PractitionerIPFSHelper();
    }

    async getPractitionerList() {
        try {
            const address = this.PractitionerAddressHelper.getAddressByTPName();

            var practitionerRegistryList = await this.PractitionerBlockchainHelper.getRegistryList(address);
            practitionerRegistryList = await this.PractitionerIPFSHelper.getIPFSDataOfRegistryList(practitionerRegistryList);

            return practitionerRegistryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getPractitionerById(practitioner_id) {
        try {
            const address = this.PractitionerAddressHelper.getAddress(practitioner_id);

            var practitionerRegistry = await this.PractitionerBlockchainHelper.getRegistry(address);
            practitionerRegistry = await this.PractitionerIPFSHelper.getIPFSDataOfRegistry(practitionerRegistry.data);

            return practitionerRegistry;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async existPractitionerById(practitioner_id) {
        try {
            const practitioner = await this.getPractitionerById(practitioner_id);
            return !practitioner.error;
        } catch (error) {
            throw error;
        }
    }

    async createPractitioner(identifier, payload) {
        try {
            payload['practitioner_id'] = identifier;

            // Send to IPFS
            payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

            // Send to Blockchain
            const address = this.PractitionerAddressHelper.getAddress(identifier);
            payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE];
            payload['action'] = Constants.ACTION_CREATE;

            return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_REGISTRY,
                error.message,
            );
        }
    }

    async updatePractitioner(identifier, payload) {
        try {
            payload['practitioner_id'] = identifier;

            // Send to IPFS
            payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

            // Send to Blockchain
            const address = this.PractitionerAddressHelper.getAddress(identifier);
            payload['action'] = Constants.ACTION_UPDATE;

            return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_REGISTRY,
                error.message,
            );
        }
    }

    async deletePractitioner(identifier) {
        try {
            var payload = {};
            payload['practitioner_id'] = identifier;
            payload['action'] = Constants.ACTION_DELETE;

            const address = this.PractitionerAddressHelper.getAddress(identifier);
            var registry = await this.PractitionerBlockchainHelper.getRegistry(address);

            if (registry.error) {
                return registry;
            }

            registry = registry.data;
            await this.PractitionerIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

            return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_REGISTRY,
                error.message,
            );
        }
    }
}

module.exports = { PractitionerRepositoryImpl };
