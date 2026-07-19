function validateCreateInput(req, res, next) {
    const {
        company_id,
        title,
        description,
        job_role,
        job_location,
        salary_details,
        salary_lpa,
        min_cgpa,
        max_backlogs_allowed,
        registration_deadline,
        drive_date,
        status,
        eligible_departments,
    } = req.body;

    const companyId = parseInt(company_id, 10);
    if (isNaN(companyId) || companyId <= 0) {
        return res.status(400).json({ message: "Invalid company_id. Must be a positive integer." });
    }

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }
    if (title.trim().length > 150) {
        return res.status(400).json({ message: "Title cannot exceed 150 characters" });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ message: "Description is required" });
    }

    if (!job_role || typeof job_role !== "string" || job_role.trim() === "") {
        return res.status(400).json({ message: "Job role is required" });
    }
    if (job_role.trim().length > 100) {
        return res.status(400).json({ message: "Job role cannot exceed 100 characters" });
    }

    if (job_location && (typeof job_location !== "string" || job_location.trim().length > 100)) {
        return res.status(400).json({ message: "Job location must be a string up to 100 characters" });
    }

    const salary = parseFloat(salary_lpa);
    if (isNaN(salary) || salary < 0) {
        return res.status(400).json({ message: "Salary LPA must be a non-negative number" });
    }

    const cgpa = parseFloat(min_cgpa);
    if (isNaN(cgpa) || cgpa < 0.00 || cgpa > 10.00) {
        return res.status(400).json({ message: "Minimum CGPA must be a number between 0.00 and 10.00" });
    }

    const backlogs = parseInt(max_backlogs_allowed, 10);
    if (isNaN(backlogs) || backlogs < 0) {
        return res.status(400).json({ message: "Max backlogs allowed must be a non-negative integer" });
    }

    if (!registration_deadline || isNaN(Date.parse(registration_deadline))) {
        return res.status(400).json({ message: "A valid registration deadline is required" });
    }

    if (drive_date && isNaN(Date.parse(drive_date))) {
        return res.status(400).json({ message: "Drive date must be a valid date" });
    }

    const validStatuses = ["draft", "published", "ongoing", "completed", "cancelled"];
    const driveStatus = status || "draft";
    if (!validStatuses.includes(driveStatus)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    if (eligible_departments) {
        if (!Array.isArray(eligible_departments)) {
            return res.status(400).json({ message: "Eligible departments must be an array of department IDs" });
        }
        for (const deptId of eligible_departments) {
            const parsedId = parseInt(deptId, 10);
            if (isNaN(parsedId) || parsedId <= 0) {
                return res.status(400).json({ message: "Department IDs in eligible list must be positive integers" });
            }
        }
    }

    req.body.company_id = companyId;
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.job_role = job_role.trim();
    req.body.job_location = job_location ? job_location.trim() : null;
    req.body.salary_details = salary_details ? salary_details.trim() : null;
    req.body.salary_lpa = salary;
    req.body.min_cgpa = cgpa;
    req.body.max_backlogs_allowed = backlogs;
    req.body.registration_deadline = new Date(registration_deadline);
    req.body.drive_date = drive_date ? new Date(drive_date) : null;
    req.body.status = driveStatus;
    req.body.eligible_departments = eligible_departments ? eligible_departments.map(id => parseInt(id, 10)) : [];

    next();
}

function validateUpdateInput(req, res, next) {
    // A PUT update uses the exact same structure as Create
    validateCreateInput(req, res, next);
}

function validateDriveId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid drive ID. Must be a positive integer." });
    }
    next();
}

module.exports = {
    validateCreateInput,
    validateUpdateInput,
    validateDriveId,
};
