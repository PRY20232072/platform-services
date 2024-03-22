const { Constants } = require("../../common/Constants");
const { PatientAddressHelper } = require("../helpers/PatientAddressHelper");
const { PatientBlockchainHelper } = require("../helpers/PatientBlockchainHelper");
const { PatientIPFSHelper } = require("../helpers/PatientIPFSHelper");
const { PatientRepositoryInterface } = require("../interfaces/PatientRepositoryInterface");

class PatientRepositoryImpl extends PatientRepositoryInterface {
    constructor() {
        super();
        this.PatientAddressHelper = new PatientAddressHelper();
        this.PatientBlockchainHelper = new PatientBlockchainHelper();
        this.PatientIPFSHelper = new PatientIPFSHelper();
    }

    async getPatientList() {
        const address = this.PatientAddressHelper.getAddressByTPName();

        var patientRegistryList = await this.PatientBlockchainHelper.getRegistryList(address);
        patientRegistryList = await this.PatientIPFSHelper.getIPFSDataOfRegistryList(patientRegistryList);

        return patientRegistryList;
    }

    async getPatientById(patient_id) {
        const address = this.PatientAddressHelper.getAddress(patient_id);

        var patientRegistry = await this.PatientBlockchainHelper.getRegistry(address);
        if (patientRegistry.error) {
            patientRegistry.data = "There is no patient with this identifier";
            return patientRegistry;
        }
        patientRegistry = await this.PatientIPFSHelper.getIPFSDataOfRegistry(patientRegistry.data);

        return patientRegistry;
    }

    async existPatientById(patient_id) {
        const patient = await this.getPatientById(patient_id);
        return !patient.error;
    }

    async createPatient(identifier, payload) {
        payload['patient_id'] = identifier;

        // Send to IPFS
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PatientAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_CREATE;
        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE, Constants.PERMISSION_DELETE];

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePatient(identifier, payload) {
        payload['patient_id'] = identifier;

        // Send to IPFS
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);

        // Send to Blockchain
        const address = this.PatientAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePatient(identifier) {
        var payload = {};
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        const address = this.PatientAddressHelper.getAddress(identifier);
        var registry = await this.PatientBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        const ipfsResponse = await this.PatientIPFSHelper.ipfsClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }
}

module.exports = { PatientRepositoryImpl };
