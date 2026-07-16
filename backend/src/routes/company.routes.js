const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const { validateCompanyId } = require("../validators/company.validator");

// Apply authentication and role authorization (Placement Officer only) to all endpoints in this file
router.use(authenticateToken);
router.use(authorizeRoles("placement_officer"));

router.get("/", companyController.getAllCompanies);
router.get("/pending", companyController.getPendingCompanies);
router.get("/:id", validateCompanyId, companyController.getCompanyById);
router.patch("/:id/approve", validateCompanyId, companyController.approveCompany);
router.patch("/:id/reject", validateCompanyId, companyController.rejectCompany);

module.exports = router;
