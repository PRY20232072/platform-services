const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class FamilyHistoryBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.FAMILY_HISTORY_REGISTRY_TP_NAME,
            Constants.FAMILY_HISTORY_REGISTRY_TP_CODE,
            Constants.FAMILY_HISTORY_REGISTRY_TP_VERSION
        );
    }
}

module.exports.FamilyHistoryBlockchainHelper = FamilyHistoryBlockchainHelper;