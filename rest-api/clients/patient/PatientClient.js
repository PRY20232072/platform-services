const { Constants } = require('../common/Constants');
const { PatientAddressHelper } = require('./helpers/PatientAddressHelper');
const { PatientBlockchainHelper } = require('./helpers/PatientBlockchainHelper');
const { PatientIPFSHelper } = require('./helpers/PatientIPFSHelper');

class PatientClient {
    constructor() {
        this.PatientAddressHelper = new PatientAddressHelper();
        this.PatientBlockchainHelper = new PatientBlockchainHelper();
        this.PatientIPFSHelper = new PatientIPFSHelper();
    }

    async getPatientList() {
        var address = this.PatientAddressHelper.getAddressByTPName();
        var data = await this.PatientBlockchainHelper.getRegistryList(address);

        data = this.PatientIPFSHelper.getIPFSDataOfRegistryList(data);
        return data;
    }

    async getPatientById(patient_id) {
        var address = this.PatientAddressHelper.getAddress(patient_id);
        var data = await this.PatientBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no patient with this identifier";
            return data;
        }
        data = await this.PatientIPFSHelper.getIPFSDataOfRegistry(data.data);
        return data;
    }

    async createPatient(identifier, payload) {
        payload['patient_id'] = identifier;
        
        var address = this.PatientAddressHelper.getAddress(identifier);
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);
        
        payload['action'] = Constants.ACTION_CREATE;
        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE, Constants.PERMISSION_DELETE];

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePatient(identifier, payload) {
        payload['patient_id'] = identifier;
        
        var address = this.PatientAddressHelper.getAddress(identifier);
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);

        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePatient(identifier) {
        var payload = {};
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.PatientAddressHelper.getAddress(identifier);
        var registry = await this.PatientBlockchainHelper.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        var ipfsResponse = await this.PatientIPFSHelper.InfuraIPFSClient.rm(registry.ipfs_hash);

        if (ipfsResponse == undefined) {
            return response;
        }

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }
}

module.exports.PatientClient = PatientClient;