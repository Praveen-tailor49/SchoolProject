import db from '../db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Student stats
    const [studentCount] = await db.query("SELECT COUNT(*) as count FROM students");
    const [activeStudents] = await db.query("SELECT COUNT(*) as count FROM students WHERE status = 'Active'");
    const [inactiveStudents] = await db.query("SELECT COUNT(*) as count FROM students WHERE status = 'Inactive'");
    
    // Teacher stats
    const [teacherCount] = await db.query("SELECT COUNT(*) as count FROM teacher");
    
    // Class stats
    const [classCount] = await db.query("SELECT COUNT(*) as count FROM classes");
    const [sections] = await db.query("SELECT COUNT(DISTINCT CONCAT(class_name, '-', section)) as count FROM classes");
    
    // Admin stats
    const [adminCount] = await db.query("SELECT COUNT(*) as count FROM admins");
    const [roleCount] = await db.query("SELECT COUNT(*) as count FROM roles");
    
    // Staff stats
    const [staffCount] = await db.query("SELECT COUNT(*) as count FROM staff");
    const [activeStaff] = await db.query("SELECT COUNT(*) as count FROM staff WHERE status = 'Active'");
    
    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const [attendanceToday] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent
      FROM attendance WHERE date = ?
    `, [today]);

    const attendancePercentage = attendanceToday[0].total > 0 
      ? ((attendanceToday[0].present / attendanceToday[0].total) * 100).toFixed(1) 
      : 0;

    // Fee/Invoice stats
    const [invoiceStats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END) as unpaid,
        SUM(CASE WHEN status = 'Partial' THEN 1 ELSE 0 END) as partial
      FROM invoices
    `);

    // Payment stats
    const [paymentStats] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as total,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as received,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending
      FROM payments
    `);

    res.status(200).json({
      totalClasses: classCount[0].count,
      totalSections: sections[0].count,
      totalStudents: studentCount[0].count,
      activeStudents: activeStudents[0].count,
      inactiveStudents: inactiveStudents[0].count,
      promotedStudents: 0, // Placeholder - needs promotion logic
      totalInquiries: 0, // Placeholder - needs inquiry table
      activeInquiries: 0, // Placeholder - needs inquiry table
      transferredOut: 0, // Placeholder - needs transfer logic
      transferredIn: 0, // Placeholder - needs transfer logic
      totalAdmins: adminCount[0].count,
      totalRoles: roleCount[0].count,
      totalStaff: staffCount[0].count,
      activeStaff: activeStaff[0].count,
      totalBooks: 0, // Placeholder - needs library tables
      libraryCards: 0, // Placeholder - needs library tables
      booksIssued: 0, // Placeholder - needs library tables
      returnPending: 0, // Placeholder - needs library tables
      publishedTimetables: 0, // Placeholder - needs exam tables
      publishedAdmitCards: 0, // Placeholder - needs exam tables
      publishedResults: 0, // Placeholder - needs exam tables
      attendancePercentage: attendancePercentage
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClassWiseStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        c.class_id,
        c.class_name,
        c.section,
        c.capacity,
        COUNT(s.student_id) as student_count,
        ROUND((COUNT(s.student_id) / c.capacity) * 100, 1) as occupancy
      FROM classes c
      LEFT JOIN students s ON c.class_id = s.class_id
      GROUP BY c.class_id
      ORDER BY c.class_name, c.section
    `);
    res.status(200).json({ data: stats, message: "Class wise stats fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const [stats] = await db.query(`
      SELECT 
        date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
        ROUND((SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as percentage
      FROM attendance
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY date
      ORDER BY date DESC
    `, [parseInt(days)]);
    res.status(200).json({ data: stats, message: "Attendance stats fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInvoiceStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END) as unpaid,
        SUM(CASE WHEN status = 'Partial' THEN 1 ELSE 0 END) as partial,
        SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue
      FROM invoices
    `);
    res.status(200).json(stats[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as total,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as received,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending,
        0 as expense,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as income
      FROM payments
    `);
    res.status(200).json(stats[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
