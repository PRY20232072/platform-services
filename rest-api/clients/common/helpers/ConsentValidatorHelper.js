const { AllergyAddressHelper } = require('../../allergy/helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('../../allergy/helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('../../allergy/helpers/AllergyIPFSHelper');
const { FamilyHistoryAddressHelper } = require('../../family/helpers/FamilyHistoryAddressHelper');
const { FamilyHistoryBlockchainHelper } = require('../../family/helpers/FamilyHistoryBlockchainHelper');
const { FamilyHistoryIPFSHelper } = require('../../family/helpers/FamilyHistoryIPFSHelper');
const { PatientClient } = require('../../patient/PatientClient');
const { PractitionerClient } = require('../../practitioner/PractitionerClient');
const { ConsentClient } = require('../../consent/ConsentClient');
const { Constants } = require('../Constants');
const { ResponseObject } = require('../ResponseObject');

class ConsentValidatorHelper {
    constructor() {
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
        this.FamilyHistoryAddressHelper = new FamilyHistoryAddressHelper();
        this.FamilyHistoryBlockchainHelper = new FamilyHistoryBlockchainHelper();
        this.FamilyHistoryIPFSHelper = new FamilyHistoryIPFSHelper();
        this.PatientClient = new PatientClient();
        this.PractitionerClient = new PractitionerClient();
        this.ConsentClient = new ConsentClient();
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id) {
        const address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var registryResult = await this.AllergyBlockchainHelper.getRegistry(address);
        if (registryResult.error) {
            registryResult.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return registryResult;
        }
        registryResult = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(registryResult);
        return registryResult;
    }

    async getFamilyHistoryByIdAndPatientId(family_history_id, patient_id) {
        const address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(family_history_id, patient_id);
        var registryResult = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
        if (registryResult.error) {
            registryResult.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return registryResult;
        }
        registryResult = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(registryResult);
        return registryResult;
    }

    async getRegistryByIdAndPatientId(registry_id, patient_id, registry_type) {
        if (registry_type == Constants.ALLERGY) {
            return await this.getAlleryByIdAndPatientId(registry_id, patient_id);
        }
        else if (registry_type == Constants.FAMILY_HISTORY) {
            return await this.getFamilyHistoryByIdAndPatientId(registry_id, patient_id);
        }
    }

    async validateAccess(registry_id, current_user, permission, registry_type) {
        if (current_user.role === Constants.PATIENT) {
            const patientPermission = await this.patientHasAccessToRegistry(current_user, registry_id, permission, registry_type);

            if (!patientPermission) {
                return new ResponseObject(Constants.ACCESS_DENIED_PATIENT_MSG, true);
            }

            return new ResponseObject(Constants.ACCESS_GRANTED_PATIENT_MSG);
        } 
        else {
            const practitionerPermission = await this.practitionerHasAccessToRegistry(current_user, registry_id, permission);

            if (!practitionerPermission) {
                return new ResponseObject(Constants.ACCESS_DENIED_PRACTITIONER_MSG, true);
            }

            return new ResponseObject(Constants.ACCESS_GRANTED_PRACTITIONER_MSG);
        }
    }

    async patientHasAccessToRegistry(patient, registry_id, permission, registry_type) {
        const patientResult = await this.PatientClient.getPatientById(patient.id, patient);
        if (patientResult.error) { //patient not found
            return false;
        }

        const registry = await this.getRegistryByIdAndPatientId(registry_id, patient.id, registry_type);
        if (registry.error) { //allergy not found
            return false;
        }

        const patientPermission = patientResult.data.permissions;
        if (patientPermission.includes(permission)) { //patient has permission
            return true;
        }

        return false; //patient has no permission
    }

    async practitionerHasAccessToRegistry(practitioner, registry_id, permission) {
        const practitionerResult = await this.PractitionerClient.getPractitionerById(practitioner.id, practitioner);
        if (practitionerResult.error) { //practitioner not found
            return false;
        }

        const consent = await this.ConsentClient.getConsentByRegisterIdAndPractitionerId(registry_id, practitioner.id);

        if (consent.error) { //practice has no consent for this allergy
            return false;
        }

        const consentState = consent.data.state;
        const practitionerPermission = practitionerResult.data.permissions;
        if (consentState == Constants.CONSENT_ACTIVE && practitionerPermission.includes(permission)) { //practitioner has permission
            return true;
        }

        return false; //practitioner has no permission
    }
}

module.exports.ConsentValidatorHelper = ConsentValidatorHelper;