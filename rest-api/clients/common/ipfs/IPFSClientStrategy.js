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
        try {
            const response = await this.client.add(data);

            // Encrypt the IPFS hash before returning it
            const encryptedIpfsHash = CryptoHelper.encrypt(response.data);

            // Return the encrypted IPFS hash
            response.setData(encryptedIpfsHash);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addFile(file) {
        // Add the file to IPFS
        try {
            const response = await this.client.addFile(file);

            // Encrypt the IPFS hash before returning it
            // const encryptedIpfsHash = CryptoHelper.encrypt(response.data);

            // Return the encrypted IPFS hash
            // response.setData(encryptedIpfsHash);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getFile(hash) {
        try {
            const response = await this.client.getFile(hash);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async cat(hash) {
        // Decrypt the IPFS hash before retrieving the data
        // hash = CryptoHelper.decrypt(hash);

        try {
            const response = await this.client.cat(hash);

            // Decrypt the data retrieved from IPFS
            const data = CryptoHelper.decrypt(response.data);

            // Return the decrypted data
            response.setData(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async rm(hash) {
        // Decrypt the IPFS hash before removing it
        try {
            hash = CryptoHelper.decrypt(hash);
    
            return await this.client.rm(hash);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.IPFSClientStrategy = IPFSClientStrategy;