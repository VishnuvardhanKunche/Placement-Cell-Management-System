const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
    validateCreateApplicationInput,
    validateUpdateStatusInput,
    validateApplicationId,
    validateDriveId,
} = require("../validators/application.validator");

// Apply JWT authentication check to all application endpoints
router.use(authenticateToken);

// Placement Officer Endpoints (must be registered before parameterized student routes)
router.get(
    "/all",
    authorizeRoles("placement_officer"),
    applicationController.getAllApplications
);

router.get(
    "/drive/:driveId",
    authorizeRoles("placement_officer"),
    validateDriveId,
    applicationController.getApplicationsByDriveId
);

router.patch(
    "/:id/status",
    authorizeRoles("placement_officer"),
    validateApplicationId,
    validateUpdateStatusInput,
    applicationController.updateApplicationStatus
);

// Student Endpoints
router.post(
    "/",
    authorizeRoles("student"),
    validateCreateApplicationInput,
    applicationController.applyForDrive
);

router.get(
    "/",
    authorizeRoles("student"),
    applicationController.getStudentApplications
);

router.get(
    "/:id",
    authorizeRoles("student"),
    validateApplicationId,
    applicationController.getStudentApplicationById
);

router.patch(
    "/:id/withdraw",
    authorizeRoles("student"),
    validateApplicationId,
    applicationController.withdrawApplication
);

module.exports = router;
