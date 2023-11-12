const { TextEncoder } = require('text-encoding/lib/encoding');
const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class ConsentBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.CONSENT_REGISTRY_TP_NAME,
            Constants.CONSENT_REGISTRY_TP_CODE,
            Constants.CONSENT_REGISTRY_TP_VERSION
        );
    }

    async wrap_and_send(payload, addresses) {
        var enc = new TextEncoder('utf8');

        //TODO: encrypt payload

        //send object to blockchain like a string
        payload = JSON.stringify(payload);
        var payloadBytes = enc.encode(payload);

        var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, addresses);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        var response = await this.saveDataInBlockchain('/batches', txnBytes);
        
        //TODO: validate if response has info

        return response;
    }
}

module.exports.ConsentBlockchainHelper = ConsentBlockchainHelper;