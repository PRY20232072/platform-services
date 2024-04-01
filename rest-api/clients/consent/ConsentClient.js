const { Constants } = require('../common/Constants');
const { CustomError } = require('../common/errors/CustomError');
const { ConsentAddressHelper } = require('./helpers/ConsentAddressHelper');
const { ConsentBlockchainHelper } = require('./helpers/ConsentBlockchainHelper');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { ResponseObject } = require('../common/ResponseObject');
const { ConsentHelper } = require('./helpers/ConsentHelper');
const { AllergyRepositoryImpl } = require('../allergy/implementations/AllergyRepositoryImpl');
const { FamilyHistoryRepositoryImpl } = require('../family/implementations/FamilyHistoryRepositoryImpl');

class ConsentClient {
    constructor() {
        this.ConsentAddressHelper = new ConsentAddressHelper();
        this.ConsentBlockchainHelper = new ConsentBlockchainHelper();
        this.ConsentHelper = new ConsentHelper();
        this.AllergyRepositoryImpl = new AllergyRepositoryImpl();
        this.FamilyHistoryRepositoryImpl = new FamilyHistoryRepositoryImpl();
    }

    async getConsentByRegisterId(register_id, current_user) {
        try {
            const address = this.ConsentAddressHelper.getAddress(register_id);
            const data = await this.ConsentBlockchainHelper.getRegistryList(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async getConsentByPractitionerId(practitioner_id, current_user) {
        try {
            const address = this.ConsentAddressHelper.getAddress(practitioner_id);
            const data = await this.ConsentBlockchainHelper.getRegistryList(address);
            return data;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_CONSENT,
                error.message,
            );
        }
    }

    async getConsentByRegisterIdAndPractitionerId(register_id, practitioner_id, current_user) {
        try {
            const address = this.ConsentAddressHelper.getRegisterPractitionerAddress(register_id, practitioner_id);
            const data = await this.ConsentBlockchainHelper.getRegistry(address);
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
    
            const allergyRegistries = (await this.AllergyRepositoryImpl.getAllergyListByPatientId(patient_id)).data;
            const familyHistoryRegistries = (await this.FamilyHistoryRepositoryImpl.getFamilyHistoryListByPatientId(patient_id)).data;
    
            const consentList = await this.getConsentListFromRegistries(allergyRegistries, familyHistoryRegistries, current_user, consentState);
    
            return new ResponseObject(await this.ConsentHelper.parseConsentList(consentList));
        } catch (error) {
            throw new CustomError(Constants.ERROR_FETCHING_CONSENT, error.message);
        }
    }
    
    async getConsentListFromRegistries(allergyRegistries, familyHistoryRegistries, current_user, consentState) {
        let consentList = [];
    
        for (const registry of allergyRegistries) {
            const consentListAux = await this.getConsentByRegisterId(registry.allergy_id, current_user);
            consentList = consentList.concat(consentListAux.data.filter(consent => consent.state === consentState));
        }
    
        for (const registry of familyHistoryRegistries) {
            const consentListAux = await this.getConsentByRegisterId(registry.familyHistory_id, current_user);
            consentList = consentList.concat(consentListAux.data.filter(consent => consent.state === consentState));
        }
    
        return consentList;
    }

    async createConsent(payload, current_user) {
        try {
            const addresses = this.ConsentAddressHelper.getAddresses(payload['register_id'], payload['practitioner_id']);
            payload['action'] = Constants.ACTION_CREATE;

            if (current_user.role === Constants.PRACTITIONER) { // create consent
                await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);
            } else if (current_user.role === Constants.PATIENT) { // approve consent
                // create consent
                await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

                // approve consent
                await this.approveConsent(payload['register_id'], payload['practitioner_id'], current_user);

                // create notification to practitioner
                await this.ConsentHelper.createNotificationToPractitioner(
                    current_user.id,
                    payload['practitioner_id'],
                    Constants.PATIENT_HAS_APPROVED_CONSENT_TO_REGISTER + payload['register_id']
                );
            }

            return new ResponseObject(Constants.CONSENT_CREATED_SUCCESSFULLY);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_CONSENT,
                error.message,
            );
        }
    }

    async approveConsent(register_id, practitioner_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            var payload = {};
            payload['register_id'] = register_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_APPROVE;

            const addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);

            await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

            // create notification to practitioner
            await this.ConsentHelper.createNotificationToPractitioner(
                current_user.id,
                payload['practitioner_id'],
                Constants.PATIENT_HAS_APPROVED_CONSENT_TO_REGISTER + payload['register_id']
            );

            return new ResponseObject(Constants.CONSENT_CREATED_SUCCESSFULLY);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_APPROVING_CONSENT,
                error.message,
            );
        }
    }

    async revokeConsent(register_id, practitioner_id, current_user) {
        try {
            if (current_user.role === Constants.PRACTITIONER) {
                throw new UnauthorizedPractitionerError();
            }

            var payload = {};
            payload['register_id'] = register_id;
            payload['practitioner_id'] = practitioner_id;
            payload['action'] = Constants.ACTION_REVOKE;

            const addresses = this.ConsentAddressHelper.getAddresses(register_id, practitioner_id);

            await this.ConsentBlockchainHelper.wrap_and_send(payload, addresses);

            // create notification to practitioner
            await this.ConsentHelper.createNotificationToPractitioner(
                current_user.id,
                payload['practitioner_id'],
                Constants.PATIENT_HAS_REVOKED_CONSENT_TO_REGISTER + payload['register_id']
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