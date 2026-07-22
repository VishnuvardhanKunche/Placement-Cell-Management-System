const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const { validateReportFilters } = require("../validators/report.validator");

// Apply JWT authentication check to all report endpoints
router.use(authenticateToken);

// Placement Officer Reports
router.get(
    "/placement-summary",
    authorizeRoles("placement_officer"),
    validateReportFilters,
    reportController.getPlacementSummary
);

router.get(
    "/department-wise",
    authorizeRoles("placement_officer"),
    reportController.getDepartmentWiseStats
);

router.get(
    "/company-wise",
    authorizeRoles("placement_officer"),
    reportController.getCompanyWiseStats
);

router.get(
    "/package-analysis",
    authorizeRoles("placement_officer"),
    reportController.getPackageAnalysis
);

router.get(
    "/drive-analysis",
    authorizeRoles("placement_officer"),
    reportController.getDriveAnalysis
);

// CSV Export Endpoints (Placement Officer access only)
router.get(
    "/export/students",
    authorizeRoles("placement_officer"),
    reportController.exportStudents
);

router.get(
    "/export/applications",
    authorizeRoles("placement_officer"),
    reportController.exportApplications
);

router.get(
    "/export/offers",
    authorizeRoles("placement_officer"),
    reportController.exportOffers
);

// Department Coordinator Report
router.get(
    "/department",
    authorizeRoles("department_coordinator"),
    reportController.getCoordinatorDepartmentReport
);

// Company Report
router.get(
    "/company",
    authorizeRoles("company"),
    reportController.getCompanyReport
);

// Student Report
router.get(
    "/my-history",
    authorizeRoles("student"),
    reportController.getStudentHistory
);

module.exports = router;
