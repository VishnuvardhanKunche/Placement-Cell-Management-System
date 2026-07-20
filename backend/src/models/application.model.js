const pool = require("../config/db");

async function createApplication(studentId, driveId, client = pool) {
    const result = await client.query(
        `INSERT INTO applications (student_id, drive_id, status)
         VALUES ($1, $2, 'applied')
         RETURNING id, student_id, drive_id, status, applied_at`,
        [studentId, driveId]
    );
    return result.rows[0];
}

async function getApplicationById(applicationId) {
    const result = await pool.query(
        `SELECT a.id, a.student_id, a.drive_id, a.status, a.feedback, a.applied_at, a.updated_at,
                s.roll_number, s.full_name AS student_name, s.phone AS student_phone, s.cgpa, s.backlogs, s.graduation_year,
                u.email AS student_email,
                d.code AS department_code, d.name AS department_name,
                pd.title AS drive_title, pd.job_role, pd.job_location, pd.salary_lpa,
                c.name AS company_name
         FROM applications a
         JOIN students s ON a.student_id = s.user_id
         JOIN users u ON s.user_id = u.id
         JOIN departments d ON s.department_id = d.id
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.id = $1`,
        [applicationId]
    );
    return result.rows[0] || null;
}

async function getStudentApplications(studentId) {
    const result = await pool.query(
        `SELECT a.id, a.drive_id, a.status, a.applied_at, a.updated_at,
                pd.title AS drive_title, pd.job_role, pd.job_location, pd.salary_lpa,
                c.name AS company_name
         FROM applications a
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.student_id = $1
         ORDER BY a.applied_at DESC`,
        [studentId]
    );
    return result.rows;
}

async function getStudentApplicationByDriveId(studentId, driveId) {
    const result = await pool.query(
        `SELECT * FROM applications WHERE student_id = $1 AND drive_id = $2`,
        [studentId, driveId]
    );
    return result.rows[0] || null;
}

async function getAllApplications() {
    const result = await pool.query(
        `SELECT a.id, a.student_id, a.drive_id, a.status, a.feedback, a.applied_at, a.updated_at,
                s.roll_number, s.full_name AS student_name, s.phone AS student_phone, s.cgpa, s.backlogs,
                u.email AS student_email,
                d.code AS department_code, d.name AS department_name,
                pd.title AS drive_title,
                c.name AS company_name
         FROM applications a
         JOIN students s ON a.student_id = s.user_id
         JOIN users u ON s.user_id = u.id
         JOIN departments d ON s.department_id = d.id
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         ORDER BY a.applied_at DESC`
    );
    return result.rows;
}

async function getApplicationsByDriveId(driveId) {
    const result = await pool.query(
        `SELECT a.id, a.student_id, a.drive_id, a.status, a.feedback, a.applied_at, a.updated_at,
                s.roll_number, s.full_name AS student_name, s.phone AS student_phone, s.cgpa, s.backlogs,
                u.email AS student_email,
                d.code AS department_code, d.name AS department_name,
                pd.title AS drive_title,
                c.name AS company_name
         FROM applications a
         JOIN students s ON a.student_id = s.user_id
         JOIN users u ON s.user_id = u.id
         JOIN departments d ON s.department_id = d.id
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.drive_id = $1
         ORDER BY a.applied_at DESC`,
        [driveId]
    );
    return result.rows;
}

async function updateApplicationStatus(applicationId, status, feedback = null) {
    const result = await pool.query(
        `UPDATE applications
         SET status = $2, feedback = COALESCE($3, feedback), updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [applicationId, status, feedback]
    );
    return result.rows[0];
}

module.exports = {
    createApplication,
    getApplicationById,
    getStudentApplications,
    getStudentApplicationByDriveId,
    getAllApplications,
    getApplicationsByDriveId,
    updateApplicationStatus,
};
