const { Constants } = require('../common/Constants');
const { AllergyHelper } = require('./helpers/AllergyHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { AllergyRepositoryImpl } = require('./implementations/AllergyRepositoryImpl');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');

class AllergyClient {
    constructor() {
        this.AllergyHelper = new AllergyHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.AllergyRepository = new AllergyRepositoryImpl();
    }

    async getAllergyById(allergy_id, patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const response = await this.AllergyRepository.getAllergyById(allergy_id);
            const registry = response.data[0];
            if (!registry || registry.patient_id !== patient_id) {
                if (current_user.role === Constants.PRACTITIONER) {
                    throw new UnauthorizedPractitionerError();
                } else {
                    throw new UnauthorizedPatientError();
                }
            }

            response.data = registry;
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getAllergyListByPatientId(patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const registryList = await this.AllergyRepository.getAllergyListByPatientId(patient_id);

            return this.AllergyHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async createAllergy(allergy_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const createdResponse = await this.AllergyRepository.createAllergy(allergy_id, payload);

            return createdResponse;
        } catch (error) {
            throw error;
        }

    }

    async updateAllergy(allergy_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const updatedResponse = await this.AllergyRepository.updateAllergy(allergy_id, payload);

            return updatedResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllergy(allergy_id, patient_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const deletedResponse = await this.AllergyRepository.deleteAllergy(allergy_id, patient_id);

            return deletedResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.AllergyClient = AllergyClient;