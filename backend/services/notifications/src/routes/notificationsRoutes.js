const express = require("express");
const { fetchNotifications, readNotification } = require("../controllers/notificationsController");
const authenticateJWT = require("../middleware/authenticateJWT");
const router = express.Router();

router.get("/", authenticateJWT, fetchNotifications);
router.patch("/:id/read", authenticateJWT, readNotification);

module.exports = router;