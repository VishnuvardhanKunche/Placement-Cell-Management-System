const reportModel = require("../models/report.model");
const coordinatorModel = require("../models/coordinator.model");
const { stringify } = require("csv-stringify/sync");

async function getPlacementSummary(filters) {
    return await reportModel.getPlacementSummary(filters);
}

async function getDepartmentWiseStats(departmentId = null) {
    return await reportModel.getDepartmentWiseStats(departmentId);
}

async function getCompanyWiseStats(companyUserId = null) {
    return await reportModel.getCompanyWiseStats(companyUserId);
}

async function getPackageAnalysis() {
    return await reportModel.getPackageAnalysis();
}

async function getDriveAnalysis() {
    return await reportModel.getDriveAnalysis();
}

async function getStudentHistory(studentUserId) {
    return await reportModel.getStudentHistory(studentUserId);
}

async function getCoordinatorDepartmentReport(coordinatorUserId) {
    const coordinator = await coordinatorModel.getCoordinatorById(coordinatorUserId);
    if (!coordinator) {
        const error = new Error("Department coordinator profile not found");
        error.statusCode = 403;
        throw error;
    }
    const deptStats = await reportModel.getDepartmentWiseStats(coordinator.department_id);
    return deptStats[0] || null;
}

async function exportStudents() {
    const data = await reportModel.getExportStudentsData();
    return stringify(data, {
        header: true,
        columns: [
            { key: "student_id", header: "Student ID" },
            { key: "roll_number", header: "Roll Number" },
            { key: "full_name", header: "Full Name" },
            { key: "department", header: "Department" },
            { key: "phone", header: "Phone" },
            { key: "email", header: "Email" },
            { key: "cgpa", header: "CGPA" },
            { key: "backlogs", header: "Backlogs" },
            { key: "graduation_year", header: "Graduation Year" },
            { key: "is_verified", header: "Is Verified" },
        ],
    });
}

async function exportApplications() {
    const data = await reportModel.getExportApplicationsData();
    return stringify(data, {
        header: true,
        columns: [
            { key: "application_id", header: "Application ID" },
            { key: "roll_number", header: "Roll Number" },
            { key: "student_name", header: "Student Name" },
            { key: "department", header: "Department" },
            { key: "drive_title", header: "Drive Title" },
            { key: "company_name", header: "Company Name" },
            { key: "status", header: "Status" },
            { key: "applied_at", header: "Applied At" },
        ],
    });
}

async function exportOffers() {
    const data = await reportModel.getExportOffersData();
    return stringify(data, {
        header: true,
        columns: [
            { key: "offer_id", header: "Offer ID" },
            { key: "roll_number", header: "Roll Number" },
            { key: "student_name", header: "Student Name" },
            { key: "department", header: "Department" },
            { key: "drive_title", header: "Drive Title" },
            { key: "company_name", header: "Company Name" },
            { key: "package_lpa", header: "Package (LPA)" },
            { key: "joining_date", header: "Joining Date" },
            { key: "offer_status", header: "Offer Status" },
            { key: "created_at", header: "Issued At" },
        ],
    });
}

module.exports = {
    getPlacementSummary,
    getDepartmentWiseStats,
    getCompanyWiseStats,
    getPackageAnalysis,
    getDriveAnalysis,
    getStudentHistory,
    getCoordinatorDepartmentReport,
    exportStudents,
    exportApplications,
    exportOffers,
};
