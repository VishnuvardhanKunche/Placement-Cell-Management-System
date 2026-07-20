const pool = require("./src/config/db");

async function createOffersTable() {
    try {
        await pool.query("BEGIN");

        // 1. Create ENUM type if not exists
        await pool.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
                    CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected');
                END IF;
            END $$;
        `);

        // 2. Create offers table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offers (
                id SERIAL PRIMARY KEY,
                application_id INT NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
                offer_letter_details TEXT,
                salary_offered_lpa NUMERIC(5,2) NOT NULL DEFAULT 0.00,
                joining_date DATE,
                status offer_status NOT NULL DEFAULT 'pending',
                created_by_officer_id INT REFERENCES placement_officers(user_id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Create indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_offers_application ON offers(application_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);`);

        await pool.query("COMMIT");
        console.log("✅ Successfully created offers table and offer_status ENUM");
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("❌ Error creating offers table:", error);
    } finally {
        await pool.end();
    }
}

createOffersTable();
