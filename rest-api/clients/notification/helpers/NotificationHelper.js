const { PractitionerRepositoryImpl } = require('../../practitioner/implementations/PractitionerRepositoryImpl');
const { PatientRepositoryImpl } = require('../../patient/implementations/PatientRepositoryImpl');

class NotificationHelper {
    constructor() {
        this.PractitionerRepository = new PractitionerRepositoryImpl();
        this.PatientRepository = new PatientRepositoryImpl();
    }

    async parsePatientNotification(notification) {
        const response = await this.PractitionerRepository.getPractitionerById(notification.practitioner_id);
        const practitioner = response.data;

        return {
            id: notification.id,
            created_at: notification.created_at,
            register_id: notification.register_id,
            register_type: notification.register_type,
            type: notification.type,
            practitioner_id: notification.practitioner_id,
            practitioner_name: practitioner.name_id,
        }
    }

    async parsePatientNotificationList(notifications) {
        return await Promise.all(notifications.map(async notification => {
            const response = await this.PractitionerRepository.getPractitionerById(notification.practitioner_id);
            const practitioner = response.data;

            return {
                id: notification.id,
                userId: notification.user_id,
                practitioner_name: practitioner.name_id,
                register_id: notification.register_id,
                register_type: notification.register_type,
                type: notification.type,
                created_at: notification.created_at,
            };
        }));
    }

    async parsePractitionerNotification(notification) {
        const response = await this.PatientRepository.getPatientById(notification.patient_id);
        const patient = response.data;

        return {
            id: notification.id,
            created_at: notification.created_at,
            patient_id: notification.patient_id,
            patient_name: patient.name_id,
            message: notification.message,
        }
    }

    async parsePractitionerNotificationList(notifications) {
        return await Promise.all(notifications.map(async notification => {
            const response = await this.PatientRepository.getPatientById(notification.patient_id);
            const patient = response.data;

            return {
                id: notification.id,
                userId: notification.user_id,
                patient_name: patient.name_id,
                message: notification.message,
                created_at: notification.created_at,
            };
        }));
    }
}

module.exports.NotificationHelper = NotificationHelper;
