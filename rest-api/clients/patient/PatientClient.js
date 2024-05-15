const { Constants } = require('../common/Constants');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { PatientHelper } = require('./helpers/PatientHelper');
const { PatientRepositoryImpl } = require('./implementations/PatientRepositoryImpl');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");

class PatientClient {
    constructor() {
        this.PatientHelper = new PatientHelper();
        this.PatientRepository = new PatientRepositoryImpl();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
    }

    async getPatientList(current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
    
            const patientRegistryList = await this.PatientRepository.getPatientList();
    
            return this.PatientHelper.transformPatientList(patientRegistryList);
        } catch (error) {
            throw error;
        }
    }

    async getPatientById(patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);
    
            const patientRegistry = await this.PatientRepository.getPatientById(patient_id);
    
            return patientRegistry;
        } catch (error) {
            throw error;
        }
    }

    async createPatient(identifier, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT && current_user.id !== identifier) {
                throw new UnauthorizedPatientError();
            }

            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }
    
            const createdResponse = await this.PatientRepository.createPatient(identifier, payload);
    
            return createdResponse;
        } catch (error) {
            throw error;
        }
    }

    async updatePatient(identifier, payload, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, identifier);

            const updateResponse = await this.PatientRepository.updatePatient(identifier, payload);
    
            return updateResponse;
        } catch (error) {
            throw error;
        }
    }

    async deletePatient(identifier, current_user) {
        try {
            if (current_user.role == Constants.PATIENT && current_user.id !== identifier) {
                throw new UnauthorizedPatientError();
            }
    
            if (current_user.role == Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }
    
            const deleteResponse = await this.PatientRepository.deletePatient(identifier);
    
            return deleteResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.PatientClient = PatientClient;