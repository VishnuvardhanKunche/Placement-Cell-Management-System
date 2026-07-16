const pool = require("../config/db");

async function createCoordinatorProfile(userId, departmentId, fullName, phone, client = pool) {
    const result = await client.query(
        `INSERT INTO department_coordinators (user_id, department_id, full_name, phone)
         VALUES ($1, $2, $3, $4)
         RETURNING user_id, department_id, full_name, phone`,
        [userId, departmentId, fullName, phone]
    );
    return result.rows[0];
}

async function getAllCoordinators() {
    const result = await pool.query(
        `SELECT dc.user_id, dc.department_id, dc.full_name, dc.phone,
                u.email, u.is_active, u.created_at, u.updated_at,
                d.code AS department_code, d.name AS department_name
         FROM department_coordinators dc
         JOIN users u ON dc.user_id = u.id
         JOIN departments d ON dc.department_id = d.id
         ORDER BY dc.full_name`
    );
    return result.rows;
}

async function getCoordinatorById(userId) {
    const result = await pool.query(
        `SELECT dc.user_id, dc.department_id, dc.full_name, dc.phone,
                u.email, u.is_active, u.created_at, u.updated_at,
                d.code AS department_code, d.name AS department_name
         FROM department_coordinators dc
         JOIN users u ON dc.user_id = u.id
         JOIN departments d ON dc.department_id = d.id
         WHERE dc.user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

async function getCoordinatorByDepartmentId(departmentId) {
    const result = await pool.query(
        "SELECT * FROM department_coordinators WHERE department_id = $1",
        [departmentId]
    );
    return result.rows[0] || null;
}

async function updateCoordinatorProfile(userId, fullName, phone, client = pool) {
    const result = await client.query(
        `UPDATE department_coordinators
         SET full_name = $2, phone = $3
         WHERE user_id = $1
         RETURNING *`,
        [userId, fullName, phone]
    );
    return result.rows[0];
}

module.exports = {
    createCoordinatorProfile,
    getAllCoordinators,
    getCoordinatorById,
    getCoordinatorByDepartmentId,
    updateCoordinatorProfile,
};
