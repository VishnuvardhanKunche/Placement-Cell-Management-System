const pool = require("../config/db");

// Build a dynamic WHERE clause based on optional query parameters
function buildWhereClause(filters, allowedParams = {}) {
    const clauses = [];
    const params = [];
    let paramIndex = 1;

    if (filters.graduationYear && allowedParams.graduationYear) {
        clauses.push(`${allowedParams.graduationYear} = $${paramIndex++}`);
        params.push(parseInt(filters.graduationYear, 10));
    }
    if (filters.departmentId && allowedParams.departmentId) {
        clauses.push(`${allowedParams.departmentId} = $${paramIndex++}`);
        params.push(parseInt(filters.departmentId, 10));
    }
    if (filters.companyId && allowedParams.companyId) {
        clauses.push(`${allowedParams.companyId} = $${paramIndex++}`);
        params.push(parseInt(filters.companyId, 10));
    }
    if (filters.driveId && allowedParams.driveId) {
        clauses.push(`${allowedParams.driveId} = $${paramIndex++}`);
        params.push(parseInt(filters.driveId, 10));
    }
    if (filters.status && allowedParams.status) {
        clauses.push(`${allowedParams.status} = $${paramIndex++}`);
        params.push(filters.status);
    }
    if (filters.startDate && allowedParams.startDate) {
        clauses.push(`${allowedParams.startDate} >= $${paramIndex++}`);
        params.push(new Date(filters.startDate));
    }
    if (filters.endDate && allowedParams.endDate) {
        clauses.push(`${allowedParams.endDate} <= $${paramIndex++}`);
        params.push(new Date(filters.endDate));
    }
    if (filters.minSalary && allowedParams.minSalary) {
        clauses.push(`${allowedParams.minSalary} >= $${paramIndex++}`);
        params.push(parseFloat(filters.minSalary));
    }
    if (filters.maxSalary && allowedParams.maxSalary) {
        clauses.push(`${allowedParams.maxSalary} <= $${paramIndex++}`);
        params.push(parseFloat(filters.maxSalary));
    }

    return {
        whereClause: clauses.length > 0 ? "WHERE " + clauses.join(" AND ") : "",
        params,
    };
}

async function getPlacementSummary(filters = {}) {
    const studentFilter = buildWhereClause(filters, {
        graduationYear: "s.graduation_year",
        departmentId: "s.department_id",
    });

    const companyFilter = buildWhereClause(filters, {
        startDate: "c.created_at",
        endDate: "c.created_at",
    });

    const driveFilter = buildWhereClause(filters, {
        companyId: "pd.company_id",
        startDate: "pd.created_at",
        endDate: "pd.created_at",
    });

    const appFilter = buildWhereClause(filters, {
        graduationYear: "s.graduation_year",
        departmentId: "s.department_id",
        companyId: "pd.company_id",
        driveId: "pd.id",
        status: "a.status",
        startDate: "a.applied_at",
        endDate: "a.applied_at",
    });

    const offerFilter = buildWhereClause(filters, {
        graduationYear: "s.graduation_year",
        departmentId: "s.department_id",
        companyId: "pd.company_id",
        driveId: "pd.id",
        status: "o.status",
        startDate: "o.created_at",
        endDate: "o.created_at",
        minSalary: "o.salary_offered_lpa",
        maxSalary: "o.salary_offered_lpa",
    });

    const [
        totalStudents,
        verifiedStudents,
        totalCompanies,
        approvedCompanies,
        totalDrives,
        activeDrives,
        completedDrives,
        totalApps,
        shortlistedApps,
        selectedStudents,
        rejectedApps,
        offersGen,
        offersAcc,
        packageStats,
    ] = await Promise.all([
        pool.query(`SELECT COUNT(*) FROM students s ${studentFilter.whereClause}`, studentFilter.params),
        pool.query(`SELECT COUNT(*) FROM students s ${studentFilter.whereClause ? studentFilter.whereClause + " AND is_verified = TRUE" : "WHERE is_verified = TRUE"}`, studentFilter.params),
        pool.query(`SELECT COUNT(*) FROM companies c ${companyFilter.whereClause}`, companyFilter.params),
        pool.query(`SELECT COUNT(*) FROM companies c ${companyFilter.whereClause ? companyFilter.whereClause + " AND is_approved = TRUE" : "WHERE is_approved = TRUE"}`, companyFilter.params),
        pool.query(`SELECT COUNT(*) FROM placement_drives pd ${driveFilter.whereClause}`, driveFilter.params),
        pool.query(`SELECT COUNT(*) FROM placement_drives pd ${driveFilter.whereClause ? driveFilter.whereClause + " AND status IN ('published', 'ongoing')" : "WHERE status IN ('published', 'ongoing')"}`, driveFilter.params),
        pool.query(`SELECT COUNT(*) FROM placement_drives pd ${driveFilter.whereClause ? driveFilter.whereClause + " AND status = 'completed'" : "WHERE status = 'completed'"}`, driveFilter.params),
        pool.query(`SELECT COUNT(*) FROM applications a JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${appFilter.whereClause}`, appFilter.params),
        pool.query(`SELECT COUNT(*) FROM applications a JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${appFilter.whereClause ? appFilter.whereClause + " AND a.status = 'shortlisted'" : "WHERE a.status = 'shortlisted'"}`, appFilter.params),
        pool.query(`SELECT COUNT(DISTINCT a.student_id) FROM applications a JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${appFilter.whereClause ? appFilter.whereClause + " AND a.status = 'selected'" : "WHERE a.status = 'selected'"}`, appFilter.params),
        pool.query(`SELECT COUNT(*) FROM applications a JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${appFilter.whereClause ? appFilter.whereClause + " AND a.status = 'rejected'" : "WHERE a.status = 'rejected'"}`, appFilter.params),
        pool.query(`SELECT COUNT(*) FROM offers o JOIN applications a ON o.application_id = a.id JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${offerFilter.whereClause}`, offerFilter.params),
        pool.query(`SELECT COUNT(*) FROM offers o JOIN applications a ON o.application_id = a.id JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${offerFilter.whereClause ? offerFilter.whereClause + " AND o.status = 'accepted'" : "WHERE o.status = 'accepted'"}`, offerFilter.params),
        pool.query(`SELECT COALESCE(MAX(o.salary_offered_lpa), 0.00) AS max_sal, COALESCE(ROUND(AVG(o.salary_offered_lpa), 2), 0.00) AS avg_sal FROM offers o JOIN applications a ON o.application_id = a.id JOIN students s ON a.student_id = s.user_id JOIN placement_drives pd ON a.drive_id = pd.id ${offerFilter.whereClause}`, offerFilter.params),
    ]);

    const totalStuds = parseInt(totalStudents.rows[0].count, 10);
    const selectedStuds = parseInt(selectedStudents.rows[0].count, 10);
    const placementPct = totalStuds > 0 ? parseFloat(((selectedStuds / totalStuds) * 100).toFixed(2)) : 0.00;

    return {
        total_students: totalStuds,
        verified_students: parseInt(verifiedStudents.rows[0].count, 10),
        companies: parseInt(totalCompanies.rows[0].count, 10),
        approved_companies: parseInt(approvedCompanies.rows[0].count, 10),
        total_drives: parseInt(totalDrives.rows[0].count, 10),
        active_drives: parseInt(activeDrives.rows[0].count, 10),
        completed_drives: parseInt(completedDrives.rows[0].count, 10),
        total_applications: parseInt(totalApps.rows[0].count, 10),
        shortlisted_applications: parseInt(shortlistedApps.rows[0].count, 10),
        selected_students: selectedStuds,
        rejected_applications: parseInt(rejectedApps.rows[0].count, 10),
        offers_generated: parseInt(offersGen.rows[0].count, 10),
        accepted_offers: parseInt(offersAcc.rows[0].count, 10),
        highest_package: parseFloat(packageStats.rows[0].max_sal),
        average_package: parseFloat(packageStats.rows[0].avg_sal),
        placement_percentage: placementPct,
    };
}

async function getDepartmentWiseStats(departmentId = null) {
    let query = `
        SELECT d.id AS department_id, d.code AS department_code, d.name AS department_name,
               COUNT(s.user_id) AS total_students,
               COUNT(CASE WHEN s.is_verified = TRUE THEN 1 END) AS verified_students,
               COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.user_id END) AS selected_students,
               COUNT(DISTINCT o.id) AS offers_generated,
               COALESCE(MAX(o.salary_offered_lpa), 0.00) AS highest_package,
               COALESCE(ROUND(AVG(o.salary_offered_lpa) FILTER (WHERE o.status = 'accepted'), 2), 0.00) AS average_package,
               ROUND(
                   COALESCE(
                       (COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.user_id END)::numeric / 
                        NULLIF(COUNT(s.user_id), 0)::numeric) * 100, 
                       0.00
                   ), 2
               ) AS placement_percentage
        FROM departments d
        LEFT JOIN students s ON d.id = s.department_id
        LEFT JOIN applications a ON s.user_id = a.student_id
        LEFT JOIN offers o ON a.id = o.application_id
    `;
    const params = [];
    if (departmentId) {
        query += ` WHERE d.id = $1`;
        params.push(departmentId);
    }
    query += `
        GROUP BY d.id, d.code, d.name
        ORDER BY d.name ASC
    `;
    const result = await pool.query(query, params);
    return result.rows;
}

async function getCompanyWiseStats(companyUserId = null) {
    let query = `
        SELECT c.user_id AS company_id, c.name AS company_name,
               COUNT(DISTINCT pd.id) AS total_drives,
               COUNT(a.id) AS applications_received,
               COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) AS selected_students,
               COUNT(o.id) AS offers_generated,
               COALESCE(MAX(o.salary_offered_lpa), 0.00) AS highest_package,
               COALESCE(ROUND(AVG(o.salary_offered_lpa), 2), 0.00) AS average_package
        FROM companies c
        LEFT JOIN placement_drives pd ON c.user_id = pd.company_id
        LEFT JOIN applications a ON pd.id = a.drive_id
        LEFT JOIN offers o ON a.id = o.application_id
    `;
    const params = [];
    if (companyUserId) {
        query += ` WHERE c.user_id = $1`;
        params.push(companyUserId);
    }
    query += `
        GROUP BY c.user_id, c.name
        ORDER BY c.name ASC
    `;
    const result = await pool.query(query, params);
    return result.rows;
}

async function getPackageAnalysis() {
    const statsResult = await pool.query(`
        SELECT 
            COALESCE(MAX(salary_offered_lpa), 0.00) AS highest_package,
            COALESCE(MIN(salary_offered_lpa), 0.00) AS lowest_package,
            COALESCE(ROUND(AVG(salary_offered_lpa), 2), 0.00) AS average_package,
            COALESCE(percentile_cont(0.5) WITHIN GROUP (ORDER BY salary_offered_lpa), 0.00) AS median_package
        FROM offers
    `);

    const distributionResult = await pool.query(`
        SELECT 
            COUNT(CASE WHEN salary_offered_lpa >= 0 AND salary_offered_lpa < 5 THEN 1 END) AS "0-5 LPA",
            COUNT(CASE WHEN salary_offered_lpa >= 5 AND salary_offered_lpa < 10 THEN 1 END) AS "5-10 LPA",
            COUNT(CASE WHEN salary_offered_lpa >= 10 AND salary_offered_lpa < 20 THEN 1 END) AS "10-20 LPA",
            COUNT(CASE WHEN salary_offered_lpa >= 20 THEN 1 END) AS "20+ LPA"
        FROM offers
    `);

    const stats = statsResult.rows[0];
    const dist = distributionResult.rows[0];

    return {
        highest_package: parseFloat(stats.highest_package),
        lowest_package: parseFloat(stats.lowest_package),
        average_package: parseFloat(stats.average_package),
        median_package: parseFloat(stats.median_package),
        distribution: {
            "0-5 LPA": parseInt(dist["0-5 LPA"], 10),
            "5-10 LPA": parseInt(dist["5-10 LPA"], 10),
            "10-20 LPA": parseInt(dist["10-20 LPA"], 10),
            "20+ LPA": parseInt(dist["20+ LPA"], 10),
        },
    };
}

async function getDriveAnalysis() {
    const result = await pool.query(`
        SELECT pd.title AS drive_title, c.name AS company,
               COUNT(a.id) AS applications,
               COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) AS shortlisted,
               COUNT(CASE WHEN a.status = 'selected' THEN 1 END) AS selected,
               COUNT(o.id) AS offers_issued,
               ROUND(
                   COALESCE(
                       (COUNT(CASE WHEN a.status = 'selected' THEN 1 END)::numeric / 
                        NULLIF(COUNT(a.id), 0)::numeric) * 100, 
                       0.00
                   ), 2
               ) AS selection_rate
        FROM placement_drives pd
        JOIN companies c ON pd.company_id = c.user_id
        LEFT JOIN applications a ON pd.id = a.drive_id
        LEFT JOIN offers o ON a.id = o.application_id
        GROUP BY pd.id, pd.title, c.name, pd.created_at
        ORDER BY pd.created_at DESC
    `);
    return result.rows;
}

async function getStudentHistory(studentUserId) {
    const appsResult = await pool.query(`
        SELECT a.id AS application_id, pd.title AS drive_title, c.name AS company_name, 
               a.status AS current_status, a.applied_at
        FROM applications a
        JOIN placement_drives pd ON a.drive_id = pd.id
        JOIN companies c ON pd.company_id = c.user_id
        WHERE a.student_id = $1
        ORDER BY a.applied_at DESC
    `, [studentUserId]);

    const offersResult = await pool.query(`
        SELECT o.id AS offer_id, pd.title AS drive_title, c.name AS company_name, 
               o.salary_offered_lpa, o.joining_date, o.status AS offer_status, o.created_at
        FROM offers o
        JOIN applications a ON o.application_id = a.id
        JOIN placement_drives pd ON a.drive_id = pd.id
        JOIN companies c ON pd.company_id = c.user_id
        WHERE a.student_id = $1
        ORDER BY o.created_at DESC
    `, [studentUserId]);

    // Chronological History Stream
    const historyResult = await pool.query(`
        (SELECT 'applied' AS event_type,
                'Applied for ' || pd.title || ' at ' || c.name AS details,
                a.applied_at AS event_date
         FROM applications a
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.student_id = $1)
        UNION ALL
        (SELECT 'withdrawn' AS event_type,
                'Withdrew application for ' || pd.title || ' at ' || c.name AS details,
                a.updated_at AS event_date
         FROM applications a
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.student_id = $1 AND a.status = 'withdrawn')
        UNION ALL
        (SELECT o.status::text AS event_type,
                'Job Offer from ' || c.name || ' for ' || pd.title || ' status changed to ' || o.status::text AS details,
                o.updated_at AS event_date
         FROM offers o
         JOIN applications a ON o.application_id = a.id
         JOIN placement_drives pd ON a.drive_id = pd.id
         JOIN companies c ON pd.company_id = c.user_id
         WHERE a.student_id = $1)
        ORDER BY event_date DESC
    `, [studentUserId]);

    return {
        applications: appsResult.rows,
        offers: offersResult.rows,
        history: historyResult.rows,
    };
}

async function getExportStudentsData() {
    const result = await pool.query(`
        SELECT s.user_id AS student_id, s.roll_number, s.full_name, d.code AS department, 
               s.phone, s.cgpa, s.backlogs, s.graduation_year, s.is_verified, u.email
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN departments d ON s.department_id = d.id
        ORDER BY s.roll_number ASC
    `);
    return result.rows;
}

async function getExportApplicationsData() {
    const result = await pool.query(`
        SELECT a.id AS application_id, s.roll_number, s.full_name AS student_name, 
               d.code AS department, pd.title AS drive_title, c.name AS company_name, 
               a.status, a.applied_at
        FROM applications a
        JOIN students s ON a.student_id = s.user_id
        JOIN departments d ON s.department_id = d.id
        JOIN placement_drives pd ON a.drive_id = pd.id
        JOIN companies c ON pd.company_id = c.user_id
        ORDER BY a.applied_at DESC
    `);
    return result.rows;
}

async function getExportOffersData() {
    const result = await pool.query(`
        SELECT o.id AS offer_id, s.roll_number, s.full_name AS student_name, 
               d.code AS department, pd.title AS drive_title, c.name AS company_name, 
               o.salary_offered_lpa AS package_lpa, o.joining_date, o.status AS offer_status, o.created_at
        FROM offers o
        JOIN applications a ON o.application_id = a.id
        JOIN students s ON a.student_id = s.user_id
        JOIN departments d ON s.department_id = d.id
        JOIN placement_drives pd ON a.drive_id = pd.id
        JOIN companies c ON pd.company_id = c.user_id
        ORDER BY o.created_at DESC
    `);
    return result.rows;
}

module.exports = {
    getPlacementSummary,
    getDepartmentWiseStats,
    getCompanyWiseStats,
    getPackageAnalysis,
    getDriveAnalysis,
    getStudentHistory,
    getExportStudentsData,
    getExportApplicationsData,
    getExportOffersData,
};
