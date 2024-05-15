const { Constants } = require('../common/Constants');
const { CustomError } = require('../common/errors/CustomError');
const { ConsentAddressHelper } = require('./helpers/ConsentAddressHelper');
const { ConsentBlockchainHelper } = require('./helpers/ConsentBlockchainHelper');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { ResponseObject } = require('../common/ResponseObject');
const { ConsentHelper } = require('./helpers/ConsentHelper');

class ConsentClient {
    constructor() {
        this.ConsentAddressHelper = new ConsentAddressHelper();
        this.ConsentBlockchainHelper = new ConsentBlockchainHelper();
        this.ConsentHelper = new ConsentHelper();
    }

    async getConsentByUserId(user_id) {
        try {
            const address = this.ConsentAddressHelper.getAddress(user_id);
            const data = await this.ConsentBlockchainHelper.getRegistryList(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async getActiveConsentListByPatientId(patient_id, current_user) {
        return await this.getConsentListByPatientId(patient_id, current_user, Constants.CONSENT_ACTIVE);
    }

    async getPendingConsentListByPatientId(patient_id, current_user) {
        return await this.getConsentListByPatientId(patient_id, current_user, Constants.CONSENT_PENDING);
    }

    async getConsentListByPatientId(patient_id, current_user, consentState) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            if (current_user.id !== patient_id) {
                throw new UnauthorizedPatientError();
            }

            let consentList = await this.getConsentByUserId(patient_id);
            consentList = consentList.data.filter(consent => consent.state === consentState);

            return new ResponseObject(await this.ConsentHelper.parseConsentList(consentList));
        } catch (error) {
            throw new CustomError(Constants.ERROR_FETCHING_CONSENT, error.message);
        }
    }

    async createConsent(payload, current_user) {
        try {
            const addresses = this.ConsentAddressHelper.getAddresses(payload['patient_id'], payload['practitioner_id']);
            payload['action'] = Constants.ACTION_CREATE;

            await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

            if (current_user.role === Constants.PATIENT) { // approve consent
                await this.approveConsent(payload['patient_id'], payload['practitioner_id'], current_user);
            }

            return new ResponseObject(Constants.CONSENT_CREATED_SUCCESSFULLY);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_CONSENT,
                error.message,
            );
        }
    }

    async approveConsent(patient_id, practitioner_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            var payload = {};
            payload['patient_id'] = patient_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_APPROVE;

            const addresses = this.ConsentAddressHelper.getAddresses(patient_id, practitioner_id);

            await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

            // create notification to practitioner
            await this.ConsentHelper.createNotificationToPractitioner(
                practitioner_id,
                patient_id,
                Constants.PATIENT_APPROVED_EHR_ACCESS + current_user.name
            );

            return new ResponseObject(Constants.CONSENT_CREATED_SUCCESSFULLY);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_APPROVING_CONSENT,
                error.message,
            );
        }
    }

    async revokeConsent(patient_id, practitioner_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            var payload = {};
            payload['patient_id'] = patient_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_REVOKE;

            const addresses = this.ConsentAddressHelper.getAddresses(patient_id, practitioner_id);

            await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

            // create notification to practitioner
            await this.ConsentHelper.createNotificationToPractitioner(
                practitioner_id,
                patient_id,
                Constants.PATIENT_APPROVED_EHR_ACCESS + current_user.name
            );

            return new ResponseObject(Constants.CONSENT_REVOKE_SUCCESSFULLY);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_REVOKING_CONSENT,
                error.message,
            );
        }
    }
}

module.exports.ConsentClient = ConsentClient;