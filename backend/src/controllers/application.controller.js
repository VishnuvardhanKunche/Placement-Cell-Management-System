const applicationService = require("../services/application.service");

async function applyForDrive(req, res) {
    try {
        const studentId = req.user.id;
        const result = await applicationService.applyForDrive(studentId, req.body.drive_id);
        res.status(201).json({
            message: "Application submitted successfully",
            application: result,
        });
    } catch (error) {
        console.error("Error in applyForDrive:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getStudentApplications(req, res) {
    try {
        const studentId = req.user.id;
        const applications = await applicationService.getStudentApplications(studentId);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error in getStudentApplications:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getStudentApplicationById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const studentId = req.user.id;
        const application = await applicationService.getStudentApplicationById(id, studentId);
        res.status(200).json(application);
    } catch (error) {
        console.error("Error in getStudentApplicationById:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function withdrawApplication(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const studentId = req.user.id;
        const result = await applicationService.withdrawApplication(id, studentId);
        res.status(200).json({
            message: "Application withdrawn successfully",
            application: result,
        });
    } catch (error) {
        console.error("Error in withdrawApplication:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getAllApplications(req, res) {
    try {
        const applications = await applicationService.getAllApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error in getAllApplications:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getApplicationsByDriveId(req, res) {
    try {
        const driveId = parseInt(req.params.driveId, 10);
        const applications = await applicationService.getApplicationsByDriveId(driveId);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error in getApplicationsByDriveId:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function updateApplicationStatus(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const { status, feedback } = req.body;
        const result = await applicationService.updateApplicationStatus(id, status, feedback);
        res.status(200).json({
            message: "Application status updated successfully",
            application: result,
        });
    } catch (error) {
        console.error("Error in updateApplicationStatus:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    applyForDrive,
    getStudentApplications,
    getStudentApplicationById,
    withdrawApplication,
    getAllApplications,
    getApplicationsByDriveId,
    updateApplicationStatus,
};
