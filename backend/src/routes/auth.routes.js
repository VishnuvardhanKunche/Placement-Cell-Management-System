const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const { validateLoginInput, validateCompanyRegisterInput } = require("../validators/auth.validator");
const authenticateToken = require("../middleware/authenticateToken");

// Validation middleware wrappers
function validateLogin(req, res, next) {
    const result = validateLoginInput(req.body);
    if (!result.isValid) {
        return res.status(400).json({ message: result.message });
    }
    next();
}

function validateCompanyRegister(req, res, next) {
    const result = validateCompanyRegisterInput(req.body);
    if (!result.isValid) {
        return res.status(400).json({ message: result.message });
    }
    next();
}

// Routes
router.post("/login", validateLogin, authController.login);
router.post("/company/register", validateCompanyRegister, authController.registerCompany);
router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
