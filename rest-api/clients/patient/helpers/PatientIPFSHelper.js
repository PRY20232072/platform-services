const { CommonIPFSHelper } = require('../../common/helpers/CommonIPFSHelper');
const { ResponseObject } = require('../../common/ResponseObject');
const { CryptoHelper } = require('../../common/helpers/CryptoHelper');
const { Constants } = require('../../common/Constants');

class PatientIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async sentToIPFS(identifier, payload) {
        try {
            var response = await this.ipfsClient.add(payload);
    
            var new_payload = {
                patient_id: identifier,
                ipfs_hash: response.data
            };
            
            return new_payload;
        } catch (error) {
            throw error;
        }
    }

    async getIPFSDataOfRegistry(registry) {
        try {
            if (registry.ipfs_hash == undefined) {
                throw new Error(Constants.IPFS_HASH_NOT_FOUND);
            }
    
            const ipfs_hash = CryptoHelper.decrypt(registry.ipfs_hash);
            var info = await this.ipfsClient.cat(ipfs_hash);
    
            return new ResponseObject({
                ...info.data,
                permissions: registry.permissions
            })
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
                    info.data.permissions = registry.permissions;
                    data.push(info.data);
                }
            }
    
            return new ResponseObject(data);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.PatientIPFSHelper = PatientIPFSHelper;