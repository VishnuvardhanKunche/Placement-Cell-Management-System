const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });
const pool = require("../backend/src/config/db");

async function updateEnum() {
    try {
        await pool.query("ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'withdrawn'");
        console.log("✅ Successfully updated application_status ENUM to include 'withdrawn'");
    } catch (error) {
        console.error("❌ Error updating ENUM:", error);
    } finally {
        await pool.end();
    }
}

updateEnum();
