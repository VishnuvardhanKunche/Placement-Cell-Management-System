const pool = require("../config/db");

async function createDrive(
    companyId,
    title,
    description,
    jobRole,
    jobLocation,
    salaryDetails,
    salaryLpa,
    minCgpa,
    maxBacklogsAllowed,
    registrationDeadline,
    driveDate,
    status = "draft",
    client = pool
) {
    const result = await client.query(
        `INSERT INTO placement_drives (
            company_id, title, description, job_role, job_location,
            salary_details, salary_lpa, min_cgpa, max_backlogs_allowed,
            registration_deadline, drive_date, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
            companyId,
            title,
            description,
            jobRole,
            jobLocation,
            salaryDetails,
            salaryLpa,
            minCgpa,
            maxBacklogsAllowed,
            registrationDeadline,
            driveDate,
            status,
        ]
    );
    return result.rows[0];
}

async function addEligibleDepartment(driveId, departmentId, client = pool) {
    await client.query(
        `INSERT INTO drive_eligible_departments (drive_id, department_id)
         VALUES ($1, $2)`,
        [driveId, departmentId]
    );
}

async function clearEligibleDepartments(driveId, client = pool) {
    await client.query(
        `DELETE FROM drive_eligible_departments WHERE drive_id = $1`,
        [driveId]
    );
}

async function getAllDrives() {
    const result = await pool.query(
        `SELECT pd.*, c.name AS company_name, c.industry AS company_industry,
                COALESCE(
                    (SELECT json_agg(json_build_object('id', d.id, 'code', d.code, 'name', d.name)) 
                     FROM drive_eligible_departments ded 
                     JOIN departments d ON ded.department_id = d.id 
                     WHERE ded.drive_id = pd.id), 
                    '[]'::json
                ) AS eligible_departments
         FROM placement_drives pd
         JOIN companies c ON pd.company_id = c.user_id
         ORDER BY pd.registration_deadline DESC`
    );
    return result.rows;
}

async function getDriveById(driveId) {
    const result = await pool.query(
        `SELECT pd.*, c.name AS company_name, c.industry AS company_industry,
                COALESCE(
                    (SELECT json_agg(json_build_object('id', d.id, 'code', d.code, 'name', d.name)) 
                     FROM drive_eligible_departments ded 
                     JOIN departments d ON ded.department_id = d.id 
                     WHERE ded.drive_id = pd.id), 
                    '[]'::json
                ) AS eligible_departments
         FROM placement_drives pd
         JOIN companies c ON pd.company_id = c.user_id
         WHERE pd.id = $1`,
        [driveId]
    );
    return result.rows[0] || null;
}

async function updateDrive(
    driveId,
    companyId,
    title,
    description,
    jobRole,
    jobLocation,
    salaryDetails,
    salaryLpa,
    minCgpa,
    maxBacklogsAllowed,
    registrationDeadline,
    driveDate,
    status,
    client = pool
) {
    const result = await client.query(
        `UPDATE placement_drives
         SET company_id = $2, title = $3, description = $4, job_role = $5, job_location = $6,
             salary_details = $7, salary_lpa = $8, min_cgpa = $9, max_backlogs_allowed = $10,
             registration_deadline = $11, drive_date = $12, status = $13, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [
            driveId,
            companyId,
            title,
            description,
            jobRole,
            jobLocation,
            salaryDetails,
            salaryLpa,
            minCgpa,
            maxBacklogsAllowed,
            registrationDeadline,
            driveDate,
            status,
        ]
    );
    return result.rows[0];
}

async function deleteDrive(driveId) {
    const result = await pool.query(
        `DELETE FROM placement_drives WHERE id = $1 RETURNING id`,
        [driveId]
    );
    return result.rowCount > 0;
}

module.exports = {
    createDrive,
    addEligibleDepartment,
    clearEligibleDepartments,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
};
