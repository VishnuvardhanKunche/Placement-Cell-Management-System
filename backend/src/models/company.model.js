const pool = require("../config/db");

async function createCompanyProfile(
    userId,
    name,
    industry,
    website,
    description,
    contactPerson,
    contactEmail,
    contactPhone,
    client = pool
) {
    const result = await client.query(
        `INSERT INTO companies (
            user_id, name, industry, website, description, 
            contact_person, contact_email, contact_phone, is_approved
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE) 
        RETURNING user_id, name, industry, website, description, contact_person, contact_email, contact_phone, is_approved`,
        [
            userId,
            name,
            industry,
            website,
            description,
            contactPerson,
            contactEmail,
            contactPhone,
        ]
    );
    return result.rows[0];
}

async function getCompanyByContactEmail(contactEmail) {
    const result = await pool.query(
        "SELECT * FROM companies WHERE LOWER(contact_email) = LOWER($1)",
        [contactEmail]
    );
    return result.rows[0] || null;
}

async function getAllCompanies() {
    const result = await pool.query(
        `SELECT c.user_id, c.name, c.industry, c.website, c.description,
                c.contact_person, c.contact_email, c.contact_phone,
                c.is_approved, c.approved_by_officer_id,
                u.email AS account_email, u.is_active, u.created_at, u.updated_at
         FROM companies c
         JOIN users u ON c.user_id = u.id
         ORDER BY c.name`
    );
    return result.rows;
}

async function getPendingCompanies() {
    const result = await pool.query(
        `SELECT c.user_id, c.name, c.industry, c.website, c.description,
                c.contact_person, c.contact_email, c.contact_phone,
                c.is_approved, c.approved_by_officer_id,
                u.email AS account_email, u.is_active, u.created_at, u.updated_at
         FROM companies c
         JOIN users u ON c.user_id = u.id
         WHERE c.is_approved = FALSE
         ORDER BY u.created_at DESC`
    );
    return result.rows;
}

async function getCompanyById(companyId) {
    const result = await pool.query(
        `SELECT c.user_id, c.name, c.industry, c.website, c.description,
                c.contact_person, c.contact_email, c.contact_phone,
                c.is_approved, c.approved_by_officer_id,
                u.email AS account_email, u.is_active, u.created_at, u.updated_at
         FROM companies c
         JOIN users u ON c.user_id = u.id
         WHERE c.user_id = $1`,
        [companyId]
    );
    return result.rows[0] || null;
}

async function approveCompany(companyId, officerId) {
    const result = await pool.query(
        `UPDATE companies
         SET is_approved = TRUE, approved_by_officer_id = $2
         WHERE user_id = $1
         RETURNING *`,
        [companyId, officerId]
    );
    return result.rows[0];
}

async function rejectCompany(companyId) {
    const result = await pool.query(
        `UPDATE companies
         SET is_approved = FALSE, approved_by_officer_id = NULL
         WHERE user_id = $1
         RETURNING *`,
        [companyId]
    );
    return result.rows[0];
}

module.exports = {
    createCompanyProfile,
    getCompanyByContactEmail,
    getAllCompanies,
    getPendingCompanies,
    getCompanyById,
    approveCompany,
    rejectCompany,
};
