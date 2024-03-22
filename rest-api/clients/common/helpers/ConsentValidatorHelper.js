const { ConsentClient } = require('../../consent/ConsentClient');
const { Constants } = require('../Constants');
const { ResponseObject } = require('../ResponseObject');
const { AllergyRepositoryImpl } = require('../../allergy/implementations/AllergyRepositoryImpl');
const { FamilyHistoryRepositoryImpl } = require('../../family/implementations/FamilyHistoryRepositoryImpl');
const { PatientRepositoryImpl } = require('../../patient/implementations/PatientRepositoryImpl');
const { PractitionerRepositoryImpl } = require('../../practitioner/implementations/PractitionerRepositoryImpl');

class ConsentValidatorHelper {
    constructor() {
        this.ConsentClient = new ConsentClient();
        this.AllergyRepository = new AllergyRepositoryImpl();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
        this.PatientRepository = new PatientRepositoryImpl();
        this.PractitionerRepository = new PractitionerRepositoryImpl();
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
        const patientResult = await this.PatientRepository.getPatientById(patient.id);
        if (patientResult.error) {
            return false;
        }

        const existRegistry = await this.existRegistryByIdAndPatientId(registry_id, patient.id, registry_type);
        if (!existRegistry) {
            return false;
        }

        const patientPermission = patientResult.data.permissions;
        if (patientPermission.includes(permission)) { //patient has permission
            return true;
        }

        return false; //patient has no permission
    }

    async practitionerHasAccessToRegistry(practitioner, registry_id, permission) {
        const practitionerResult = await this.PractitionerRepository.getPractitionerById(practitioner.id);
        if (practitionerResult.error) {
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

    async existRegistryByIdAndPatientId(registry_id, patient_id, registry_type) {
        if (registry_type == Constants.ALLERGY) {
            return await this.AllergyRepository.existAllergyByIdAndPatientId(registry_id, patient_id);
        } else if (registry_type == Constants.FAMILY_HISTORY) {
            return await this.FamilyHistoryRepository.existFamilyHistoryByIdAndPatientId(registry_id, patient_id);
        }

        return false;
    }
}

module.exports.ConsentValidatorHelper = ConsentValidatorHelper;