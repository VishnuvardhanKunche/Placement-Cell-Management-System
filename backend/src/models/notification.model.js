const pool = require("../config/db");

async function createNotification(
    recipientUserId,
    title,
    message,
    notificationType = "info",
    referenceType = null,
    referenceId = null,
    client = pool
) {
    const result = await client.query(
        `INSERT INTO notifications (
            recipient_user_id, title, message, notification_type, reference_type, reference_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [recipientUserId, title, message, notificationType, referenceType, referenceId]
    );
    return result.rows[0];
}

async function getNotificationsByRecipient(recipientUserId) {
    const result = await pool.query(
        `SELECT * FROM notifications
         WHERE recipient_user_id = $1
         ORDER BY created_at DESC`,
        [recipientUserId]
    );
    return result.rows;
}

async function getUnreadNotificationsByRecipient(recipientUserId) {
    const result = await pool.query(
        `SELECT * FROM notifications
         WHERE recipient_user_id = $1 AND is_read = FALSE
         ORDER BY created_at DESC`,
        [recipientUserId]
    );
    return result.rows;
}

async function getNotificationById(id) {
    const result = await pool.query(
        `SELECT * FROM notifications WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function markAsRead(id, recipientUserId) {
    const result = await pool.query(
        `UPDATE notifications
         SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND recipient_user_id = $2
         RETURNING *`,
        [id, recipientUserId]
    );
    return result.rows[0] || null;
}

async function markAllAsRead(recipientUserId) {
    const result = await pool.query(
        `UPDATE notifications
         SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE recipient_user_id = $1 AND is_read = FALSE
         RETURNING id`,
        [recipientUserId]
    );
    return result.rowCount;
}

async function deleteNotification(id, recipientUserId) {
    const result = await pool.query(
        `DELETE FROM notifications
         WHERE id = $1 AND recipient_user_id = $2
         RETURNING id`,
        [id, recipientUserId]
    );
    return result.rowCount > 0;
}

async function getAllUserIdsByRole(role) {
    const result = await pool.query(
        `SELECT id FROM users WHERE role = $1 AND is_active = TRUE`,
        [role]
    );
    return result.rows.map((row) => row.id);
}

module.exports = {
    createNotification,
    getNotificationsByRecipient,
    getUnreadNotificationsByRecipient,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getAllUserIdsByRole,
};
