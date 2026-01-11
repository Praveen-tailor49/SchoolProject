export const HOST_URL = window.location.origin;
export const API_URL = 'http://localhost:9000/api/'

// Auth
export const LOGIN_USER = `${API_URL}school-admin/login`
export const SIGN_USER = `${API_URL}school-admin/create`

// Dashboard
export const DASHBOARD_STATS = `${API_URL}dashboard/stats`
export const CLASS_STATS = `${API_URL}dashboard/class-stats`
export const ATTENDANCE_STATS = `${API_URL}dashboard/attendance-stats`

// Students
export const STUDENTS = `${API_URL}students`
export const STUDENTS_BY_CLASS = (classId) => `${API_URL}students/class/${classId}`

// Teachers
export const TEACHERS = `${API_URL}teachers`

// Classes
export const CLASSES = `${API_URL}classes`

// Subjects
export const SUBJECTS = `${API_URL}subjects`
export const SUBJECTS_BY_CLASS = (classId) => `${API_URL}subjects/class/${classId}`

// Attendance
export const ATTENDANCE = `${API_URL}attendance`
export const MARK_ATTENDANCE = `${API_URL}attendance/mark`
export const ATTENDANCE_REPORT = `${API_URL}attendance/report`

// Admins
export const ADMINS = `${API_URL}admins`

// Roles
export const ROLES = `${API_URL}roles`

// Staff
export const STAFF = `${API_URL}staff`

// Invoices
export const INVOICES = `${API_URL}invoices`
export const INVOICE_STATS = `${API_URL}invoices/stats`

// Payments
export const PAYMENTS = `${API_URL}payments`
export const PAYMENT_STATS = `${API_URL}payments/stats`