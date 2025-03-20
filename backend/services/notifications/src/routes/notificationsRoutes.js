const express = require("express");
const { fetchNotifications, readNotification } = require("../controllers/notificationsController");
const router = express.Router();

router.get("/", fetchNotifications);
router.patch("/:id/read", readNotification);

module.exports = router;