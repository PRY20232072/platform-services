const { CommonAddressHelper } = require('../../common/helpers/CommonAddressHelper');
const { Constants } = require('../../common/Constants');

class ConsentAddressHelper extends CommonAddressHelper {
    constructor() {
        super(
            Constants.CONSENT_REGISTRY_TP_NAME,
            Constants.CONSENT_REGISTRY_TP_CODE,
            Constants.CONSENT_REGISTRY_TP_VERSION
        );
    }

    getAddress(identifier) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var addr = this.hash(identifier).substring(0, 22);
        return pref + this.TP_CODE + addr;
    }

    getAddresses(register_id, practitioner_id) {
        var registerPractitionerAddr = this.getRegisterPractitionerAddress(register_id, practitioner_id);
        var practitionerRegisterAddr = this.getPractitionerRegisterAddress(practitioner_id, register_id);
        return [registerPractitionerAddr, practitionerRegisterAddr];
    }

    getRegisterPractitionerAddress(register_id, practitioner_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var registerAddr = this.hash(register_id).substring(0, 22);
        var practitioner = this.hash(practitioner_id).substring(0, 40);
        return pref + this.TP_CODE + registerAddr + practitioner;
    }

    getPractitionerRegisterAddress(practitioner_id, register_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var practitionerAddr = this.hash(practitioner_id).substring(0, 22);
        var registerAddr = this.hash(register_id).substring(0, 40);
        return pref + this.TP_CODE + practitionerAddr + registerAddr;
    }
}

module.exports.ConsentAddressHelper = ConsentAddressHelper;