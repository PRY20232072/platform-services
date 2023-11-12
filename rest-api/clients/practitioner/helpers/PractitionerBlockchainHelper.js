const { CommonBlockchainHelper } = require('../../common/helpers/CommonBlockchainHelper');
const { Constants } = require('../../common/Constants');

class PractitionerBlockchainHelper extends CommonBlockchainHelper {
    constructor() {
        super(
            Constants.PRACTITIONER_REGISTRY_TP_NAME,
            Constants.PRACTITIONER_REGISTRY_TP_CODE,
            Constants.PRACTITIONER_REGISTRY_TP_VERSION
        );
    }
}

module.exports.PractitionerBlockchainHelper = PractitionerBlockchainHelper;