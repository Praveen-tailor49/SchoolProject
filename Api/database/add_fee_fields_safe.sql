-- Add fee-related columns to students table (safe version)
USE school;

-- First check if columns already exist to avoid errors
-- Add new columns for fee tracking one by one
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS paidFees DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS pendingFees DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS lastFeePaymentDate DATE;

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS nextFeeDueDate DATE;

-- Alternative approach if IF NOT EXISTS is not supported
-- Check current table structure first
SHOW COLUMNS FROM students LIKE 'paidFees';

-- If paidFees doesn't exist, add it
-- ALTER TABLE students ADD COLUMN paidFees DECIMAL(10,2) DEFAULT 0.00;

-- Verify the columns were added
DESCRIBE students;
