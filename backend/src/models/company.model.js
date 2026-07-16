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

module.exports = {
    createCompanyProfile,
    getCompanyByContactEmail,
};
