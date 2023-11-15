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
}

module.exports.ConsentBlockchainHelper = ConsentBlockchainHelper;