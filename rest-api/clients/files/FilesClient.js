const { Constants } = require('../common/Constants');
const { FilesIPFSHelper } = require('./helpers/FilesIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { AllergyRepositoryImpl } = require('../allergy/implementations/AllergyRepositoryImpl');
const { FamilyHistoryRepositoryImpl } = require('../family/implementations/FamilyHistoryRepositoryImpl');
const { ResponseObject } = require('../common/ResponseObject');

class FilesClient {
    constructor() { 
        this.FilesIPFSHelper = new FilesIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.AllergyRepository = new AllergyRepositoryImpl();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
    }

    async uploadFile(file, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }
            
            // Validate access
            const accessControlResponse = await this.ConsentValidatorHelper.validateAccess(payload.register_id, current_user, Constants.PERMISSION_READ, payload.register_type);

            if (!accessControlResponse) {
                throw new UnauthorizedPractitionerError();
            }

            const hash = await this.FilesIPFSHelper.uploadFile(file);

            let register = null;

            // Get the register
            if (payload.register_type === Constants.ALLERGY) {
                register = (await this.AllergyRepository.getAllergyById(payload.register_id)).data[0];
            } else {
                register = (await this.FamilyHistoryRepository.getFamilyHistoryById(payload.register_id)).data[0];
            }

            // If the register does not have files, create an empty array
            if (register.files === undefined || register.files === null) {
                register.files = [];
            } else {
                // Check if the file already exists
                const fileExists = register.files.find(file => file.hash === hash);
                if (fileExists) {
                    return new ResponseObject(Constants.FILE_ALREADY_EXISTS);
                }
            }

            // Add the new file to the register
            register.files.push({
                hash: hash,
                file_name: payload.file_name,
                file_type: payload.file_type,
                created_date: payload.created_date,
                practitioner_id: current_user.id,
                practitioner_name: current_user.name
            });

            // Update the register
            if (payload.register_type === Constants.ALLERGY) {
                await this.AllergyRepository.updateAllergy(payload.register_id, register);
            } else {
                await this.FamilyHistoryRepository.updateFamilyHistory(payload.register_id, register);
            }

            return new ResponseObject(Constants.FILE_UPLOADED_SUCCESSFULLY);
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
