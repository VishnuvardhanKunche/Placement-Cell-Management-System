const authService = require("../services/auth.service");

async function login(req, res) {
    try {
        const result = await authService.login(req.body.email, req.body.password);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in login:", error);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function registerCompany(req, res) {
    try {
        const result = await authService.registerCompany(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error("Error in registerCompany:", error);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getProfile(req, res) {
    try {
        const { id, role } = req.user;

        const profile = await authService.getProfile(id, role);

        res.status(200).json(profile);
    } catch (error) {
        console.error("Error in getProfile:", error);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    login,
    registerCompany,
    getProfile,
};
