const dashboardModel = require("../models/dashboard.model");
const coordinatorModel = require("../models/coordinator.model");
const studentModel = require("../models/student.model");

async function getOfficerDashboard() {
    return await dashboardModel.getOfficerDashboardStats();
}

async function getCoordinatorDashboard(coordinatorUserId) {
    const coordinator = await coordinatorModel.getCoordinatorById(coordinatorUserId);
    if (!coordinator) {
        const error = new Error("Department coordinator profile not found");
        error.statusCode = 403;
        throw error;
    }
    return await dashboardModel.getCoordinatorDashboardStats(coordinator.department_id);
}

async function getStudentDashboard(studentUserId) {
    const student = await studentModel.getStudentById(studentUserId);
    if (!student) {
        const error = new Error("Student profile not found");
        error.statusCode = 404;
        throw error;
    }
    return await dashboardModel.getStudentDashboardStats(studentUserId, student.department_id);
}

async function getCompanyDashboard(companyUserId) {
    return await dashboardModel.getCompanyDashboardStats(companyUserId);
}

module.exports = {
    getOfficerDashboard,
    getCoordinatorDashboard,
    getStudentDashboard,
    getCompanyDashboard,
};
