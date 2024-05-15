const { Constants } = require('../common/Constants');
const { AttentionHelper } = require('./helpers/AttentionHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { AttentionRepositoryImpl } = require('./implementations/AttentionRepositoryImpl');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');

class AttentionClient {
    constructor() {
        this.AttentionHelper = new AttentionHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.AttentionRepository = new AttentionRepositoryImpl();
    }

    async getAttentionById(attention_id, patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const response = await this.AttentionRepository.getAttentionById(attention_id);
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

    async getAttentionListByPatientId(patient_id, current_user) {
        try {
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const registryList = await this.AttentionRepository.getAttentionListByPatientId(patient_id);

            return this.AttentionHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async createAttention(attention_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const createdResponse = await this.AttentionRepository.createAttention(attention_id, payload);

            return createdResponse;
        } catch (error) {
            throw error;
        }

    }

    async updateAttention(attention_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const patient_id = payload.patient_id;
            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const updatedResponse = await this.AttentionRepository.updateAttention(attention_id, payload);

            return updatedResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteAttention(attention_id, patient_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            await this.ConsentValidatorHelper.validateAccess(current_user, patient_id);

            const deletedResponse = await this.AttentionRepository.deleteAttention(attention_id, patient_id);

            return deletedResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.AttentionClient = AttentionClient;