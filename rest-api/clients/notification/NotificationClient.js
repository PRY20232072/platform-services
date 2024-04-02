const { Constants } = require("../common/Constants");
const { UnauthorizedPatientError } = require("../common/errors/UnauthorizedPatientError");
const { UnauthorizedPractitionerError } = require("../common/errors/UnauthorizedPractitionerError");
const { NotificationRepositoryImpl } = require("./repositories/NotificationRepositoryImpl");
const { ResponseObject } = require("../common/ResponseObject");
const { NotificationHelper } = require("./helpers/NotificationHelper");

class NotificationClient {
    constructor() {
        this.NotificationRepository = new NotificationRepositoryImpl();
        this.NotificationHelper = new NotificationHelper();
    }

    async getNotificationById(notification_id, current_user) {
        try {
            const notification = await this.NotificationRepository.getNotificationById(notification_id);

            if (notification === null || notification === undefined) {
                throw new Error(Constants.NOTIFICATION_NOT_FOUND);
            }

            if (current_user.id !== notification.user_id) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            if (current_user.role === Constants.PATIENT) {
                return new ResponseObject(await this.NotificationHelper.parsePatientNotification(notification));
            }

            return new ResponseObject(await this.NotificationHelper.parsePractitionerNotification(notification));
        } catch (error) {
            throw error;
        }
    }

    async getNotificationListByUserId(user_id, current_user) {
        try {
            if (current_user.id !== user_id) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            let notificationList = await this.NotificationRepository.getNotificationListByUserId(user_id);

            if (current_user.role === Constants.PATIENT) {
                return new ResponseObject(await this.NotificationHelper.parsePatientNotificationList(notificationList));
            }

            return new ResponseObject(await this.NotificationHelper.parsePractitionerNotificationList(notificationList));
        } catch (error) {
            throw error;
        }
    }

    async getNotificationUnreadListByUserId(user_id, current_user) {
        try {
            if (current_user.id !== user_id) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            let notificationList = await this.NotificationRepository.getNotificationUnreadListByUserId(user_id);

            if (current_user.role === Constants.PATIENT) {
                return new ResponseObject(await this.NotificationHelper.parsePatientNotificationList(notificationList));
            }

            return new ResponseObject(await this.NotificationHelper.parsePractitionerNotificationList(notificationList));
        } catch (error) {
            throw error;
        }
    }

    async getNotificationReadListByUserId(user_id, current_user) {
        try {
            if (current_user.id !== user_id) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            let notificationList = await this.NotificationRepository.getNotificationReadListByUserId(user_id);

            if (current_user.role === Constants.PATIENT) {
                return new ResponseObject(await this.NotificationHelper.parsePatientNotificationList(notificationList));
            }

            return new ResponseObject(await this.NotificationHelper.parsePractitionerNotificationList(notificationList));
        } catch (error) {
            throw error;
        }
    }

    async createNotification(payload, current_user) {
        try {
            const type = payload.type;

            if (type === Constants.PERMISSION_READ || type === Constants.PERMISSION_WRITE) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                }
            } else if (type === Constants.PERMISSION_MESSAGE) {
                if (current_user.role === Constants.PRACTITIONER) {
                    throw new UnauthorizedPractitionerError();
                }
            }

            await this.NotificationRepository.createNotification(payload);

            return new ResponseObject(Constants.NOTIFICATION_CREATED_SUCCESSFULLY);
        } catch (error) {
            throw error;
        }
    }

    async updateNotification(notification_id, payload, current_user) {
        try {
            const notification = await this.NotificationRepository.getNotificationById(notification_id);

            if (notification === null || notification === undefined) {
                throw new Error(Constants.NOTIFICATION_NOT_FOUND);
            }

            if (current_user.id !== notification.user_id) {
                if (current_user.role === Constants.PATIENT) {
                    throw new UnauthorizedPatientError();
                } else {
                    throw new UnauthorizedPractitionerError();
                }
            }

            await this.NotificationRepository.updateNotification(notification_id, payload);

            return new ResponseObject(Constants.NOTIFICATION_UPDATED_SUCCESSFULLY);
        } catch (error) {
            throw error;
        }
    }
}

module.exports.NotificationClient = NotificationClient;
