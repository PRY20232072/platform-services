const { Constants } = require('../common/Constants');
const { FamilyHistoryHelper } = require('./helpers/FamilyHistoryHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { ResponseObject } = require('../common/ResponseObject');
const { FamilyHistoryRepositoryImpl } = require('./implementations/FamilyHistoryRepositoryImpl');

class FamilyHistoryClient {
    constructor() {
        this.FamilyHistoryHelper = new FamilyHistoryHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
    }

    async getFamilyHistoryList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_FAMILY_HISTORY_LIST, true);
        }

        const registryList = await this.FamilyHistoryRepository.getFamilyHistoryList();

        if (registryList.error || registryList.data == undefined) {
            return registryList;
        }

        return this.FamilyHistoryHelper.transformRegistryList(registryList);
    }

    async getFamilyHistoryById(familyHistory_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);

        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const registryList = await this.FamilyHistoryRepository.getFamilyHistoryById(familyHistory_id);

        return registryList;
    }

    async getFamilyHistoryByPatientId(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_FAMILY_HISTORY_LIST, true);
        }

        const registryList = await this.FamilyHistoryRepository.getFamilyHistoryListByPatientId(patient_id);

        if (registryList.error || registryList.data == undefined) {
            return registryList;
        }

        return this.FamilyHistoryHelper.transformRegistryList(registryList);
    }

    async getAlleryByIdAndPatientId(familyHistory_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_READ, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const registryList = await this.FamilyHistoryRepository.getFamilyHistoryByIdAndPatientId(familyHistory_id, patient_id);

        return registryList;
    }

    async createFamilyHistory(familyHistory_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        return await this.FamilyHistoryRepository.createFamilyHistory(familyHistory_id, payload);
    }

    async updateFamilyHistory(familyHistory_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_WRITE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        return await this.FamilyHistoryRepository.updateFamilyHistory(familyHistory_id, payload);
    }

    async deleteFamilyHistory(familyHistory_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(familyHistory_id, current_user, Constants.PERMISSION_DELETE, Constants.FAMILY_HISTORY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        return await this.FamilyHistoryRepository.deleteFamilyHistory(familyHistory_id, patient_id);
    }
}

module.exports.FamilyHistoryClient = FamilyHistoryClient;