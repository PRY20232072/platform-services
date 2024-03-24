const { ConsentClient } = require('../../consent/ConsentClient');
const { Constants } = require('../Constants');
const { AllergyRepositoryImpl } = require('../../allergy/implementations/AllergyRepositoryImpl');
const { FamilyHistoryRepositoryImpl } = require('../../family/implementations/FamilyHistoryRepositoryImpl');
const { PatientRepositoryImpl } = require('../../patient/implementations/PatientRepositoryImpl');
const { PractitionerRepositoryImpl } = require('../../practitioner/implementations/PractitionerRepositoryImpl');
const { UnauthorizedPatientError } = require('../errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../errors/UnauthorizedPractitionerError');

class ConsentValidatorHelper {
    constructor() {
        this.ConsentClient = new ConsentClient();
        this.AllergyRepository = new AllergyRepositoryImpl();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
        this.PatientRepository = new PatientRepositoryImpl();
        this.PractitionerRepository = new PractitionerRepositoryImpl();
    }

    async validateAccess(registry_id, current_user, permission, registry_type) {
        try {
            if (current_user.role === Constants.PATIENT) {
                const patientPermission = await this.patientHasAccessToRegistry(current_user, registry_id, permission, registry_type);

                if (!patientPermission) {
                    throw new UnauthorizedPatientError();
                }

                return true;
            }
            else {
                const practitionerPermission = await this.practitionerHasAccessToRegistry(current_user, registry_id, permission);

                if (!practitionerPermission) {
                    throw new UnauthorizedPractitionerError();
                }

                return true;
            }
        } catch (error) {
            throw error;
        }
    }

    async patientHasAccessToRegistry(patient, registry_id, permission, registry_type) {
        try {
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
        } catch (error) {
            throw new UnauthorizedPatientError(error.message);
        }
    }

    async practitionerHasAccessToRegistry(practitioner, registry_id, permission) {
        try {
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
        } catch (error) {
            throw new UnauthorizedPractitionerError(error.message);
        }
    }

    async existRegistryByIdAndPatientId(registry_id, patient_id, registry_type) {
        try {
            if (registry_type == Constants.ALLERGY) {
                return await this.AllergyRepository.existAllergyByIdAndPatientId(registry_id, patient_id);
            } else if (registry_type == Constants.FAMILY_HISTORY) {
                return await this.FamilyHistoryRepository.existFamilyHistoryByIdAndPatientId(registry_id, patient_id);
            }

            return false;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.ConsentValidatorHelper = ConsentValidatorHelper;