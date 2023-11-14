const { CommonIPFSHelper } = require('../../common/helpers/CommonIPFSHelper');

class PatientIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async sentToIPFS(identifier, payload) {
        var response = await this.InfuraIPFSClient.add(payload);
    
        if (response.error) {
            return response;
        }

        var new_payload = {
            patient_id: identifier,
            ipfs_hash: response.hash
        };
        
        return new_payload;
    }
}

module.exports.PatientIPFSHelper = PatientIPFSHelper;