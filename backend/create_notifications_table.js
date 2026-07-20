const pool = require("./src/config/db");

async function createNotificationsTable() {
    try {
        await pool.query("BEGIN");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                recipient_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                notification_type VARCHAR(50) NOT NULL DEFAULT 'info',
                reference_type VARCHAR(50),
                reference_id INT,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);`);

        await pool.query("COMMIT");
        console.log("✅ Successfully created notifications table and indexes");
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("❌ Error creating notifications table:", error);
    } finally {
        await pool.end();
    }
}

createNotificationsTable();
