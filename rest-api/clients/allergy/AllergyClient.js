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

    getAllergy(identifier) {
        var address = this.getAddress(identifier);
        return this.send_request('/state/' + address, null);
    }

    getAllergyList() {
        var address = this.getAddressList();
        return this.send_request('/state?address=' + address, null);
    }

    createAllergy(identifier, payload) {
        console.log("createAllergy | payload: " + JSON.stringify(payload));
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;
        return this.wrap_and_send(identifier, JSON.stringify(payload));
    }

    updateAllergy(identifier, payload) {
        console.log("updateAllergy | payload: " + JSON.stringify(payload));
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;
        return this.wrap_and_send(identifier, JSON.stringify(payload));
    }

    deleteAllergy(identifier) {
        console.log("deleteAllergy | identifier: " + identifier);
        var payload = {};
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;
        return this.wrap_and_send(identifier, JSON.stringify(payload));
    }
}

module.exports.AllergyClient = AllergyClient;