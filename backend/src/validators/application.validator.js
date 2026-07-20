function validateCreateApplicationInput(req, res, next) {
    const { drive_id } = req.body;

    const driveId = parseInt(drive_id, 10);
    if (isNaN(driveId) || driveId <= 0) {
        return res.status(400).json({ message: "Invalid drive_id. Must be a positive integer." });
    }

    req.body.drive_id = driveId;
    next();
}

function validateUpdateStatusInput(req, res, next) {
    const { status, feedback } = req.body;

    const allowedStatuses = ["applied", "shortlisted", "selected", "rejected", "withdrawn"];
    if (!status || typeof status !== "string" || !allowedStatuses.includes(status.trim().toLowerCase())) {
        return res.status(400).json({
            message: `Invalid status value. Must be one of: ${allowedStatuses.join(", ")}`,
        });
    }

    if (feedback && typeof feedback !== "string") {
        return res.status(400).json({ message: "Feedback must be a string." });
    }

    req.body.status = status.trim().toLowerCase();
    req.body.feedback = feedback ? feedback.trim() : null;

    next();
}

function validateApplicationId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid application ID. Must be a positive integer." });
    }
    next();
}

function validateDriveId(req, res, next) {
    const driveId = parseInt(req.params.driveId, 10);
    if (isNaN(driveId) || driveId <= 0) {
        return res.status(400).json({ message: "Invalid drive ID. Must be a positive integer." });
    }
    next();
}

module.exports = {
    validateCreateApplicationInput,
    validateUpdateStatusInput,
    validateApplicationId,
    validateDriveId,
};
