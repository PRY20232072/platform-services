const { CommonIPFSHelper } = require('../../common/helpers/CommonIPFSHelper');
const { ResponseObject } = require('../../common/ResponseObject');

class PatientIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async sentToIPFS(identifier, payload) {
        var response = await this.ipfsClient.add(payload);
    
        if (response.error) {
            return response;
        }

        var new_payload = {
            patient_id: identifier,
            ipfs_hash: response.data
        };
        
        return new_payload;
    }

    async getIPFSDataOfRegistry(registry) {
        if (registry.ipfs_hash == undefined) {
            return new ResponseObject(registry);
        }

        var info = await this.ipfsClient.cat(registry.ipfs_hash);
        if (info.error) {
            return new ResponseObject(null, true);
        }

        return new ResponseObject({
            ...info.data,
            permissions: registry.permissions
        })
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
                info.data.permissions = registry.permissions;
                data.push(info.data);
            }
        }

        return new ResponseObject(data);
    }
}

module.exports.PatientIPFSHelper = PatientIPFSHelper;