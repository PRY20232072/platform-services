
const { CommonIPFSHelper } = require('../../common/helpers/CommonIPFSHelper');

class AllergyIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async sentToIPFS(identifier, payload) {
        var response = await this.InfuraIPFSClient.add(payload);

        if (response.error) {
            return response;
        }

        var new_payload = {
            allergy_id: identifier,
            patient_id: payload.patient_id,
            ipfs_hash: response.hash,
            action: payload.action
        };

        return new_payload;
    }
}

module.exports.AllergyIPFSHelper = AllergyIPFSHelper;