const { Constants } = require('../common/Constants');
const { PatientHelper } = require('./helpers/PatientHelper');
const { PatientAddressHelper } = require('./helpers/PatientAddressHelper');
const { PatientBlockchainHelper } = require('./helpers/PatientBlockchainHelper');
const { PatientIPFSHelper } = require('./helpers/PatientIPFSHelper');
const { ResponseObject } = require('../common/ResponseObject');

class PatientClient {
    constructor() {
        this.PatientHelper = new PatientHelper();
        this.PatientAddressHelper = new PatientAddressHelper();
        this.PatientBlockchainHelper = new PatientBlockchainHelper();
        this.PatientIPFSHelper = new PatientIPFSHelper();
    }

    async getPatientList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_PATIENT_LIST, true);
        }

        const address = this.PatientAddressHelper.getAddressByTPName();
        var patientRegistryList = await this.PatientBlockchainHelper.getRegistryList(address);
        patientRegistryList = await this.PatientIPFSHelper.getIPFSDataOfRegistryList(patientRegistryList);

        if (patientRegistryList.error || patientRegistryList.data == undefined) {
            return patientRegistryList;
        }

        return this.PatientHelper.transformPatientList(patientRegistryList);
    }

    async getPatientById(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_PATIENT, true);
        }

        const address = this.PatientAddressHelper.getAddress(patient_id);
        var patientRegistry = await this.PatientBlockchainHelper.getRegistry(address);
        if (patientRegistry.error) {
            patientRegistry.data = "There is no patient with this identifier";
            return patientRegistry;
        }
        patientRegistry = await this.PatientIPFSHelper.getIPFSDataOfRegistry(patientRegistry.data);

        return patientRegistry;
    }

    async createPatient(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== identifier) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        payload['patient_id'] = identifier;
        
        // Send to IPFS
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);
        
        // Send to Blockchain
        const address = this.PatientAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_CREATE;
        payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE, Constants.PERMISSION_DELETE];

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async updatePatient(identifier, payload, current_user) {
        if (current_user.role == Constants.PRACTITIONER) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_UPDATE_PATIENT, true);
        }

        if (current_user.role == Constants.PATIENT && current_user.id !== identifier) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_PATIENT, true);
        }

        payload['patient_id'] = identifier;
        
        // Send to IPFS
        payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);
        
        // Send to Blockchain
        const address = this.PatientAddressHelper.getAddress(identifier);
        payload['action'] = Constants.ACTION_UPDATE;

        return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
    }

    async deletePatient(identifier, current_user) {
        if (current_user.role == Constants.PRACTITIONER) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_UPDATE_PATIENT, true);
        }

        if (current_user.role == Constants.PATIENT && current_user.id !== identifier) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_PATIENT, true);
        }

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

module.exports.PatientClient = PatientClient;