const coordinatorService = require("../services/coordinator.service");

async function createCoordinator(req, res) {
    try {
        const result = await coordinatorService.createCoordinator(req.body);
        res.status(201).json({
            message: "Department coordinator created successfully",
            coordinator: result,
        });
    } catch (error) {
        console.error("Error in createCoordinator:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getAllCoordinators(req, res) {
    try {
        const coordinators = await coordinatorService.getAllCoordinators();
        res.status(200).json(coordinators);
    } catch (error) {
        console.error("Error in getAllCoordinators:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCoordinatorById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const coordinator = await coordinatorService.getCoordinatorById(id);
        res.status(200).json(coordinator);
    } catch (error) {
        console.error("Error in getCoordinatorById:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function updateCoordinator(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await coordinatorService.updateCoordinator(id, req.body);
        res.status(200).json({
            message: "Department coordinator updated successfully",
            coordinator: result,
        });
    } catch (error) {
        console.error("Error in updateCoordinator:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function deleteCoordinator(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        await coordinatorService.deleteCoordinator(id);
        res.status(200).json({
            message: "Department coordinator deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteCoordinator:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    createCoordinator,
    getAllCoordinators,
    getCoordinatorById,
    updateCoordinator,
    deleteCoordinator,
};
