const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offer.controller");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
    validateCreateOfferInput,
    validateUpdateOfferInput,
    validateOfferId,
} = require("../validators/offer.validator");

// Apply JWT authentication check to all offer endpoints
router.use(authenticateToken);

// Student Endpoints
router.get(
    "/my",
    authorizeRoles("student"),
    offerController.getStudentOffers
);

router.patch(
    "/:id/accept",
    authorizeRoles("student"),
    validateOfferId,
    offerController.acceptOffer
);

router.patch(
    "/:id/reject",
    authorizeRoles("student"),
    validateOfferId,
    offerController.rejectOffer
);

// Placement Officer Endpoints
router.post(
    "/",
    authorizeRoles("placement_officer"),
    validateCreateOfferInput,
    offerController.createOffer
);

router.get(
    "/",
    authorizeRoles("placement_officer"),
    offerController.getAllOffers
);

router.get(
    "/:id",
    authorizeRoles("placement_officer"),
    validateOfferId,
    offerController.getOfferById
);

router.put(
    "/:id",
    authorizeRoles("placement_officer"),
    validateOfferId,
    validateUpdateOfferInput,
    offerController.updateOffer
);

router.delete(
    "/:id",
    authorizeRoles("placement_officer"),
    validateOfferId,
    offerController.deleteOffer
);

module.exports = router;
