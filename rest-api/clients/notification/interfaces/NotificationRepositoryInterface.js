const { Constants } = require("../../common/Constants");

class NotificationRepositoryInterface {
    getNotificationById(notification_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getNotificationListByUserId(user_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getNotificationUnreadListByUserId(user_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    getNotificationReadListByUserId(user_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    createNotification(payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    updateNotification(notification_id, payload) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }

    deleteNotification(notification_id) {
        throw new Error(Constants.ABSTRACT_METHOD_ERROR_MSG);
    }
}

module.exports.NotificationRepositoryInterface = NotificationRepositoryInterface;