const { Constants } = require('../common/Constants');
const { PatientHelper } = require('./helpers/PatientHelper');
const { ResponseObject } = require('../common/ResponseObject');
const { PatientRepositoryImpl } = require('./implementations/PatientRepositoryImpl');

class PatientClient {
    constructor() {
        this.PatientHelper = new PatientHelper();
        this.PatientRepository = new PatientRepositoryImpl();
    }

    async getPatientList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_PATIENT_LIST, true);
        }

        const patientRegistryList = await this.PatientRepository.getPatientList();

        return this.PatientHelper.transformPatientList(patientRegistryList);
    }

    async getPatientById(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_PATIENT, true);
        }

        const patientRegistry = await this.PatientRepository.getPatientById(patient_id);

        return patientRegistry;
    }

    async createPatient(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== identifier) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const createdResponse = await this.PatientRepository.createPatient(identifier, payload);

        return createdResponse;
    }

    async updatePatient(identifier, payload, current_user) {
        if (current_user.role == Constants.PRACTITIONER) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_UPDATE_PATIENT, true);
        }

        const updateResponse = await this.PatientRepository.updatePatient(identifier, payload);

        return updateResponse;
    }

    async deletePatient(identifier, current_user) {
        if (current_user.role == Constants.PRACTITIONER) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_UPDATE_PATIENT, true);
        }

        if (current_user.role == Constants.PATIENT && current_user.id !== identifier) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_PATIENT, true);
        }

        const deleteResponse = await this.PatientRepository.deletePatient(identifier);

        return deleteResponse;
    }
}

module.exports.PatientClient = PatientClient;