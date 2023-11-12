const { createHash } = require('crypto');

class CommonAddressHelper {
    constructor(TP_NAME, TP_CODE, TP_VERSION) {
        this.TP_NAME = TP_NAME;
        this.TP_CODE = TP_CODE;
        this.TP_VERSION = TP_VERSION;
    }

    hash(v) {
        return createHash('sha512').update(v).digest('hex');
    }

    getAddressByTPName() {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        return pref + this.TP_CODE;
    }
}

module.exports.CommonAddressHelper = CommonAddressHelper;