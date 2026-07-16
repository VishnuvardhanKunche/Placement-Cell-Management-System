function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === "string" && emailRegex.test(email.trim());
}

function validateCreateInput(req, res, next) {
    const { email, password, full_name, department_id, phone } = req.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    if (!full_name || typeof full_name !== "string" || full_name.trim() === "") {
        return res.status(400).json({ message: "Full name is required" });
    }
    if (full_name.trim().length > 100) {
        return res.status(400).json({ message: "Full name cannot exceed 100 characters" });
    }

    const deptId = parseInt(department_id, 10);
    if (isNaN(deptId) || deptId <= 0) {
        return res.status(400).json({ message: "Invalid department_id. Must be a positive integer." });
    }

    if (phone) {
        if (typeof phone !== "string" || phone.trim() === "") {
            return res.status(400).json({ message: "Phone must be a non-empty string" });
        }
        if (phone.trim().length > 15) {
            return res.status(400).json({ message: "Phone cannot exceed 15 characters" });
        }
    }

    req.body.email = email.trim();
    req.body.full_name = full_name.trim();
    req.body.department_id = deptId;
    req.body.phone = phone ? phone.trim() : null;

    next();
}

function validateUpdateInput(req, res, next) {
    const { email, full_name, phone } = req.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!full_name || typeof full_name !== "string" || full_name.trim() === "") {
        return res.status(400).json({ message: "Full name is required" });
    }
    if (full_name.trim().length > 100) {
        return res.status(400).json({ message: "Full name cannot exceed 100 characters" });
    }

    if (phone) {
        if (typeof phone !== "string" || phone.trim() === "") {
            return res.status(400).json({ message: "Phone must be a non-empty string" });
        }
        if (phone.trim().length > 15) {
            return res.status(400).json({ message: "Phone cannot exceed 15 characters" });
        }
    }

    req.body.email = email.trim();
    req.body.full_name = full_name.trim();
    req.body.phone = phone ? phone.trim() : null;

    next();
}

function validateCoordinatorId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid coordinator ID. Must be a positive integer." });
    }
    next();
}

module.exports = {
    validateCreateInput,
    validateUpdateInput,
    validateCoordinatorId,
};
