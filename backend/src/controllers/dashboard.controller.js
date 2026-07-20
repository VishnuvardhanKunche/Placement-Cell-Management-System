const dashboardService = require("../services/dashboard.service");

async function getOfficerDashboard(req, res) {
    try {
        const result = await dashboardService.getOfficerDashboard();

        res.status(200).json({
            success: true,
            dashboard: result,
        });
    } catch (error) {
        console.error("Error in getOfficerDashboard:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "Internal server error",
        });
    }
}

async function getCoordinatorDashboard(req, res) {
    try {
        const coordinatorUserId = req.user.id;
        const result = await dashboardService.getCoordinatorDashboard(coordinatorUserId);
        res.status(200).json({
            success: true,
            dashboard: result,
        });
    } catch (error) {
        console.error("Error in getCoordinatorDashboard:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getStudentDashboard(req, res) {
    try {
        const studentUserId = req.user.id;
        const result = await dashboardService.getStudentDashboard(studentUserId);
        res.status(200).json({
            success: true,
            dashboard: result,
        });
    } catch (error) {
        console.error("Error in getStudentDashboard:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCompanyDashboard(req, res) {
    try {
        const companyUserId = req.user.id;
        const result = await dashboardService.getCompanyDashboard(companyUserId);
        res.status(200).json({
            success: true,
            dashboard: result,
        });
    } catch (error) {
        console.error("Error in getCompanyDashboard:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    getOfficerDashboard,
    getCoordinatorDashboard,
    getStudentDashboard,
    getCompanyDashboard,
};
