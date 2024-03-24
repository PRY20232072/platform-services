const { Constants } = require('../common/Constants');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { FamilyHistoryHelper } = require('./helpers/FamilyHistoryHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { FamilyHistoryRepositoryImpl } = require('./implementations/FamilyHistoryRepositoryImpl');

class FamilyHistoryClient {
    constructor() {
        this.FamilyHistoryHelper = new FamilyHistoryHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
    }

    async getFamilyHistoryList(current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            const registryList = await this.FamilyHistoryRepository.getFamilyHistoryList();

            if (registryList.data == undefined) {
                return registryList;
            }

            return this.FamilyHistoryHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async getFamilyHistoryById(familyHistory_id, current_user) {
        try {
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            const registryList = await this.FamilyHistoryRepository.getFamilyHistoryById(familyHistory_id);

            return registryList;
        } catch (error) {
            throw error;
        }
    }

    async getFamilyHistoryByPatientId(patient_id, current_user) {
        try {
            if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
                throw new UnauthorizedPatientError();
            }

            const registryList = await this.FamilyHistoryRepository.getFamilyHistoryListByPatientId(patient_id);

            if (registryList.error || registryList.data == undefined) {
                return registryList;
            }

            return this.FamilyHistoryHelper.transformRegistryList(registryList);
        } catch (error) {
            throw error;
        }
    }

    async getFamilyHistoryByIdAndPatient(familyHistory_id, patient_id, current_user) {
        try {
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            const registryList = await this.FamilyHistoryRepository.getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id);

            return registryList;
        } catch (error) {
            throw error;
        }
    }

    async createFamilyHistory(familyHistory_id, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

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

            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_WRITE, Constants.FAMILY_HISTORY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            return await this.FamilyHistoryRepository.updateFamilyHistory(familyHistory_id, payload);
        } catch (error) {
            throw error;
        }
    }

    async deleteFamilyHistory(familyHistory_id, patient_id, current_user) {
        try {
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_DELETE, Constants.FAMILY_HISTORY);

            if (!accessControlResponse) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            return await this.FamilyHistoryRepository.deleteFamilyHistory(familyHistory_id, patient_id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.FamilyHistoryClient = FamilyHistoryClient;