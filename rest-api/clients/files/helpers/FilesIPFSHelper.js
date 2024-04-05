const { CommonIPFSHelper } = require("../../common/helpers/CommonIPFSHelper");

class FilesIPFSHelper extends CommonIPFSHelper {
    constructor() {
        super();
    }

    async uploadFile(file) {
        try {
            const response = await this.ipfsClient.addFile(file);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getFile(hash) {
        try {
            const response = await this.ipfsClient.getFile(hash);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.FilesIPFSHelper = FilesIPFSHelper;
