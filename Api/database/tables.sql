-- School Management System Tables
-- Run this in phpMyAdmin SQL tab (database 'school' already selected)

SET FOREIGN_KEY_CHECKS = 0;

-- Users table (School Admins who register)
CREATE TABLE IF NOT EXISTS user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    capacity INT DEFAULT 40,
    students_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    school_id INT,
    user_subject VARCHAR(100),
    user_salary DECIMAL(10, 2),
    qualification VARCHAR(255),
    experience VARCHAR(50),
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    join_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50),
    class_id INT,
    section VARCHAR(10),
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    class_id INT,
    teacher_id INT,
    subject_type ENUM('Core', 'Elective') DEFAULT 'Core',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Half Day') DEFAULT 'Present',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admins table (System administrators)
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Admin',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    color VARCHAR(20) DEFAULT 'indigo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Staff table (Non-teaching staff)
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    designation VARCHAR(100),
    join_date DATE,
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    class_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_date DATE,
    fee_type VARCHAR(100) DEFAULT 'Tuition Fee',
    status ENUM('Paid', 'Unpaid', 'Partial', 'Overdue') DEFAULT 'Unpaid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT,
    student_id INT,
    class_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'Online', 'UPI', 'Cheque') DEFAULT 'Cash',
    reference_number VARCHAR(100),
    status ENUM('Completed', 'Pending', 'Failed') DEFAULT 'Completed',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS = 1;

-- Insert default roles
INSERT INTO roles (role_name, description, permissions, color) VALUES
('Super Admin', 'Full system access', '["dashboard","students_view","students_edit","students_delete","teachers_view","teachers_edit","classes_manage","attendance_manage","fees_view","fees_manage","reports_view","settings_manage"]', 'purple'),
('Admin', 'Administrative access', '["dashboard","students_view","students_edit","teachers_view","teachers_edit","classes_manage","attendance_manage","fees_view","reports_view"]', 'indigo'),
('Teacher', 'Teaching features', '["dashboard","students_view","attendance_manage"]', 'blue'),
('Accountant', 'Financial features', '["dashboard","fees_view","fees_manage","reports_view"]', 'green');

-- Insert sample classes
INSERT INTO classes (class_name, section, capacity) VALUES
('Class 1', 'A', 40), ('Class 1', 'B', 40),
('Class 2', 'A', 40), ('Class 2', 'B', 40),
('Class 3', 'A', 40), ('Class 3', 'B', 40),
('Class 4', 'A', 40), ('Class 4', 'B', 40),
('Class 5', 'A', 40), ('Class 5', 'B', 40),
('Class 6', 'A', 45), ('Class 6', 'B', 45),
('Class 7', 'A', 45), ('Class 7', 'B', 45),
('Class 8', 'A', 45), ('Class 8', 'B', 45),
('Class 9', 'A', 45), ('Class 9', 'B', 45),
('Class 10', 'A', 45), ('Class 10', 'B', 45),
('Class 11', 'A', 40), ('Class 11', 'B', 40),
('Class 12', 'A', 40), ('Class 12', 'B', 40);

-- Insert sample subjects
INSERT INTO subjects (subject_name, subject_code, subject_type) VALUES
('Mathematics', 'MATH101', 'Core'),
('English', 'ENG101', 'Core'),
('Hindi', 'HIN101', 'Core'),
('Science', 'SCI101', 'Core'),
('Social Studies', 'SOC101', 'Core'),
('Computer Science', 'CS101', 'Elective'),
('Physical Education', 'PE101', 'Elective'),
('Art', 'ART101', 'Elective');
