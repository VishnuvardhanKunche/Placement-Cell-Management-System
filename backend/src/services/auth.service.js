const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const userModel = require("../models/user.model");
const companyModel = require("../models/company.model");

async function login(email, password) {
    // 1. Fetch user
    const user = await userModel.getUserByEmail(email);
    if (!user) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    // 2. Check active state
    if (!user.is_active) {
        const err = new Error("Account has been deactivated. Please contact the administrator.");
        err.statusCode = 403;
        throw err;
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    // 4. Generate JWT
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    const token = jwt.sign(payload, secret, { expiresIn });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
}

async function registerCompany(data) {
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

    // Check if account email already exists in users table
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        const err = new Error("Account email is already registered");
        err.statusCode = 409;
        throw err;
    }

    // Check if contact email already exists in companies table
    if (contact_email) {
        const existingCompanyContact = await companyModel.getCompanyByContactEmail(contact_email);
        if (existingCompanyContact) {
            const err = new Error("Contact email is already in use by another company");
            err.statusCode = 409;
            throw err;
        }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Perform database transaction
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Create User
        const user = await userModel.createUser(email, passwordHash, "company", client);

        // 2. Create Company Profile
        const company = await companyModel.createCompanyProfile(
            user.id,
            name,
            industry,
            website,
            description,
            contact_person,
            contact_email,
            contact_phone,
            client
        );

        await client.query("COMMIT");

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            company: {
                name: company.name,
                industry: company.industry,
                website: company.website,
                description: company.description,
                contact_person: company.contact_person,
                contact_email: company.contact_email,
                contact_phone: company.contact_phone,
                is_approved: company.is_approved,
            },
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getProfile(userId, role) {
    const profile = await userModel.getUserProfileByIdAndRole(userId, role);
    if (!profile) {
        const err = new Error("User profile not found");
        err.statusCode = 404;
        throw err;
    }
    return profile;
}

module.exports = {
    login,
    registerCompany,
    getProfile,
};
