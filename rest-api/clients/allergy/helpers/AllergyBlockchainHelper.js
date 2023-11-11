const { TextEncoder } = require('text-encoding/lib/encoding');
const { InfuraIPFSClient } = require('../../common/InfuraIPFSClient');
const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class AllergyBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.ALLERGY_REGISTRY_TP_NAME,
            Constants.ALLERGY_REGISTRY_TP_CODE,
            Constants.ALLERGY_REGISTRY_TP_VERSION
        );

        this.infuraIPFSClient = new InfuraIPFSClient();
    }

    async wrap_and_send(identifier, payload, address) {
        var enc = new TextEncoder('utf8');

        //TODO: encrypt payload

        var response = await this.infuraIPFSClient.add(payload);

        if (response.error) {
            return response;
        }

        //send object to blockchain like a string
        var new_payload = JSON.stringify({
            allergy_id: identifier,
            patient_id: payload.patient_id,
            ipfs_hash: response.hash,
            action: payload.action
        });

        var payloadBytes = enc.encode(new_payload);

        var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, address);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        response = await this.saveDataInBlockchain('/batches', txnBytes);
        
        //TODO: validate if response has info

        return response;
    }
}

module.exports.AllergyBlockchainHelper = AllergyBlockchainHelper;