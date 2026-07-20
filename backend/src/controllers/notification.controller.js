const notificationService = require("../services/notification.service");

async function getUserNotifications(req, res) {
    try {
        const userId = req.user.id;
        const result = await notificationService.getUserNotifications(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getUserNotifications:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getUnreadNotifications(req, res) {
    try {
        const userId = req.user.id;
        const result = await notificationService.getUnreadNotifications(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getUnreadNotifications:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function markAsRead(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const result = await notificationService.markAsRead(id, userId);
        res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: result,
        });
    } catch (error) {
        console.error("Error in markAsRead:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function markAllAsRead(req, res) {
    try {
        const userId = req.user.id;
        const result = await notificationService.markAllAsRead(userId);
        res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
            data: result,
        });
    } catch (error) {
        console.error("Error in markAllAsRead:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function deleteNotification(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.user.id;
        await notificationService.deleteNotification(id, userId);
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    getUserNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
