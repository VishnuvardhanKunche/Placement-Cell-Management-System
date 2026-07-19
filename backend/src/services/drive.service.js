const pool = require("../config/db");
const driveModel = require("../models/drive.model");
const companyModel = require("../models/company.model");
const departmentModel = require("../models/department.model");

async function validateEligibleDepartments(departmentIds) {
    if (!departmentIds || departmentIds.length === 0) return;
    for (const deptId of departmentIds) {
        const dept = await departmentModel.getDepartmentById(deptId);
        if (!dept) {
            const error = new Error(`Department with ID ${deptId} does not exist`);
            error.statusCode = 400;
            throw error;
        }
    }
}

async function createDrive(data) {
    const {
        company_id,
        title,
        description,
        job_role,
        job_location,
        salary_details,
        salary_lpa,
        min_cgpa,
        max_backlogs_allowed,
        registration_deadline,
        drive_date,
        status,
        eligible_departments,
    } = data;

    // 1. Verify company exists
    const company = await companyModel.getCompanyById(company_id);
    if (!company) {
        const error = new Error("Company profile not found");
        error.statusCode = 400;
        throw error;
    }

    // 2. Verify all eligible department IDs are valid
    await validateEligibleDepartments(eligible_departments);

    // 3. Database transaction
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const drive = await driveModel.createDrive(
            company_id,
            title,
            description,
            job_role,
            job_location,
            salary_details,
            salary_lpa,
            min_cgpa,
            max_backlogs_allowed,
            registration_deadline,
            drive_date,
            status,
            client
        );

        // Add department links
        for (const deptId of eligible_departments) {
            await driveModel.addEligibleDepartment(drive.id, deptId, client);
        }

        await client.query("COMMIT");

        // Return combined result
        return await driveModel.getDriveById(drive.id);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getAllDrives() {
    return await driveModel.getAllDrives();
}

async function getDriveById(id) {
    const drive = await driveModel.getDriveById(id);
    if (!drive) {
        const error = new Error("Placement drive not found");
        error.statusCode = 404;
        throw error;
    }
    return drive;
}

async function updateDrive(id, data) {
    const {
        company_id,
        title,
        description,
        job_role,
        job_location,
        salary_details,
        salary_lpa,
        min_cgpa,
        max_backlogs_allowed,
        registration_deadline,
        drive_date,
        status,
        eligible_departments,
    } = data;

    // 1. Check if placement drive exists
    const drive = await driveModel.getDriveById(id);
    if (!drive) {
        const error = new Error("Placement drive not found");
        error.statusCode = 404;
        throw error;
    }

    // 2. Verify company exists
    const company = await companyModel.getCompanyById(company_id);
    if (!company) {
        const error = new Error("Company profile not found");
        error.statusCode = 400;
        throw error;
    }

    // 3. Verify all eligible department IDs are valid
    await validateEligibleDepartments(eligible_departments);

    // 4. Database transaction
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const updatedDrive = await driveModel.updateDrive(
            id,
            company_id,
            title,
            description,
            job_role,
            job_location,
            salary_details,
            salary_lpa,
            min_cgpa,
            max_backlogs_allowed,
            registration_deadline,
            drive_date,
            status,
            client
        );

        // Clear and re-populate eligible departments
        await driveModel.clearEligibleDepartments(id, client);
        for (const deptId of eligible_departments) {
            await driveModel.addEligibleDepartment(id, deptId, client);
        }

        await client.query("COMMIT");

        // Return combined result
        return await driveModel.getDriveById(id);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function deleteDrive(id) {
    const drive = await driveModel.getDriveById(id);
    if (!drive) {
        const error = new Error("Placement drive not found");
        error.statusCode = 404;
        throw error;
    }
    return await driveModel.deleteDrive(id);
}

module.exports = {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
};
