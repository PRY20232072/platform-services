const { Constants } = require('../common/Constants');
const { FilesIPFSHelper } = require('./helpers/FilesIPFSHelper');

class FilesClient {
    constructor() { 
        this.FilesIPFSHelper = new FilesIPFSHelper();
    }

    async uploadFile(file, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
            console.log(file);
            return await this.FilesIPFSHelper.uploadFile(file);
        } catch (error) {
            throw error;
        }
    }

    async getFile(hash) {
        try {
            return (await this.FilesIPFSHelper.getFile(hash)).data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.FilesClient = FilesClient;
