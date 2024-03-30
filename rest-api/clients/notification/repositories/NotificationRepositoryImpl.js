const { Constants } = require("../../common/Constants");
const { DatabaseManager } = require("../../common/database/DatabaseManager");
const { CustomError } = require("../../common/errors/CustomError");
const { Notification } = require("../entities/Notification.entity");
const { NotificationRepositoryInterface } = require("../interfaces/NotificationRepositoryInterface");

class NotificationRepositoryImpl extends NotificationRepositoryInterface {
    constructor() {
        super();
        this.DatabaseManager = new DatabaseManager();
    }

    async getNotificationById(notification_id) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notification = await connection.getRepository(Notification).findOne(notification_id);
            return notification;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_NOTIFICATION_BY_ID_FROM_DATABASE,
                error.message
            );
        }
    }

    async getNotificationListByUserId(user_id) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notificationList = await connection.getRepository(Notification).find({ user_id: user_id });
            return notificationList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_NOTIFICATION_LIST_FROM_DATABASE,
                error.message
            );
        }
    }

    async getNotificationUnreadListByUserId(user_id) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notificationList = await connection.getRepository(Notification).find({ user_id: user_id, read: false });
            return notificationList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_NOTIFICATION_LIST_FROM_DATABASE,
                error.message
            );
        }
    }

    async getNotificationReadListByUserId(user_id) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notificationList = await connection.getRepository(Notification).find({ user_id: user_id, read: true });
            return notificationList;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_NOTIFICATION_LIST_FROM_DATABASE,
                error.message
            );
        }
    }

    async createNotification(payload) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notification = {};
            notification.user_id = payload.user_id;
            notification.patient_id = payload.patient_id || null;
            notification.practitioner_id = payload.practitioner_id || null;
            notification.register_id = payload.register_id || null;
            notification.register_type = payload.register_type || null;
            notification.type = payload.type;
            notification.message = payload.message || null;
            notification.read = false;
            const savedNotification = await connection.getRepository(Notification).save(notification);
            return savedNotification;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_CREATING_NOTIFICATION_IN_DATABASE,
                error.message
            );
        }
    }

    async updateNotification(notification_id, payload) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            const notification = await connection.getRepository(Notification).findOne(notification_id);
            notification.read = payload.read;
            const updatedNotification = await connection.getRepository(Notification).save(notification);
            return updatedNotification;
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_UPDATING_NOTIFICATION_IN_DATABASE,
                error.message
            );
        }
    }

    async deleteNotification(notification_id) {
        try {
            const connection = await this.DatabaseManager.getConnection();
            await connection.getRepository(Notification).delete({ id: notification_id });
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_DELETING_NOTIFICATION_IN_DATABASE,
                error.message
            );
        }
    }
}

module.exports.NotificationRepositoryImpl = NotificationRepositoryImpl;
