const express = require("express");
const router = express.Router();
const coordinatorController = require("../controllers/coordinator.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
    validateCreateInput,
    validateUpdateInput,
    validateCoordinatorId,
} = require("../validators/coordinator.validator");

// Apply Placement Officer authentication and authorization guards globally
router.use(authenticateToken);
router.use(authorizeRoles("placement_officer"));

router.post("/", validateCreateInput, coordinatorController.createCoordinator);
router.get("/", coordinatorController.getAllCoordinators);
router.get("/:id", validateCoordinatorId, coordinatorController.getCoordinatorById);
router.put("/:id", validateCoordinatorId, validateUpdateInput, coordinatorController.updateCoordinator);
router.delete("/:id", validateCoordinatorId, coordinatorController.deleteCoordinator);

module.exports = router;
