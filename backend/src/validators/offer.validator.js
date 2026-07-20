function validateCreateOfferInput(req, res, next) {
    const { application_id, offer_letter_details, salary_offered_lpa, joining_date } = req.body;

    const appId = parseInt(application_id, 10);
    if (isNaN(appId) || appId <= 0) {
        return res.status(400).json({ message: "Invalid application_id. Must be a positive integer." });
    }

    const salary = parseFloat(salary_offered_lpa);
    if (isNaN(salary) || salary < 0) {
        return res.status(400).json({ message: "Salary offered LPA must be a non-negative number." });
    }

    if (offer_letter_details && typeof offer_letter_details !== "string") {
        return res.status(400).json({ message: "Offer letter details must be a string." });
    }

    if (joining_date && isNaN(Date.parse(joining_date))) {
        return res.status(400).json({ message: "Joining date must be a valid date." });
    }

    req.body.application_id = appId;
    req.body.salary_offered_lpa = salary;
    req.body.offer_letter_details = offer_letter_details ? offer_letter_details.trim() : null;
    req.body.joining_date = joining_date ? new Date(joining_date) : null;

    next();
}

function validateUpdateOfferInput(req, res, next) {
    const { offer_letter_details, salary_offered_lpa, joining_date } = req.body;

    const salary = parseFloat(salary_offered_lpa);
    if (isNaN(salary) || salary < 0) {
        return res.status(400).json({ message: "Salary offered LPA must be a non-negative number." });
    }

    if (offer_letter_details && typeof offer_letter_details !== "string") {
        return res.status(400).json({ message: "Offer letter details must be a string." });
    }

    if (joining_date && isNaN(Date.parse(joining_date))) {
        return res.status(400).json({ message: "Joining date must be a valid date." });
    }

    req.body.salary_offered_lpa = salary;
    req.body.offer_letter_details = offer_letter_details ? offer_letter_details.trim() : null;
    req.body.joining_date = joining_date ? new Date(joining_date) : null;

    next();
}

function validateOfferId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid offer ID. Must be a positive integer." });
    }
    next();
}

module.exports = {
    validateCreateOfferInput,
    validateUpdateOfferInput,
    validateOfferId,
};
