
const { CommonIPFSHelper } = require('../../common/helpers/CommonIPFSHelper');

class AllergyIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async sentToIPFS(identifier, payload) {
        try {
            var response = await this.ipfsClient.add(payload);

            var new_payload = {
                allergy_id: identifier,
                patient_id: payload.patient_id,
                ipfs_hash: response.data
            };

            return new_payload;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.AllergyIPFSHelper = AllergyIPFSHelper;