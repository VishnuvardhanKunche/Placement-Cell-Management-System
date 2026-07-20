
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS drive_eligible_departments CASCADE;
DROP TABLE IF EXISTS placement_drives CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS department_coordinators CASCADE;
DROP TABLE IF EXISTS placement_officers CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS offer_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS drive_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;


CREATE TYPE user_role AS ENUM (
    'student', 
    'company', 
    'department_coordinator', 
    'placement_officer'
);

CREATE TYPE drive_status AS ENUM (
    'draft', 
    'published', 
    'ongoing', 
    'completed', 
    'cancelled'
);

CREATE TYPE application_status AS ENUM (
    'applied', 
    'shortlisted', 
    'selected', 
    'rejected',
    'withdrawn'
);

CREATE TYPE offer_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);

-- Core Master Tables

-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    hod_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Profile & Role Tables (1:1 with users)

-- Table: placement_officers
CREATE TABLE placement_officers (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: department_coordinators

CREATE TABLE department_coordinators (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_coordinator_department UNIQUE (department_id)
);

-- Table: students
CREATE TABLE students (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    phone VARCHAR(15),
    cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    backlogs INT NOT NULL DEFAULT 0,
    graduation_year INT NOT NULL,
    resume_path TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by_coordinator_id INT REFERENCES department_coordinators(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_student_cgpa CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    CONSTRAINT chk_student_backlogs CHECK (backlogs >= 0)
);

-- Table: companies
CREATE TABLE companies (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    contact_person VARCHAR(100),
    contact_email VARCHAR(255) UNIQUE,
    contact_phone VARCHAR(15),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by_officer_id INT REFERENCES placement_officers(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recruitment & Application Tables

-- Table: placement_drives
CREATE TABLE placement_drives (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    job_location VARCHAR(100),
    salary_details TEXT,
    salary_lpa NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    min_cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    max_backlogs_allowed INT NOT NULL DEFAULT 0,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    drive_date TIMESTAMP WITH TIME ZONE,
    status drive_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drive_min_cgpa CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00),
    CONSTRAINT chk_drive_max_backlogs CHECK (max_backlogs_allowed >= 0)
);

-- Table: drive_eligible_departments
CREATE TABLE drive_eligible_departments (
    drive_id INT NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (drive_id, department_id)
);

-- Table: applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    drive_id INT NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    status application_status NOT NULL DEFAULT 'applied',
    feedback TEXT,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_drive UNIQUE (student_id, drive_id)
);

-- Table: offers
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    application_id INT NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    offer_letter_details TEXT,
    salary_offered_lpa NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    joining_date DATE,
    status offer_status NOT NULL DEFAULT 'pending',
    created_by_officer_id INT REFERENCES placement_officers(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes (Foreign Keys, Search, and Filtering Columns)

-- Indexes on users
CREATE INDEX idx_users_role ON users(role);

-- Indexes on students
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_verification ON students(is_verified);
CREATE INDEX idx_students_grad_year ON students(graduation_year);

-- Indexes on placement_drives
CREATE INDEX idx_placement_drives_company ON placement_drives(company_id);
CREATE INDEX idx_placement_drives_status ON placement_drives(status);
CREATE INDEX idx_placement_drives_deadline ON placement_drives(registration_deadline);

-- Indexes on applications
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_drive ON applications(drive_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Indexes on offers
CREATE INDEX idx_offers_application ON offers(application_id);
CREATE INDEX idx_offers_status ON offers(status);
