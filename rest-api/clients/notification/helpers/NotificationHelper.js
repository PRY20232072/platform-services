const { PractitionerRepositoryImpl } = require('../../practitioner/implementations/PractitionerRepositoryImpl');

class NotificationHelper {
    constructor() {
        this.PractitionerRepository = new PractitionerRepositoryImpl();
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
}

module.exports.NotificationHelper = NotificationHelper;
