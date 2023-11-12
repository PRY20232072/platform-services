const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class AllergyBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.ALLERGY_REGISTRY_TP_NAME,
            Constants.ALLERGY_REGISTRY_TP_CODE,
            Constants.ALLERGY_REGISTRY_TP_VERSION
        );
    }
}

module.exports.AllergyBlockchainHelper = AllergyBlockchainHelper;