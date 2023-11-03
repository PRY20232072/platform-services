const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');

class AllergyClient extends CommonClient {
    constructor() {
        super(
            Constants.ALLERGY_REGISTRY_TP_NAME, 
            Constants.ALLERGY_REGISTRY_TP_CODE,
            Constants.ALLERGY_REGISTRY_TP_VERSION
        );
    }

    async createAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;
        return await this.wrap_and_send(identifier, payload);
    }

    async updateAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;
        return await this.wrap_and_send(identifier, payload);
    }

    async deleteAllergy(identifier) {
        var payload = {};
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        return await this.deleteRegistry(identifier, payload);
    }
}

module.exports.AllergyClient = AllergyClient;