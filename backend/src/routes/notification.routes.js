const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authenticateToken = require("../middleware/authenticateToken");
const { validateNotificationId } = require("../validators/notification.validator");

// Apply JWT authentication globally
router.use(authenticateToken);

router.get("/", notificationController.getUserNotifications);
router.get("/unread", notificationController.getUnreadNotifications);

router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", validateNotificationId, notificationController.markAsRead);

router.delete("/:id", validateNotificationId, notificationController.deleteNotification);

module.exports = router;
