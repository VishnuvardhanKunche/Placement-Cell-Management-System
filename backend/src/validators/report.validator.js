function validateReportFilters(req, res, next) {
    const {
        graduationYear,
        departmentId,
        companyId,
        driveId,
        status,
        startDate,
        endDate,
        minSalary,
        maxSalary,
    } = req.query;

    if (graduationYear) {
        const year = parseInt(graduationYear, 10);
        if (isNaN(year) || year < 1900 || year > 2100) {
            return res.status(400).json({
                success: false,
                message: "Invalid graduationYear parameter. Must be a valid year.",
            });
        }
    }

    if (departmentId) {
        const deptId = parseInt(departmentId, 10);
        if (isNaN(deptId) || deptId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid departmentId parameter. Must be a positive integer.",
            });
        }
    }

    if (companyId) {
        const compId = parseInt(companyId, 10);
        if (isNaN(compId) || compId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid companyId parameter. Must be a positive integer.",
            });
        }
    }

    if (driveId) {
        const drvId = parseInt(driveId, 10);
        if (isNaN(drvId) || drvId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid driveId parameter. Must be a positive integer.",
            });
        }
    }

    if (status) {
        const allowedStatuses = ["applied", "shortlisted", "selected", "rejected", "withdrawn"];
        if (!allowedStatuses.includes(status.trim().toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid status parameter. Must be one of: ${allowedStatuses.join(", ")}`,
            });
        }
    }

    if (startDate) {
        if (isNaN(Date.parse(startDate))) {
            return res.status(400).json({
                success: false,
                message: "Invalid startDate format. Must be a valid date.",
            });
        }
    }

    if (endDate) {
        if (isNaN(Date.parse(endDate))) {
            return res.status(400).json({
                success: false,
                message: "Invalid endDate format. Must be a valid date.",
            });
        }
    }

    if (minSalary) {
        const minSal = parseFloat(minSalary);
        if (isNaN(minSal) || minSal < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid minSalary parameter. Must be a non-negative number.",
            });
        }
    }

    if (maxSalary) {
        const maxSal = parseFloat(maxSalary);
        if (isNaN(maxSal) || maxSal < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid maxSalary parameter. Must be a non-negative number.",
            });
        }
    }

    next();
}

module.exports = {
    validateReportFilters,
};
