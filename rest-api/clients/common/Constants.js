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
    static PERMISSION_MESSAGE = 'MESSAGE';
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

    //ERROR MESSAGES
    static ERROR_FETCHING_FROM_BLOCKCHAIN = 'Error fetching data from blockchain';
    static ERROR_SAVING_TO_BLOCKCHAIN = 'Error saving data to blockchain';
    static ERROR_ADDING_TO_IPFS = 'Error adding data to IPFS';
    static ERROR_RETRIEVING_FROM_IPFS = 'Error retrieving data from IPFS';
    static ERROR_DELETING_FROM_IPFS = 'Error deleting data from IPFS';
    static ERROR_TO_GET_REGISTRY_BY_ID = 'Error to get the registry by id';
    static ERROR_TO_GET_REGISTRY_LIST = 'Error to get the registry list';
    static ERROR_CREATING_REGISTRY = 'Error creating the registry';
    static ERROR_UPDATING_REGISTRY = 'Error updating the registry';
    static ERROR_DELETING_REGISTRY = 'Error deleting the registry';
    static ERROR_CREATING_CONSENT = 'Error creating the consent';
    static ERROR_APPROVING_CONSENT = 'Error approving the consent';
    static ERROR_REVOKING_CONSENT = 'Error revoking the consent';
    static ERROR_FETCHING_CONSENT = 'Error fetching the consent';
    static ERROR_CONSENT_NOT_FOUND = 'Consent not found';
    static ERROR_CONNECTING_DATABASE = 'Error connecting to the database:';
    static ERROR_FETCHING_NOTIFICATION_BY_ID_FROM_DATABASE = 'Error fetching notification by id from database';
    static ERROR_FETCHING_NOTIFICATION_LIST_FROM_DATABASE = 'Error fetching notification list from database';
    static ERROR_CREATING_NOTIFICATION_IN_DATABASE = 'Error creating notification in database';
    static ERROR_UPDATING_NOTIFICATION_IN_DATABASE = 'Error updating notification in database';
    static ERROR_DELETING_NOTIFICATION_IN_DATABASE = 'Error deleting notification in database';
    static ERROR_UPLOADING_FILE = 'Error uploading file to IPFS';
    static ERROR_FETCHING_FILE_FROM_IPFS = 'Error fetching file from IPFS';
    static IPFS_HASH_NOT_FOUND = 'The IPFS hash is not found';
    static ABSTRACT_METHOD_ERROR_MSG = 'Abstract method must be implemented';

    //VALIDATE ACCESS MESSAGES
    static UNAUTHORIZED_PATIENT_MSG = 'The patient is not authorized to access to this resource';
    static UNAUTHORIZED_PRACTITIONER_MSG = 'The practitioner is not authorized to access to this resource';

    //Messages
    static REGISTRY_WITH_IDENTIFIER_DOES_NOT_EXIST = 'There is no allergy with this identifier';
    static DATABASE_CONNECTION_ESTABLISHED = 'Database connection established:';
    static NOTIFICATION_CREATED_SUCCESSFULLY = 'Notification created successfully';
    static NOTIFICATION_UPDATED_SUCCESSFULLY = 'Notification updated successfully';
    static NOTIFICATION_NOT_FOUND = 'Notification not found';
    static CONSENT_CREATED_SUCCESSFULLY = 'Consent created successfully';
    static CONSENT_REVOKE_SUCCESSFULLY = 'Consent revoked successfully';
    static PATIENT_HAS_APPROVED_CONSENT_TO_REGISTER = 'Patient has approved the consent for register: ';
    static PATIENT_HAS_REVOKED_CONSENT_TO_REGISTER = 'Patient has revoked the consent for register: ';
    static FILE_UPLOADED_SUCCESSFULLY = 'File uploaded successfully';
    static FILE_ALREADY_EXISTS = 'The file already exists';

    // Crypto
    static CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
    static CRYPTO_SECRET_SALT = process.env.CRYPTO_SECRET_SALT;
}

module.exports.Constants = Constants;