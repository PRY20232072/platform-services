const { InfuraIPFSClient } = require('../InfuraIPFSClient');

class CommonIPFSHelper {
    constructor() {
        this.InfuraIPFSClient = new InfuraIPFSClient();
    }

    async getIPFSDataOfRegistry(registry) {
        var response = {
            error: true,
            data: null
        }
        
        registry = registry.data;
        if (registry.ipfs_hash == undefined) {
            response.error = false;
            response.data = registry;
        }
        else {
            var info = await this.InfuraIPFSClient.cat(registry.ipfs_hash);
            if (info.error) {
                return response;
            }
            response.error = false;
            response.data = info.data;
        }

        return response;
    }

    async getIPFSDataOfRegistryList(registryList) {
        var response = {
            error: true,
            data: null
        }

        var data = [];
        var registries = registryList.data;
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            if (registry.ipfs_hash == undefined) {
                data.push(registry);
            }
            else {
                var info = await this.InfuraIPFSClient.cat(registry.ipfs_hash);
                if (info.error) {
                    return response;
                }
                data.push(info.data);
            }
        }
        response.error = false;
        response.data = data;

        return data;
    }
}

module.exports.CommonIPFSHelper = CommonIPFSHelper;