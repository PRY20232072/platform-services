const { AllergyAddressHelper } = require('../../allergy/helpers/AllergyAddressHelper');
const { AllergyBlockchainHelper } = require('../../allergy/helpers/AllergyBlockchainHelper');
const { AllergyIPFSHelper } = require('../../allergy/helpers/AllergyIPFSHelper');
const { PatientClient } = require('../../patient/PatientClient');
const { PractitionerClient } = require('../../practitioner/PractitionerClient');
const { ConsentClient } = require('../../consent/ConsentClient');
const { Constants } = require('../Constants');

class ConsentValidatorHelper {
    constructor() {
        this.AllergyAddressHelper = new AllergyAddressHelper();
        this.AllergyBlockchainHelper = new AllergyBlockchainHelper();
        this.AllergyIPFSHelper = new AllergyIPFSHelper();
        this.PatientClient = new PatientClient();
        this.PractitionerClient = new PractitionerClient();
        this.ConsentClient = new ConsentClient();  
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id) {
        var address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no allergy with this identifier";
            return data;
        }
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async validateAccess(patient_id, practitioner_id, allergy_id, permission) {
        if (practitioner_id == null || practitioner_id == undefined || practitioner_id == "") {
            var patientPermission = await this.patientHasAccessAllergy(patient_id, allergy_id, permission);
            if (!patientPermission) {
                return { error: true, data: "The patient has no permission to access this allergy" };
            }
            return { error: false, data: "The patient has permission to access this allergy" };
        }
        else {
            var practitionerPermission = await this.practitionerHasAccessAllergy(practitioner_id, allergy_id, permission);
            if (!practitionerPermission) {
                return { error: true, data: "The practitioner has no permission to access this allergy" };
            }
            return { error: false, data: "The practitioner has permission to access this allergy" };
        }
    }

    async patientHasAccessAllergy(patient_id, allergy_id, permission) {
        var patient = await this.PatientClient.getPatientById(patient_id);
        if (patient.error) { //patient not found
            return false;
        }

        var allergy = await this.getAlleryByIdAndPatientId(allergy_id, patient_id);
        if (allergy.error) { //allergy not found
            return false;
        }

        var patientPermission = patient.data.permissions;
        if (patientPermission.includes(permission)) { //patient has permission
            return true;
        }

        return false; //patient has no permission
    }

    async practitionerHasAccessAllergy(practitioner_id, allergy_id, permission) {
        var practitioner = await this.PractitionerClient.getPractitionerById(practitioner_id);
        if (practitioner.error) { //practitioner not found
            return false;
        }

        var consent = await this.ConsentClient.getConsentByRegisterIdAndPractitionerId(allergy_id, practitioner_id);

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