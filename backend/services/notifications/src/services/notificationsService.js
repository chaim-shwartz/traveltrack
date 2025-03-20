const Notification = require("../models/Notification");

const getUserNotifications = async (userId) => {
    return await Notification.query().where({ user_id: userId, is_read: false });
};

const markNotificationAsRead = async (notificationId) => {
    return await Notification.query().patchAndFetchById(notificationId, { is_read: true });
};

module.exports = { getUserNotifications, markNotificationAsRead };