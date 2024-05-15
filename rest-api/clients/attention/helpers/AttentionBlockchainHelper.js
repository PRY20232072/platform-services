const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class AttentionBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.ATTENTION_REGISTRY_TP_NAME,
            Constants.ATTENTION_REGISTRY_TP_CODE,
            Constants.ATTENTION_REGISTRY_TP_VERSION
        );
    }
}

module.exports.AttentionBlockchainHelper = AttentionBlockchainHelper;