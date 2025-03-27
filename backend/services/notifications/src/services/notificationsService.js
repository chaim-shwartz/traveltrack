const knex = require('../config/knex');

const getUserNotifications = async (userId) => {
    return await knex("notifications").where({ user_id: userId, is_read: false }).orderBy('created_at', 'desc');
};

const markNotificationAsRead = async (notificationId) => {
    return await Notification.query().patchAndFetchById(notificationId, { is_read: true });
};

module.exports = { getUserNotifications, markNotificationAsRead };