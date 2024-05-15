const { ConsentClient } = require('../../consent/ConsentClient');
const { Constants } = require('../Constants');
const { UnauthorizedPatientError } = require('../errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../errors/UnauthorizedPractitionerError');

class ConsentValidatorHelper {
    constructor() {
        this.ConsentClient = new ConsentClient();
    }

    async validateAccess(current_user, patient_id) {
        try {
            if (current_user.role === Constants.PATIENT) {
                // if current user is a patient, he can only access his own data
                if (current_user.id !== patient_id) {
                    throw new UnauthorizedPatientError();
                }
                return true;
            }
            else {
                // if current user is a practitioner, he can only access patient data if he has an active consent
                const consentList = await this.ConsentClient.getConsentByUserId(current_user.id); // get all consents of the practitioner
                const activeConsents = consentList.data.filter(consent => consent.state === Constants.CONSENT_ACTIVE); // get only active consents
                const patientConsent = activeConsents.find(consent => consent.patient_id === patient_id); // check if there is a consent for the patient
                if (!patientConsent) {
                    throw new UnauthorizedPractitionerError();
                }
                return true;
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports.ConsentValidatorHelper = ConsentValidatorHelper;