const { InfuraIPFSClient } = require('../ipfs/InfuraIPFSClient');
const { PinataIPFSClient } = require('../ipfs/PinataIPFSClient');
const { IPFSClientStrategy } = require('../ipfs/IPFSClientStrategy');
const { ResponseObject } = require('../ResponseObject');                    

class CommonIPFSHelper {
    constructor() {
        this.ipfsClient = new IPFSClientStrategy(new PinataIPFSClient());
    }

    async getIPFSDataOfRegistry(registry) {        
        registry = registry.data;
        if (registry.ipfs_hash == undefined) {
            return new ResponseObject(registry);
        }
        
        var info = await this.ipfsClient.cat(registry.ipfs_hash);
        if (info.error) {
            return new ResponseObject(null, true);
        }

        return new ResponseObject(info.data);
    }

    async getIPFSDataOfRegistryList(registryList) {
        var data = [];
        var registries = registryList.data;
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            if (registry.ipfs_hash == undefined) {
                data.push(registry);
            }
            else {
                var info = await this.ipfsClient.cat(registry.ipfs_hash);
                if (info.error) {
                    return new ResponseObject(null, true);
                }
                data.push(info.data);
            }
        }

        return new ResponseObject(data);
    }
}

module.exports.CommonIPFSHelper = CommonIPFSHelper;