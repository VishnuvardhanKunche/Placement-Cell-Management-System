const companyService = require("../services/company.service");

async function getAllCompanies(req, res) {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error in getAllCompanies:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getPendingCompanies(req, res) {
    try {
        const companies = await companyService.getPendingCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error in getPendingCompanies:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function getCompanyById(req, res) {
    try {
        const companyId = parseInt(req.params.id, 10);
        const company = await companyService.getCompanyById(companyId);
        res.status(200).json(company);
    } catch (error) {
        console.error("Error in getCompanyById:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function approveCompany(req, res) {
    try {
        const companyId = parseInt(req.params.id, 10);
        const officerId = req.user.id;
        const result = await companyService.approveCompany(companyId, officerId);
        res.status(200).json({
            message: "Company approved successfully",
            company: result,
        });
    } catch (error) {
        console.error("Error in approveCompany:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

async function rejectCompany(req, res) {
    try {
        const companyId = parseInt(req.params.id, 10);
        const result = await companyService.rejectCompany(companyId);
        res.status(200).json({
            message: "Company rejected successfully",
            company: result,
        });
    } catch (error) {
        console.error("Error in rejectCompany:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.statusCode ? error.message : "Internal server error",
        });
    }
}

module.exports = {
    getAllCompanies,
    getPendingCompanies,
    getCompanyById,
    approveCompany,
    rejectCompany,
};
