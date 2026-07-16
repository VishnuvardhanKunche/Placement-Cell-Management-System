function validateCompanyId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid company ID. Must be a positive integer." });
    }
    next();
}

module.exports = {
    validateCompanyId,
};
