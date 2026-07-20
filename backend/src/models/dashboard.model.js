const pool = require("../config/db");

async function getOfficerDashboardStats() {
    // 1. Overall System Counts
    const countsResult = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM departments) AS total_departments,
            (SELECT COUNT(*) FROM students) AS total_students,
            (SELECT COUNT(*) FROM students WHERE is_verified = TRUE) AS verified_students,
            (SELECT COUNT(*) FROM companies) AS total_companies,
            (SELECT COUNT(*) FROM companies WHERE is_approved = TRUE) AS approved_companies,
            (SELECT COUNT(*) FROM placement_drives WHERE status IN ('published', 'ongoing')) AS active_placement_drives,
            (SELECT COUNT(*) FROM applications) AS total_applications,
            (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') AS selected_students,
            (SELECT COUNT(*) FROM offers) AS offers_issued,
            (SELECT COUNT(*) FROM offers WHERE status = 'accepted') AS accepted_offers,
            COALESCE((SELECT MAX(salary_offered_lpa) FROM offers), 0.00) AS highest_package,
            COALESCE(ROUND((SELECT AVG(salary_offered_lpa) FROM offers WHERE status = 'accepted'), 2), 0.00) AS average_package
    `);

    const stats = countsResult.rows[0];
    const totalStudentsNum = parseInt(stats.total_students, 10) || 0;
    const selectedStudentsNum = parseInt(stats.selected_students, 10) || 0;
    const placementPercentage = totalStudentsNum > 0
        ? parseFloat(((selectedStudentsNum / totalStudentsNum) * 100).toFixed(2))
        : 0.00;

    // 2. Department-wise Placement Statistics
    const deptStatsResult = await pool.query(`
        SELECT d.id AS department_id, d.code AS department_code, d.name AS department_name,
               COUNT(s.user_id) AS total_students,
               COUNT(CASE WHEN s.is_verified = TRUE THEN 1 END) AS verified_students,
               COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.user_id END) AS selected_students,
               COUNT(DISTINCT o.id) AS offers_issued,
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
        GROUP BY d.id, d.code, d.name
        ORDER BY d.name
    `);

    // 3. Recent Placement Activities
    const recentActivitiesResult = await pool.query(`
        (SELECT 'application' AS activity_type,
                s.full_name || ' applied for ' || pd.title AS description,
                a.applied_at AS activity_date
         FROM applications a
         JOIN students s ON a.student_id = s.user_id
         JOIN placement_drives pd ON a.drive_id = pd.id
         ORDER BY a.applied_at DESC LIMIT 5)
        UNION ALL
        (SELECT 'drive' AS activity_type,
                'Drive published: ' || pd.title || ' by ' || c.name AS description,
                pd.created_at AS activity_date
         FROM placement_drives pd
         JOIN companies c ON pd.company_id = c.user_id
         ORDER BY pd.created_at DESC LIMIT 5)
        UNION ALL
        (SELECT 'offer' AS activity_type,
                'Offer issued for ' || s.full_name || ' (' || pd.title || ')' AS description,
                o.created_at AS activity_date
         FROM offers o
         JOIN applications a ON o.application_id = a.id
         JOIN students s ON a.student_id = s.user_id
         JOIN placement_drives pd ON a.drive_id = pd.id
         ORDER BY o.created_at DESC LIMIT 5)
        ORDER BY activity_date DESC
        LIMIT 10
    `);

    return {
        total_departments: parseInt(stats.total_departments, 10),
        total_students: totalStudentsNum,
        verified_students: parseInt(stats.verified_students, 10),
        total_companies: parseInt(stats.total_companies, 10),
        approved_companies: parseInt(stats.approved_companies, 10),
        active_placement_drives: parseInt(stats.active_placement_drives, 10),
        total_applications: parseInt(stats.total_applications, 10),
        selected_students: selectedStudentsNum,
        offers_issued: parseInt(stats.offers_issued, 10),
        accepted_offers: parseInt(stats.accepted_offers, 10),
        placement_percentage: placementPercentage,
        highest_package: parseFloat(stats.highest_package),
        average_package: parseFloat(stats.average_package),
        department_wise_placement_statistics: deptStatsResult.rows,
        recent_activities: recentActivitiesResult.rows,
    };
}

async function getCoordinatorDashboardStats(departmentId) {
    const statsResult = await pool.query(`
        SELECT 
            COUNT(s.user_id) AS total_students,
            COUNT(CASE WHEN s.is_verified = TRUE THEN 1 END) AS verified_students,
            COUNT(CASE WHEN s.is_verified = FALSE THEN 1 END) AS pending_verification,
            COALESCE(ROUND(AVG(s.cgpa), 2), 0.00) AS average_cgpa,
            COUNT(CASE WHEN s.backlogs > 0 THEN 1 END) AS students_with_backlogs,
            COUNT(CASE WHEN s.resume_path IS NULL OR TRIM(s.resume_path) = '' THEN 1 END) AS students_without_resume,
            COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.user_id END) AS selected_students,
            COUNT(DISTINCT o.id) AS offers_issued,
            COUNT(DISTINCT CASE WHEN o.status = 'accepted' THEN o.id END) AS accepted_offers
        FROM students s
        LEFT JOIN applications a ON s.user_id = a.student_id
        LEFT JOIN offers o ON a.id = o.application_id
        WHERE s.department_id = $1
    `, [departmentId]);

    const stats = statsResult.rows[0];
    const totalStudentsNum = parseInt(stats.total_students, 10) || 0;
    const selectedStudentsNum = parseInt(stats.selected_students, 10) || 0;
    const placementPercentage = totalStudentsNum > 0
        ? parseFloat(((selectedStudentsNum / totalStudentsNum) * 100).toFixed(2))
        : 0.00;

    return {
        total_students: totalStudentsNum,
        verified_students: parseInt(stats.verified_students, 10),
        pending_verification: parseInt(stats.pending_verification, 10),
        average_cgpa: parseFloat(stats.average_cgpa),
        students_with_backlogs: parseInt(stats.students_with_backlogs, 10),
        students_without_resume: parseInt(stats.students_without_resume, 10),
        department_placement_statistics: {
            selected_students: selectedStudentsNum,
            offers_issued: parseInt(stats.offers_issued, 10),
            accepted_offers: parseInt(stats.accepted_offers, 10),
            placement_percentage: placementPercentage,
        },
    };
}

async function getStudentDashboardStats(studentUserId, departmentId) {
    // 1. Fetch Student Profile info to compute Profile Completion %
    const studentResult = await pool.query(`
        SELECT full_name, roll_number, phone, cgpa, graduation_year, resume_path, is_verified
        FROM students WHERE user_id = $1
    `, [studentUserId]);

    const student = studentResult.rows[0] || {};
    let completionPercentage = 0;
    if (student.full_name) completionPercentage += 15;
    if (student.roll_number) completionPercentage += 15;
    if (student.phone) completionPercentage += 15;
    if (student.cgpa !== undefined && student.cgpa !== null) completionPercentage += 15;
    if (student.graduation_year) completionPercentage += 15;
    if (student.resume_path && student.resume_path.trim() !== '') completionPercentage += 15;
    if (student.is_verified) completionPercentage += 10;

    // 2. Application Pipeline Counts
    const appCountsResult = await pool.query(`
        SELECT 
            COUNT(a.id) AS applied_drives,
            COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) AS shortlisted_applications,
            COUNT(CASE WHEN a.status = 'selected' THEN 1 END) AS selected_applications,
            COUNT(o.id) AS offers_received
        FROM applications a
        LEFT JOIN offers o ON a.id = o.application_id
        WHERE a.student_id = $1
    `, [studentUserId]);

    const appStats = appCountsResult.rows[0];

    // 3. Eligible Drives Count
    const eligibleDrivesResult = await pool.query(`
        SELECT COUNT(DISTINCT pd.id) AS eligible_drives
        FROM placement_drives pd
        JOIN students s ON s.user_id = $1
        LEFT JOIN drive_eligible_departments ded ON pd.id = ded.drive_id
        WHERE pd.status = 'published'
          AND pd.registration_deadline >= CURRENT_TIMESTAMP
          AND s.cgpa >= pd.min_cgpa
          AND s.backlogs <= pd.max_backlogs_allowed
          AND (ded.department_id = $2 OR ded.department_id IS NULL)
    `, [studentUserId, departmentId]);

    // 4. Accepted Offer details
    const acceptedOfferResult = await pool.query(`
        SELECT o.id AS offer_id, o.offer_letter_details, o.salary_offered_lpa, o.joining_date,
               pd.title AS drive_title, c.name AS company_name
        FROM applications a
        JOIN offers o ON a.id = o.application_id
        JOIN placement_drives pd ON a.drive_id = pd.id
        JOIN companies c ON pd.company_id = c.user_id
        WHERE a.student_id = $1 AND o.status = 'accepted'
        LIMIT 1
    `, [studentUserId]);

    // 5. Upcoming Drive Deadlines
    const upcomingDeadlinesResult = await pool.query(`
        SELECT DISTINCT pd.id AS drive_id, pd.title AS drive_title, pd.job_role, pd.salary_lpa,
                        pd.registration_deadline, c.name AS company_name
        FROM placement_drives pd
        JOIN companies c ON pd.company_id = c.user_id
        JOIN students s ON s.user_id = $1
        LEFT JOIN drive_eligible_departments ded ON pd.id = ded.drive_id
        WHERE pd.status = 'published'
          AND pd.registration_deadline >= CURRENT_TIMESTAMP
          AND s.cgpa >= pd.min_cgpa
          AND s.backlogs <= pd.max_backlogs_allowed
          AND (ded.department_id = $2 OR ded.department_id IS NULL)
        ORDER BY pd.registration_deadline ASC
        LIMIT 5
    `, [studentUserId, departmentId]);

    return {
        profile_completion_percentage: completionPercentage,
        verification_status: student.is_verified || false,
        eligible_drives: parseInt(eligibleDrivesResult.rows[0].eligible_drives, 10),
        applied_drives: parseInt(appStats.applied_drives, 10),
        shortlisted_applications: parseInt(appStats.shortlisted_applications, 10),
        selected_applications: parseInt(appStats.selected_applications, 10),
        offers_received: parseInt(appStats.offers_received, 10),
        accepted_offer: acceptedOfferResult.rows[0] || null,
        upcoming_drive_deadlines: upcomingDeadlinesResult.rows,
    };
}

async function getCompanyDashboardStats(companyUserId) {
    const statsResult = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM placement_drives WHERE company_id = $1) AS drives_created,
            (SELECT COUNT(*) FROM placement_drives WHERE company_id = $1 AND status IN ('published', 'ongoing')) AS active_drives,
            COUNT(a.id) AS applications_received,
            COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) AS shortlisted_students,
            COUNT(CASE WHEN a.status = 'selected' THEN 1 END) AS selected_students,
            COUNT(o.id) AS offers_generated
        FROM placement_drives pd
        LEFT JOIN applications a ON pd.id = a.drive_id
        LEFT JOIN offers o ON a.id = o.application_id
        WHERE pd.company_id = $1
    `, [companyUserId]);

    const stats = statsResult.rows[0];

    return {
        drives_created: parseInt(stats.drives_created, 10),
        active_drives: parseInt(stats.active_drives, 10),
        applications_received: parseInt(stats.applications_received, 10),
        shortlisted_students: parseInt(stats.shortlisted_students, 10),
        selected_students: parseInt(stats.selected_students, 10),
        offers_generated: parseInt(stats.offers_generated, 10),
    };
}

module.exports = {
    getOfficerDashboardStats,
    getCoordinatorDashboardStats,
    getStudentDashboardStats,
    getCompanyDashboardStats,
};
