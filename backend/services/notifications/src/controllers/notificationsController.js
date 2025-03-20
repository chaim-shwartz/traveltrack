const { getUserNotifications, markNotificationAsRead } = require("../services/notificationsService");

const fetchNotifications = async (req, res) => {
    try {
        const notifications = await getUserNotifications(req.user.id);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

const readNotification = async (req, res) => {
    try {
        const updatedNotification = await markNotificationAsRead(req.params.id);
        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
};

module.exports = { fetchNotifications, readNotification };