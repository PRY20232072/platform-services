const { Constants } = require("../../common/Constants");
const { NotificationRepositoryImpl } = require("../../notification/repositories/NotificationRepositoryImpl");
const { PractitionerRepositoryImpl } = require("../../practitioner/implementations/PractitionerRepositoryImpl");

class ConsentHelper {
    constructor() {
        this.NotificationRepository = new NotificationRepositoryImpl();
        this.PractitionerRepository = new PractitionerRepositoryImpl();
    }

    async createNotificationToPractitioner(patient_id, practitioner_id, message) {
        try {
            const notification = {
                'user_id': patient_id,
                'patient_id': practitioner_id,
                'type': Constants.PERMISSION_MESSAGE,
                'message': message,
            };
            await this.NotificationRepository.createNotification(notification);
        } catch (error) {
            throw error;
        }
    }

    async parseConsentList(consentList) {
        try {
            return await Promise.all(consentList.map(async (consent) => {
                var practitioner = await this.PractitionerRepository.getPractitionerById(consent.practitioner_id);
                practitioner = practitioner.data;

                return {
                    id: consent.register_id + consent.practitioner_id,
                    register_id: consent.register_id,
                    register_type: consent.register_type,
                    practitioner_id: consent.practitioner_id,
                    practitioner_name: practitioner.name_id,
                }
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports.ConsentHelper = ConsentHelper;
