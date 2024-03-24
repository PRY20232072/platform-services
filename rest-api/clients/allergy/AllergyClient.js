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

    async getAllergyList(current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const registryList = await this.AllergyRepository.getAllergyList();

            if (registryList.data == undefined) {
                return registryList;
            }

            return this.AllergyHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async getAllergyById(allergy_id, current_user) {
        try {
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            const registryList = await this.AllergyRepository.getAllergyById(allergy_id);

            return registryList;
        } catch (error) {
            throw error;
        }
    }

    async getAllergyListByPatientId(patient_id, current_user) {
        try {
            if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
                throw new UnauthorizedPatientError();
            }

            const registryList = await this.AllergyRepository.getAllergyListByPatientId(patient_id);

            return this.AllergyHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async getAllergyByIdAndPatientId(allergy_id, patient_id, current_user) {
        try {
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }
            const registryList = await this.AllergyRepository.getAllergyByIdAndPatientId(allergy_id, patient_id);

            return registryList;
        } catch (error) {
            throw error;
        }
    }

    async createAllergy(allergy_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

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

            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_WRITE, Constants.ALLERGY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            const updatedResponse = await this.AllergyRepository.updateAllergy(allergy_id, payload);

            return updatedResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllergy(allergy_id, patient_id, current_user) {
        try {
            var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_DELETE, Constants.ALLERGY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            const deletedResponse = await this.AllergyRepository.deleteAllergy(allergy_id, patient_id);

            return deletedResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.AllergyClient = AllergyClient;