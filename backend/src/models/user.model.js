const pool = require("../config/db");

async function getUserByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email]
    );
    return result.rows[0] || null;
}

async function createUser(email, passwordHash, role, client = pool) {
    const result = await client.query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, is_active, created_at, updated_at",
        [email, passwordHash, role]
    );
    return result.rows[0];
}

async function getUserById(id) {
    const result = await pool.query(
        "SELECT id, email, role, is_active, created_at, updated_at FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0] || null;
}

async function getUserProfileByIdAndRole(id, role) {
    let query = "";
    if (role === "student") {
        query = `
            SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                   s.roll_number, s.full_name, s.department_id, s.phone, s.cgpa, s.backlogs, s.graduation_year, s.resume_path, s.is_verified, s.verified_by_coordinator_id
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            WHERE u.id = $1
        `;
    } else if (role === "company") {
        query = `
            SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                   c.name, c.industry, c.website, c.description, c.contact_person, c.contact_email, c.contact_phone, c.is_approved, c.approved_by_officer_id
            FROM users u
            LEFT JOIN companies c ON u.id = c.user_id
            WHERE u.id = $1
        `;
    } else if (role === "department_coordinator") {
        query = `
            SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                   dc.department_id, dc.full_name, dc.phone
            FROM users u
            LEFT JOIN department_coordinators dc ON u.id = dc.user_id
            WHERE u.id = $1
        `;
    } else if (role === "placement_officer") {
        query = `
            SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
                   po.full_name, po.phone
            FROM users u
            LEFT JOIN placement_officers po ON u.id = po.user_id
            WHERE u.id = $1
        `;
    } else {
        return null;
    }
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}

module.exports = {
    getUserByEmail,
    createUser,
    getUserById,
    getUserProfileByIdAndRole,
};
