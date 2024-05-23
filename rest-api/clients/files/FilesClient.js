const { Constants } = require('../common/Constants');
const { FilesIPFSHelper } = require('./helpers/FilesIPFSHelper');
const { ConsentValidatorHelper } = require("../common/helpers/ConsentValidatorHelper");
const { UnauthorizedPatientError } = require('../common/errors/UnauthorizedPatientError');
const { UnauthorizedPractitionerError } = require('../common/errors/UnauthorizedPractitionerError');
const { AllergyRepositoryImpl } = require('../allergy/implementations/AllergyRepositoryImpl');
const { FamilyHistoryRepositoryImpl } = require('../family/implementations/FamilyHistoryRepositoryImpl');
const { PatientRepositoryImpl } = require('../patient/implementations/PatientRepositoryImpl');
const { ResponseObject } = require('../common/ResponseObject');

class FilesClient {
    constructor() {
        this.FilesIPFSHelper = new FilesIPFSHelper();
        this.ConsentValidatorHelper = new ConsentValidatorHelper();
        this.AllergyRepository = new AllergyRepositoryImpl();
        this.FamilyHistoryRepository = new FamilyHistoryRepositoryImpl();
        this.PatientRepository = new PatientRepositoryImpl();
    }

    async uploadFile(file, payload, current_user) {
        try {
            if (current_user.role === Constants.PATIENT) {
                throw new UnauthorizedPatientError();
            }

            // Validate access
            await this.ConsentValidatorHelper.validateAccess(current_user, payload.patient_id);

            // Upload the file to IPFS
            const hash = await this.FilesIPFSHelper.uploadFile(file);

            // Get patient
            const getPatientResponse = await this.PatientRepository.getPatientById(payload.patient_id);
            const patient = getPatientResponse.data;

            // If the patient does not have files, create an empty array
            if (patient.files === undefined || patient.files === null) {
                patient.files = [];
            } else {
                // Check if the file already exists
                const fileExists = patient.files.find(file => file.hash === hash);
                if (fileExists) {
                    return new ResponseObject(Constants.FILE_ALREADY_EXISTS);
                }
            }

            // Add the new file to the patient
            patient.files.push({
                hash: hash,
                file_name: payload.file_name,
                file_type: payload.file_type,
                created_date: payload.created_date,
                practitioner_id: current_user.id,
                practitioner_name: current_user.name
            });

            // Update the patient
            await this.PatientRepository.updatePatient(payload.patient_id, patient);

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
