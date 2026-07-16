function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === "string" && emailRegex.test(email.trim());
}

function validateLoginInput(data) {
    const { email, password } = data;

    if (!email || typeof email !== "string" || email.trim() === "") {
        return { isValid: false, message: "Email is required and must be a non-empty string" };
    }
    if (!isValidEmail(email)) {
        return { isValid: false, message: "Invalid email format" };
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
        return { isValid: false, message: "Password is required and must be a non-empty string" };
    }

    return { isValid: true };
}

function validateCompanyRegisterInput(data) {
    const {
        email,
        password,
        name,
        industry,
        website,
        description,
        contact_person,
        contact_email,
        contact_phone,
    } = data;

    // Login account validation
    if (!email || typeof email !== "string" || email.trim() === "") {
        return { isValid: false, message: "Account email is required" };
    }
    if (!isValidEmail(email)) {
        return { isValid: false, message: "Invalid account email format" };
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
        return { isValid: false, message: "Password is required" };
    }
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 6 characters long" };
    }

    // Profile validation
    if (!name || typeof name !== "string" || name.trim() === "") {
        return { isValid: false, message: "Company name is required" };
    }
    if (name.trim().length > 100) {
        return { isValid: false, message: "Company name cannot exceed 100 characters" };
    }

    if (industry && (typeof industry !== "string" || industry.trim().length > 100)) {
        return { isValid: false, message: "Industry must be a string under 100 characters" };
    }
    if (website && (typeof website !== "string" || website.trim().length > 255)) {
        return { isValid: false, message: "Website must be a string under 255 characters" };
    }
    if (description && typeof description !== "string") {
        return { isValid: false, message: "Description must be a string" };
    }
    if (contact_person && (typeof contact_person !== "string" || contact_person.trim().length > 100)) {
        return { isValid: false, message: "Contact person name must be a string under 100 characters" };
    }

    if (contact_email) {
        if (typeof contact_email !== "string" || contact_email.trim() === "") {
            return { isValid: false, message: "Contact email must be a non-empty string" };
        }
        if (!isValidEmail(contact_email)) {
            return { isValid: false, message: "Invalid contact email format" };
        }
        if (contact_email.trim().length > 255) {
            return { isValid: false, message: "Contact email cannot exceed 255 characters" };
        }
    }

    if (contact_phone) {
        if (typeof contact_phone !== "string" || contact_phone.trim() === "") {
            return { isValid: false, message: "Contact phone must be a non-empty string" };
        }
        if (contact_phone.trim().length > 15) {
            return { isValid: false, message: "Contact phone cannot exceed 15 characters" };
        }
    }

    return { isValid: true };
}

module.exports = {
    validateLoginInput,
    validateCompanyRegisterInput,
};
