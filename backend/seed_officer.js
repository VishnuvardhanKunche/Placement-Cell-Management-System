const pool = require("./src/config/db");
const bcrypt = require("bcrypt");

async function seed() {
    try {
        const email = "tpo@college.edu";
        const password = "tpoPassword123";
        const hash = await bcrypt.hash(password, 10);
        
        await pool.query("BEGIN");
        
        const userRes = await pool.query(
            "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'placement_officer') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash RETURNING id",
            [email, hash]
        );
        const userId = userRes.rows[0].id;
        
        await pool.query(
            "INSERT INTO placement_officers (user_id, full_name, phone) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone",
            [userId, "TPO Admin", "1234567890"]
        );
        
        await pool.query("COMMIT");
        console.log("✅ Seeded Placement Officer successfully");
    } catch (e) {
        await pool.query("ROLLBACK");
        console.error("❌ Seeding failed:", e);
    } finally {
        await pool.end();
    }
}
seed();
