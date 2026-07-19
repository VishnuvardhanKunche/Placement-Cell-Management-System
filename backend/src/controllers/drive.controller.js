const driveService = require("../services/drive.service");

async function createDrive(req, res) {
    try {
        const result = await driveService.createDrive(req.body);
        res.status(201).json({
            message: "Placement drive created successfully",
            drive: result,
        });
    } catch (error) {
        console.error("Error in createDrive:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getAllDrives(req, res) {
    try {
        const drives = await driveService.getAllDrives();
        res.status(200).json(drives);
    } catch (error) {
        console.error("Error in getAllDrives:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getDriveById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const drive = await driveService.getDriveById(id);
        res.status(200).json(drive);
    } catch (error) {
        console.error("Error in getDriveById:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function updateDrive(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await driveService.updateDrive(id, req.body);
        res.status(200).json({
            message: "Placement drive updated successfully",
            drive: result,
        });
    } catch (error) {
        console.error("Error in updateDrive:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function deleteDrive(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        await driveService.deleteDrive(id);
        res.status(200).json({
            message: "Placement drive deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteDrive:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
};
