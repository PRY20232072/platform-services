const { Constants } = require("../../common/Constants");
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
        const address = this.PractitionerAddressHelper.getAddressByTPName();

        var practitionerRegistryList = await this.PractitionerBlockchainHelper.getRegistryList(address);
        practitionerRegistryList = await this.PractitionerIPFSHelper.getIPFSDataOfRegistryList(practitionerRegistryList);

        return practitionerRegistryList;
    }

    async getPractitionerById(practitioner_id) {
        const address = this.PractitionerAddressHelper.getAddress(practitioner_id);

        var practitionerRegistry = await this.PractitionerBlockchainHelper.getRegistry(address);
        if (practitionerRegistry.error) {
            practitionerRegistry.data = "There is no practitioner with this identifier";
            return practitionerRegistry;
        }
        practitionerRegistry = await this.PractitionerIPFSHelper.getIPFSDataOfRegistry(practitionerRegistry.data);

        return practitionerRegistry;
    }

    async existPractitionerById(practitioner_id) {
        const practitioner = await this.getPractitionerById(practitioner_id);
        return !practitioner.error;
    }

    async createPractitioner(identifier, payload) {
        payload['practitioner_id'] = identifier;

        // Send to IPFS
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PractitionerAddressHelper.getAddress(identifier);
        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE];
        payload['action'] = Constants.ACTION_CREATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePractitioner(identifier, payload) {
        payload['practitioner_id'] = identifier;

        // Send to IPFS
        payload = await this.PractitionerIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PractitionerAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePractitioner(identifier) {
        var payload = {};
        payload['practitioner_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        const address = this.PractitionerAddressHelper.getAddress(identifier);
        var registry = await this.PractitionerBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        const ipfsResponse = await this.PractitionerIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.PractitionerBlockchainHelper.wrap_and_send(payload, [address]);
    }
}

module.exports = { PractitionerRepositoryImpl };
