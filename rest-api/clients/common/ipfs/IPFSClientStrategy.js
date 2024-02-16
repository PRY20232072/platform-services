const { CryptoHelper } = require('../helpers/CryptoHelper');

/**
 * Represents a strategy for interacting with an IPFS client.
 */
class IPFSClientStrategy {
    constructor(client) {
        this.client = client;
    }

    async add(data) {
        // Encrypt the data before adding it to IPFS
        data = CryptoHelper.encrypt(data);

        // Add the encrypted data to IPFS
        const response = await this.client.add(data);

        if (response.error) {
            return response;
        }

        // Encrypt the IPFS hash before returning it
        const encryptedIpfsHash = CryptoHelper.encrypt(response.data);

        // Return the encrypted IPFS hash
        response.setData(encryptedIpfsHash);
        return response;
    }

    async cat(hash) {
        // Decrypt the IPFS hash before retrieving the data
        // hash = CryptoHelper.decrypt(hash);

        const response = await this.client.cat(hash);

        if (response.error) {
            return response;
        }

        // Decrypt the data retrieved from IPFS
        const data = CryptoHelper.decrypt(response.data);

        // Return the decrypted data
        response.setData(data);
        return response;
    }

    async rm(hash) {
        // Decrypt the IPFS hash before removing it
        hash = CryptoHelper.decrypt(hash);

        return await this.client.rm(hash);
    }
}

module.exports.IPFSClientStrategy = IPFSClientStrategy;