const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');

class PatientClient extends CommonClient {
    constructor() {
        super(
            Constants.PATIENT_REGISTRY_TP_NAME, 
            Constants.PATIENT_REGISTRY_TP_CODE,
            Constants.PATIENT_REGISTRY_TP_VERSION
        );
    }

    async createPatient(identifier, payload) {
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;
        return await this.wrap_and_send(identifier, payload);
    }

    async updatePatient(identifier, payload) {
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;
        return await this.wrap_and_send(identifier, payload);
    }

    async deletePatient(identifier) {
        var payload = {};
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        return await this.deleteRegistry(identifier, payload);
    }
}

module.exports.PatientClient = PatientClient;