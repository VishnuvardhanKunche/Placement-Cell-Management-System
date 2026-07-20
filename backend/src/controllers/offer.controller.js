const offerService = require("../services/offer.service");

async function createOffer(req, res) {
    try {
        const officerId = req.user.id;
        const result = await offerService.createOffer(req.body, officerId);
        res.status(201).json({
            message: "Offer created successfully",
            offer: result,
        });
    } catch (error) {
        console.error("Error in createOffer:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getAllOffers(req, res) {
    try {
        const offers = await offerService.getAllOffers();
        res.status(200).json(offers);
    } catch (error) {
        console.error("Error in getAllOffers:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getOfferById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const offer = await offerService.getOfferById(id);
        res.status(200).json(offer);
    } catch (error) {
        console.error("Error in getOfferById:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function updateOffer(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await offerService.updateOffer(id, req.body);
        res.status(200).json({
            message: "Offer updated successfully",
            offer: result,
        });
    } catch (error) {
        console.error("Error in updateOffer:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function deleteOffer(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        await offerService.deleteOffer(id);
        res.status(200).json({
            message: "Offer deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteOffer:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getStudentOffers(req, res) {
    try {
        const studentId = req.user.id;
        const offers = await offerService.getStudentOffers(studentId);
        res.status(200).json(offers);
    } catch (error) {
        console.error("Error in getStudentOffers:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function acceptOffer(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const studentId = req.user.id;
        const result = await offerService.acceptOffer(id, studentId);
        res.status(200).json({
            message: "Offer accepted successfully",
            offer: result,
        });
    } catch (error) {
        console.error("Error in acceptOffer:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function rejectOffer(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const studentId = req.user.id;
        const result = await offerService.rejectOffer(id, studentId);
        res.status(200).json({
            message: "Offer rejected successfully",
            offer: result,
        });
    } catch (error) {
        console.error("Error in rejectOffer:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    getStudentOffers,
    acceptOffer,
    rejectOffer,
};
