const { Constants } = require('../common/Constants');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { FamilyHistoryHelper } = require('./helpers/FamilyHistoryHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { FamilyHistoryRepositoryImpl } = require('./implementations/FamilyHistoryRepositoryImpl');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');

class FamilyHistoryClient {
    constructor() {
        this.FamilyHistoryHelper = new FamilyHistoryHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
    }

    async getFamilyHistoryById(familyHistory_id, patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const response = await this.FamilyHistoryRepository.getFamilyHistoryById(familyHistory_id);
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

    async getFamilyHistoryByPatientId(patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const registryList = await this.FamilyHistoryRepository.getFamilyHistoryListByPatientId(patient_id);

            return this.FamilyHistoryHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async createFamilyHistory(familyHistory_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            return await this.FamilyHistoryRepository.createFamilyHistory(familyHistory_id, payload);
        } catch (error) {
            throw error;
        }
    }

    async updateFamilyHistory(familyHistory_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            return await this.FamilyHistoryRepository.updateFamilyHistory(familyHistory_id, payload);
        } catch (error) {
            throw error;
        }
    }

    async deleteFamilyHistory(familyHistory_id, patient_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            return await this.FamilyHistoryRepository.deleteFamilyHistory(familyHistory_id, patient_id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.FamilyHistoryClient = FamilyHistoryClient;