const express = require("express");
const router = express.Router();
const driveController = require("../controllers/drive.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
    validateCreateInput,
    validateUpdateInput,
    validateDriveId,
} = require("../validators/drive.validator");

// Apply Placement Officer authentication and authorization guards globally
router.use(authenticateToken);
router.use(authorizeRoles("placement_officer"));

router.post("/", validateCreateInput, driveController.createDrive);
router.get("/", driveController.getAllDrives);
router.get("/:id", validateDriveId, driveController.getDriveById);
router.put("/:id", validateDriveId, validateUpdateInput, driveController.updateDrive);
router.delete("/:id", validateDriveId, driveController.deleteDrive);

module.exports = router;
