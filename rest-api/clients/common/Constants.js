class Constants {
    //ALLERGY REGISTRY FAMILY
    static ALLERGY_REGISTRY_TP_NAME = 'allergy-processor';
    static ALLERGY_REGISTRY_TP_CODE = '01';
    static ALLERGY_REGISTRY_TP_VERSION = '1.0';

    //SAWTOOTH REST API
    static SAWTOOTH_REST_API_URL = 'http://localhost:8008';

    //ACTIONS
    static ACTION_CREATE = 'CREATE';
    static ACTION_UPDATE = 'UPDATE';
    static ACTION_DELETE = 'DELETE';

    //IPFS INFURA
    static IPFS_INFURA_URL = 'https://ipfs.infura.io:5001/api/v0';
    static IPFS_INFURA_PROTOCOL = 'https';
    static IPFS_INFURA_HOST = 'ipfs.infura.io';
    static IPFS_INFURA_PORT = '5001';
    static IPFS_INFURA_API_KEY = '2XEndWqaClJmMVzOkdFiwJLXvHC';
    static IPFS_INFURA_API_KEY_SECRET = 'de5a46a82e7cee86e579d6403aac259a';
}

module.exports.Constants = Constants;