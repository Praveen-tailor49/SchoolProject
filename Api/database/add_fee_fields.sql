-- Add fee-related columns to students table
USE school;

-- Add new columns for fee tracking
ALTER TABLE students 
ADD COLUMN paidFees DECIMAL(10,2) DEFAULT 0.00 AFTER totalFees,
ADD COLUMN pendingFees DECIMAL(10,2) DEFAULT 0.00 AFTER paidFees,
ADD COLUMN lastFeePaymentDate DATE AFTER pendingFees,
ADD COLUMN nextFeeDueDate DATE AFTER lastFeePaymentDate;

-- Verify the columns were added
DESCRIBE students;
