const { Constants } = require('../common/Constants');
const { PractitionerHelper } = require('./helpers/PractitionerHelper');
const { PractitionerRepositoryImpl } = require('./implementations/PractitionerRepositoryImpl');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');

class PractitionerClient {
    constructor() {
        this.PractitionerHelper = new PractitionerHelper();
        this.PractitionerRepository = new PractitionerRepositoryImpl();
    }

    async getPractitionerList() {
        try {
            const practitionerRegistryList = await this.PractitionerRepository.getPractitionerList();
    
            return this.PractitionerHelper.transformPractitionerList(practitionerRegistryList);
        } catch (error) {
            throw error;
        }
    }

    async getPractitionerById(practitioner_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER && current_user.id !== practitioner_id) {
                throw new UnauthorizedPractitionerError();
            }
    
            const practitionerRegistry = await this.PractitionerRepository.getPractitionerById(practitioner_id);
    
            if (current_user.role === Constants.PRACTITIONER) {
                return practitionerRegistry;
            } else { // Patient
                return this.PractitionerHelper.transformPractitioner(practitionerRegistry);
            }
        } catch (error) {
            throw error;
        }
    }

    async createPractitioner(identifier, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
    
            if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
                throw new UnauthorizedPractitionerError();
            }
    
            const createdResponse = await this.PractitionerRepository.createPractitioner(identifier, payload);
    
            return createdResponse;
        } catch (error) {
            throw error;
        }
    }

    async updatePractitioner(identifier, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
    
            if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
                throw new UnauthorizedPractitionerError();
            }
    
            const updateResponse = await this.PractitionerRepository.updatePractitioner(identifier, payload);
    
            return updateResponse;
        } catch (error) {
            throw error;
        }
    }

    async deletePractitioner(identifier, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
    
            const deleteResponse = await this.PractitionerRepository.deletePractitioner(identifier);
    
            return deleteResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.PractitionerClient = PractitionerClient;