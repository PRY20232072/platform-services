const { InfuraIPFSClient } = require('./InfuraIPFSClient');

class CommonClient {
    constructor() { 
        this.infuraIPFSClient = new InfuraIPFSClient();
    }
}

module.exports.CommonClient = CommonClient;