const { Constants } = require("../../common/Constants");
const { CustomError } = require("../../common/errors/CustomError");
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
        try {
            const address = this.PatientAddressHelper.getAddressByTPName();
    
            var patientRegistryList = await this.PatientBlockchainHelper.getRegistryList(address);
            patientRegistryList = await this.PatientIPFSHelper.getIPFSDataOfRegistryList(patientRegistryList);
    
            return patientRegistryList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_LIST,
                error.message,
            );
        }
    }

    async getPatientById(patient_id) {
        try {
            const address = this.PatientAddressHelper.getAddress(patient_id);
    
            var patientRegistry = await this.PatientBlockchainHelper.getRegistry(address);
            patientRegistry = await this.PatientIPFSHelper.getIPFSDataOfRegistry(patientRegistry.data);
    
            return patientRegistry;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_TO_GET_REGISTRY_BY_ID,
                error.message,
            );
        }
    }

    async existPatientById(patient_id) {
        try {
            const patient = await this.getPatientById(patient_id);
            return !patient.error;
        } catch (error) {
            throw error;
        }
    }

    async createPatient(identifier, payload) {
        try {
            payload['patient_id'] = identifier;
    
            // Send to IPFS
            payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);
    
            // Send to Blockchain
            const address = this.PatientAddressHelper.getAddress(identifier);
            payload['action'] = Constants.ACTION_CREATE;
            payload['permissions'] = [Constants.PERMISSION_READ, Constants.PERMISSION_WRITE, Constants.PERMISSION_DELETE];
    
            return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_REGISTRY,
                error.message,
            );
        }
    }

    async updatePatient(identifier, payload) {
        try {
            payload['patient_id'] = identifier;
    
            // Send to IPFS
            payload = await this.PatientIPFSHelper.sentToIPFS(identifier, payload);
    
            // Send to Blockchain
            const address = this.PatientAddressHelper.getAddress(identifier);
            payload['action'] = Constants.ACTION_UPDATE;
    
            return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_REGISTRY,
                error.message,
            );
        }
    }

    async deletePatient(identifier) {
        try {
            var payload = {};
            payload['patient_id'] = identifier;
            payload['action'] = Constants.ACTION_DELETE;
    
            const address = this.PatientAddressHelper.getAddress(identifier);
            var registry = await this.PatientBlockchainHelper.getRegistry(address);
    
            if (registry.error) {
                return registry;
            }
    
            registry = registry.data;
            await this.PatientIPFSHelper.ipfsClient.rm(registry.ipfs_hash);
    
            return await this.PatientBlockchainHelper.wrap_and_send(payload, [address]);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_REGISTRY,
                error.message,
            );
        }
    }
}

module.exports = { PatientRepositoryImpl };
