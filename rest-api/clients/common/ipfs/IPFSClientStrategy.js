/**
 * Represents a strategy for interacting with an IPFS client.
 */
class IPFSClientStrategy {
    constructor(client) {
        this.client = client;
    }

    async add(data) {
        return await this.client.add(data);
    }

    async cat(hash) {
        return await this.client.cat(hash);
    }

    async rm(hash) {
        return await this.client.rm(hash);
    }
}

module.exports.IPFSClientStrategy = IPFSClientStrategy;