import httpClient from '../action/http-client';

// Dashboard
export const getDashboardStats = () => httpClient.get('dashboard/stats');
export const getClassStats = () => httpClient.get('dashboard/class-stats');
export const getAttendanceStats = (days = 7) => httpClient.get(`dashboard/attendance-stats?days=${days}`);
export const getInvoiceStats = () => httpClient.get('dashboard/invoice-stats');
export const getPaymentStats = () => httpClient.get('dashboard/payment-stats');

// Students
export const getStudents = () => httpClient.get('students');
export const getStudentById = (id) => httpClient.get(`students/${id}`);
export const getStudentsByClass = (classId) => httpClient.get(`students/class/${classId}`);
export const createStudent = (data) => httpClient.post('students', data);
export const updateStudent = (id, data) => httpClient.put(`students/${id}`, data);
export const deleteStudent = (id) => httpClient.delete(`students/${id}`);

// Teachers
export const getTeachers = () => httpClient.get('teachers');
export const getTeacherById = (id) => httpClient.get(`teachers/${id}`);
export const createTeacher = (data) => httpClient.post('teachers', data);
export const updateTeacher = (id, data) => httpClient.put(`teachers/${id}`, data);
export const deleteTeacher = (id) => httpClient.delete(`teachers/${id}`);

// Classes
export const getClasses = () => httpClient.get('classes');
export const getClassById = (id) => httpClient.get(`classes/${id}`);
export const createClass = (data) => httpClient.post('classes', data);
export const updateClass = (id, data) => httpClient.put(`classes/${id}`, data);
export const deleteClass = (id) => httpClient.delete(`classes/${id}`);

// Subjects
export const getSubjects = () => httpClient.get('subjects');
export const getSubjectById = (id) => httpClient.get(`subjects/${id}`);
export const getSubjectsByClass = (classId) => httpClient.get(`subjects/class/${classId}`);
export const createSubject = (data) => httpClient.post('subjects', data);
export const updateSubject = (id, data) => httpClient.put(`subjects/${id}`, data);
export const deleteSubject = (id) => httpClient.delete(`subjects/${id}`);

// Attendance
export const getAttendance = (date, classId) => httpClient.get(`attendance?date=${date}&classId=${classId}`);
export const markAttendance = (data) => httpClient.post('attendance/mark', data);
export const getAttendanceReport = (classId, month, year) => httpClient.get(`attendance/report?classId=${classId}&month=${month}&year=${year}`);
export const getStudentAttendance = (studentId, month, year) => httpClient.get(`attendance/student/${studentId}?month=${month}&year=${year}`);

// Admins
export const getAdmins = () => httpClient.get('admins');
export const getAdminById = (id) => httpClient.get(`admins/${id}`);
export const createAdmin = (data) => httpClient.post('admins', data);
export const updateAdmin = (id, data) => httpClient.put(`admins/${id}`, data);
export const deleteAdmin = (id) => httpClient.delete(`admins/${id}`);

// Roles
export const getRoles = () => httpClient.get('roles');
export const getRoleById = (id) => httpClient.get(`roles/${id}`);
export const createRole = (data) => httpClient.post('roles', data);
export const updateRole = (id, data) => httpClient.put(`roles/${id}`, data);
export const deleteRole = (id) => httpClient.delete(`roles/${id}`);

// Staff
export const getStaff = () => httpClient.get('staff');
export const getStaffById = (id) => httpClient.get(`staff/${id}`);
export const createStaff = (data) => httpClient.post('staff', data);
export const updateStaff = (id, data) => httpClient.put(`staff/${id}`, data);
export const deleteStaff = (id) => httpClient.delete(`staff/${id}`);

// Invoices
export const getInvoices = (status, classId) => {
  let url = 'invoices';
  const params = [];
  if (status) params.push(`status=${status}`);
  if (classId) params.push(`class_id=${classId}`);
  if (params.length) url += '?' + params.join('&');
  return httpClient.get(url);
};
export const getInvoiceById = (id) => httpClient.get(`invoices/${id}`);
export const createInvoice = (data) => httpClient.post('invoices', data);
export const updateInvoice = (id, data) => httpClient.put(`invoices/${id}`, data);
export const deleteInvoice = (id) => httpClient.delete(`invoices/${id}`);

// Payments
export const getPayments = (method, status) => {
  let url = 'payments';
  const params = [];
  if (method) params.push(`method=${method}`);
  if (status) params.push(`status=${status}`);
  if (params.length) url += '?' + params.join('&');
  return httpClient.get(url);
};
export const getPaymentById = (id) => httpClient.get(`payments/${id}`);
export const createPayment = (data) => httpClient.post('payments', data);
export const updatePaymentStatus = (id, status) => httpClient.put(`payments/${id}/status`, { status });
