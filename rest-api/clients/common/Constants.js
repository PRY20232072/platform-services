require('dotenv').config();

class Constants {
    //ALLERGY REGISTRY
    static ALLERGY_REGISTRY_TP_NAME = 'allergy-processor';
    static ALLERGY_REGISTRY_TP_CODE = '01';
    static ALLERGY_REGISTRY_TP_VERSION = '1.0';

    //PATIENT REGISTRY
    static PATIENT_REGISTRY_TP_NAME = 'patient-processor';
    static PATIENT_REGISTRY_TP_CODE = '02';
    static PATIENT_REGISTRY_TP_VERSION = '1.0';

    //CONSENT REGISTRY
    static CONSENT_REGISTRY_TP_NAME = 'consent-processor';
    static CONSENT_REGISTRY_TP_CODE = '03';
    static CONSENT_REGISTRY_TP_VERSION = '1.0';

    //PRACTITIONER REGISTRY
    static PRACTITIONER_REGISTRY_TP_NAME = 'practitioner-processor';
    static PRACTITIONER_REGISTRY_TP_CODE = '04';
    static PRACTITIONER_REGISTRY_TP_VERSION = '1.0';

    //FAMILY HISTORY REGISTRY
    static FAMILY_HISTORY_REGISTRY_TP_NAME = 'family-history-processor';
    static FAMILY_HISTORY_REGISTRY_TP_CODE = '05';
    static FAMILY_HISTORY_REGISTRY_TP_VERSION = '1.0';

    // REGISTRY TYPES
    static ALLERGY = 'ALLERGY';
    static FAMILY_HISTORY = 'FAMILY_HISTORY';

    //SAWTOOTH REST API
    static SAWTOOTH_REST_API_URL = process.env.SAWTOOTH_REST_API_URL;

    //ACTIONS
    static ACTION_CREATE = 'CREATE';
    static ACTION_APPROVE = 'APPROVE'
    static ACTION_UPDATE = 'UPDATE';
    static ACTION_DELETE = 'DELETE';
    static ACTION_REVOKE = 'REVOKE';

    //USERS ROLES
    static PATIENT = 'patient';
    static PRACTITIONER = 'practitioner';

    //PERMISSIONS
    static PERMISSION_READ = 'READ';
    static PERMISSION_WRITE = 'WRITE';
    static PERMISSION_DELETE = 'DELETE';

    //CONSENT STATUS
    static CONSENT_ACTIVE = 'ACTIVE';
    static CONSENT_PENDING = 'PENDING';

    //IPFS INFURA
    static IPFS_INFURA_URL = process.env.IPFS_INFURA_URL;
    static IPFS_INFURA_PROTOCOL = process.env.IPFS_INFURA_PROTOCOL;
    static IPFS_INFURA_HOST = process.env.IPFS_INFURA_HOST;
    static IPFS_INFURA_PORT = process.env.IPFS_INFURA_PORT;
    static IPFS_INFURA_API_KEY = process.env.IPFS_INFURA_API_KEY;
    static IPFS_INFURA_API_KEY_SECRET = process.env.IPFS_INFURA_API_KEY_SECRET;

    //IPFS PINATA
    static IPFS_PINATA_GATEWAY_URL = process.env.IPFS_PINATA_GATEWAY_URL;
    static IPFS_PINATA_JWT_KEY = process.env.IPFS_PINATA_JWT_KEY;

    //VALIDATE ACCESS MESSAGES
    static ACCESS_DENIED_PATIENT_MSG = 'The patient has no permission to access this allergy';
    static ACCESS_DENIED_PRACTITIONER_MSG = 'The practitioner has no permission to access this allergy';
    static ACCESS_GRANTED_PATIENT_MSG = 'The patient has permission to access this allergy';
    static ACCESS_GRANTED_PRACTITIONER_MSG = 'The practitioner has permission to access this allergy';
    static PATIENT_CANNOT_GET_ALLERGY_LIST = 'The patient cannot get the allergy list';
    static PATIENT_CANNOT_GET_FAMILY_HISTORY_LIST = 'The patient cannot get the family history list';
    static PATIENT_CANNOT_CREATE_A_REGISTRY = 'The patient cannot create a registry';
    //Messages
    static REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST = 'There is no allergy with this identifier';

    // Crypto
    static CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
    static CRYPTO_SECRET_SALT = process.env.CRYPTO_SECRET_SALT;
}

module.exports.Constants = Constants;