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
        var address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return data;
        }
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async getFamilyHistoryByIdAndPatientId(family_history_id, patient_id) {
        var address = this.FamilyHistoryAddressHelper.getFamilyHistoryPatientAddress(family_history_id, patient_id);
        var data = await this.FamilyHistoryBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = Constants.REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST;
            return data;
        }
        data = await this.FamilyHistoryIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async getRegistryByIdAndPatientId(registry_id, patient_id, registry_type) {
        if (registry_type == Constants.ALLERGY) {
            return await this.getAlleryByIdAndPatientId(registry_id, patient_id);
        }
        else if (registry_type == Constants.FAMILY_HISTORY) {
            return await this.getFamilyHistoryByIdAndPatientId(registry_id, patient_id);
        }
    }

    async validateAccess(patient_id, practitioner_id, registry_id, permission, registry_type) {
        if (practitioner_id == null || practitioner_id == undefined || practitioner_id == "") {
            var patientPermission = await this.patientHasAccessToRegistry(patient_id, registry_id, permission, registry_type);
            if (!patientPermission) {
                return new ResponseObject(Constants.ACCESS_DENIED_PATIENT_MSG, true);
            }

            return new ResponseObject(Constants.ACCESS_GRANTED_PATIENT_MSG);
        }
        else {
            var practitionerPermission = await this.practitionerHasAccessToRegistry(practitioner_id, registry_id, permission);
            if (!practitionerPermission) {
                return new ResponseObject(Constants.ACCESS_DENIED_PRACTITIONER_MSG, true);
            }
            return new ResponseObject(Constants.ACCESS_GRANTED_PRACTITIONER_MSG);
        }
    }

    async patientHasAccessToRegistry(patient_id, registry_id, permission, registry_type) {
        var patient = await this.PatientClient.getPatientById(patient_id);
        if (patient.error) { //patient not found
            return false;
        }

        var registry = await this.getRegistryByIdAndPatientId(registry_id, patient_id, registry_type);
        if (registry.error) { //allergy not found
            return false;
        }

        var patientPermission = patient.data.permissions;
        if (patientPermission.includes(permission)) { //patient has permission
            return true;
        }

        return false; //patient has no permission
    }

    async practitionerHasAccessToRegistry(practitioner_id, registry_id, permission) {
        var practitioner = await this.PractitionerClient.getPractitionerById(practitioner_id);
        if (practitioner.error) { //practitioner not found
            return false;
        }

        var consent = await this.ConsentClient.getConsentByRegisterIdAndPractitionerId(registry_id, practitioner_id);

        if (consent.error) { //practice has no consent for this allergy
            return false;
        }

        var consentState = consent.data.state;
        var practitionerPermission = practitioner.data.permissions;
        if (consentState == Constants.CONSENT_ACTIVE && practitionerPermission.includes(permission)) { //practitioner has permission
            return true;
        }

        return false; //practitioner has no permission
    }
}

module.exports.ConsentValidatorHelper = ConsentValidatorHelper;