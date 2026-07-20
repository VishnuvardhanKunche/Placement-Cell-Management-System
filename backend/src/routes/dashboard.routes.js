const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Apply JWT authentication globally
router.use(authenticateToken);

router.get(
    "/officer",
    authorizeRoles("placement_officer"),
    dashboardController.getOfficerDashboard
);

router.get(
    "/coordinator",
    authorizeRoles("department_coordinator"),
    dashboardController.getCoordinatorDashboard
);

router.get(
    "/student",
    authorizeRoles("student"),
    dashboardController.getStudentDashboard
);

router.get(
    "/company",
    authorizeRoles("company"),
    dashboardController.getCompanyDashboard
);

module.exports = router;
