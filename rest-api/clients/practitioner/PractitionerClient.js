const { Constants } = require('../common/Constants');
const { PractitionerHelper } = require('./helpers/PractitionerHelper');
const { PractitionerRepositoryImpl } = require('./implementations/PractitionerRepositoryImpl');
const { ResponseObject } = require('../common/ResponseObject');

class PractitionerClient {
    constructor() {
        this.PractitionerHelper = new PractitionerHelper();
        this.PractitionerRepository = new PractitionerRepositoryImpl();
    }

    async getPractitionerList() {
        const practitionerRegistryList = await this.PractitionerRepository.getPractitionerList();

        if (practitionerRegistryList.error) {
            return practitionerRegistryList;
        }

        return this.PractitionerHelper.transformPractitionerList(practitionerRegistryList);
    }

    async getPractitionerById(practitioner_id, current_user) {
        if (current_user.role === Constants.PRACTITIONER && current_user.id !== practitioner_id) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_GET_PRACTITIONER, true);
        }

        const practitionerRegistry = await this.PractitionerRepository.getPractitionerById(practitioner_id);

        if (practitionerRegistry.error) {
            return practitionerRegistry;
        }

        if (current_user.role === Constants.PRACTITIONER) {
            return practitionerRegistry;
        } else { // Patient
            return this.PractitionerHelper.transformPractitioner(practitionerRegistry);
        }
    }

    async createPractitioner(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_CREATE_A_PRACTITIONER, true);
        }

        if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_CREATE_A_REGISTRY, true);
        }

        const createdResponse = await this.PractitionerRepository.createPractitioner(identifier, payload);

        return createdResponse;
    }

    async updatePractitioner(identifier, payload, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_A_PRACTITIONER, true);
        }

        if (current_user.role === Constants.PRACTITIONER && current_user.id !== identifier) {
            return new ResponseObject(Constants.PRACTITIONER_CANNOT_CREATE_A_REGISTRY, true);
        }

        const updateResponse = await this.PractitionerRepository.updatePractitioner(identifier, payload);

        return updateResponse;
    }

    async deletePractitioner(identifier, current_user) {
        if (current_user.role === Constants.PATIENT) {
            return new ResponseObject(Constants.PATIENT_CANNOT_UPDATE_A_PRACTITIONER, true);
        }

        const deleteResponse = await this.PractitionerRepository.deletePractitioner(identifier);

        return deleteResponse;
    }
}

module.exports.PractitionerClient = PractitionerClient;