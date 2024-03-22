const { Constants } = require('../common/Constants');
const { AllergyHelper } = require('./helpers/AllergyHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { ResponseObject } = require('../common/ResponseObject');
const { AllergyRepositoryImpl } = require('./implementations/AllergyRepositoryImpl');

class AllergyClient {
    constructor() {
        this.AllergyHelper = new AllergyHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.AllergyRepository = new AllergyRepositoryImpl();
    }

    async getAllergyList(current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_ALLERGY_LIST, true);
        }

        const registryList = await this.AllergyRepository.getAllergyList();

        if (registryList.error || registryList.data == undefined) {
            return registryList;
        }

        return this.AllergyHelper.transformRegistryList(registryList);
    }

    async getAllergyById(allergy_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);

        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const registryList = await this.AllergyRepository.getAllergyById(allergy_id);

        return registryList;
    }

    async getAllergyListByPatientId(patient_id, current_user) {
        if (current_user.role === Constants.PATIENT && current_user.id !== patient_id) {
            return new ResponseObject(Constants.PATIENT_CANNOT_GET_ALLERGY_LIST, true);
        }

        const registryList = await this.AllergyRepository.getAllergyListByPatientId(patient_id);

        return this.AllergyHelper.transformRegistryList(registryList);
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id, current_user) {
        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_READ, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const registryList = await this.AllergyRepository.getAlleryByIdAndPatientId(allergy_id, patient_id);

        return registryList;
    }

    async createAllergy(allergy_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const createdResponse = await this.AllergyRepository.createAllergy(allergy_id, payload);

        return createdResponse;
    }

    async updateAllergy(allergy_id, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_REGISTRY, true);
        }

        const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_WRITE, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }
        
       const updatedResponse = await this.AllergyRepository.updateAllergy(allergy_id, payload);

        return updatedResponse;
    }

    async deleteAllergy(allergy_id, patient_id, current_user) {
        var accessControlResponse = await this.ConsentValidatorHelper.validateAccess(allergy_id, current_user, Constants.PERMISSION_DELETE, Constants.ALLERGY);
        if (accessControlResponse.error) {
            return accessControlResponse;
        }

        const deletedResponse = await this.AllergyRepository.deleteAllergy(allergy_id, patient_id);

        return deletedResponse;
    }
}

module.exports.AllergyClient = AllergyClient;