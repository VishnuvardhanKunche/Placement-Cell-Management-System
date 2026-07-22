const reportService = require("../services/report.service");

async function getPlacementSummary(req, res) {
    try {
        const result = await reportService.getPlacementSummary(req.query);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getPlacementSummary:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getDepartmentWiseStats(req, res) {
    try {
        const result = await reportService.getDepartmentWiseStats();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getDepartmentWiseStats:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCompanyWiseStats(req, res) {
    try {
        const result = await reportService.getCompanyWiseStats();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getCompanyWiseStats:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getPackageAnalysis(req, res) {
    try {
        const result = await reportService.getPackageAnalysis();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getPackageAnalysis:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getDriveAnalysis(req, res) {
    try {
        const result = await reportService.getDriveAnalysis();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getDriveAnalysis:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCoordinatorDepartmentReport(req, res) {
    try {
        const coordinatorUserId = req.user.id;
        const result = await reportService.getCoordinatorDepartmentReport(coordinatorUserId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getCoordinatorDepartmentReport:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCompanyReport(req, res) {
    try {
        const companyUserId = req.user.id;
        const result = await reportService.getCompanyWiseStats(companyUserId);
        res.status(200).json({
            success: true,
            data: result[0] || null,
        });
    } catch (error) {
        console.error("Error in getCompanyReport:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getStudentHistory(req, res) {
    try {
        const studentUserId = req.user.id;
        const result = await reportService.getStudentHistory(studentUserId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in getStudentHistory:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function exportStudents(req, res) {
    try {
        const csvString = await reportService.exportStudents();
        const filename = `students_export_${Math.floor(Date.now() / 1000)}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(csvString);
    } catch (error) {
        console.error("Error in exportStudents:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during CSV export",
        });
    }
}

async function exportApplications(req, res) {
    try {
        const csvString = await reportService.exportApplications();
        const filename = `applications_export_${Math.floor(Date.now() / 1000)}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(csvString);
    } catch (error) {
        console.error("Error in exportApplications:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during CSV export",
        });
    }
}

async function exportOffers(req, res) {
    try {
        const csvString = await reportService.exportOffers();
        const filename = `offers_export_${Math.floor(Date.now() / 1000)}.csv`;
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(csvString);
    } catch (error) {
        console.error("Error in exportOffers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during CSV export",
        });
    }
}

module.exports = {
    getPlacementSummary,
    getDepartmentWiseStats,
    getCompanyWiseStats,
    getPackageAnalysis,
    getDriveAnalysis,
    getCoordinatorDepartmentReport,
    getCompanyReport,
    getStudentHistory,
    exportStudents,
    exportApplications,
    exportOffers,
};
