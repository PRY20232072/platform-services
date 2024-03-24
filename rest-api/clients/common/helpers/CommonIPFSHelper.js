const { InfuraIPFSClient } = require('../ipfs/InfuraIPFSClient');
const { PinataIPFSClient } = require('../ipfs/PinataIPFSClient');
const { IPFSClientStrategy } = require('../ipfs/IPFSClientStrategy');
const { ResponseObject } = require('../ResponseObject');
const { CryptoHelper } = require('./CryptoHelper');
const { Constants } = require('../Constants');
require('dotenv').config();

class CommonIPFSHelper {
    constructor() {
        if (process.env.IPFS_CLIENT == 'PINATA') {
            this.ipfsClient = new IPFSClientStrategy(new PinataIPFSClient());
        }
        else {
            this.ipfsClient = new IPFSClientStrategy(new InfuraIPFSClient());
        }
    }

    async getIPFSDataOfRegistry(registry) {
        try {
            registry = registry.data;
            if (registry.ipfs_hash == undefined) {
                throw new Error(Constants.IPFS_HASH_NOT_FOUND);
            }

            const ipfs_hash = CryptoHelper.decrypt(registry.ipfs_hash);

            const info = await this.ipfsClient.cat(ipfs_hash);
            return new ResponseObject(info.data);
        } catch (error) {
            throw error;
        }
    }

    async getIPFSDataOfRegistryList(registryList) {
        try {
            var data = [];
            var registries = registryList.data;
            for (var i = 0; i < registries.length; i++) {
                var registry = registries[i];
                if (registry.ipfs_hash == undefined) {
                    data.push(registry);
                }
                else {
                    const ipfs_hash = CryptoHelper.decrypt(registry.ipfs_hash);
                    var info = await this.ipfsClient.cat(ipfs_hash);
                    data.push(info.data);
                }
            }

            return new ResponseObject(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.CommonIPFSHelper = CommonIPFSHelper;