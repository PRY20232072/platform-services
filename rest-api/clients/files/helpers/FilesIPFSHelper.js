const { Constants } = require("../../common/Constants");
const { CustomError } = require("../../common/errors/CustomError");
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
            throw new CustomError(Constants.ERROR_UPLOADING_FILE, error.message);
        }
    }

    async getFile(hash) {
        try {
            const response = await this.ipfsClient.getFile(hash);
            return response;
        } catch (error) {
            throw new CustomError(Constants.ERROR_FETCHING_FILE_FROM_IPFS, error.message);
        }
    }
}

module.exports.FilesIPFSHelper = FilesIPFSHelper;
