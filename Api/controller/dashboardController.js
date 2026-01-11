import db from '../db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [studentCount] = await db.query("SELECT COUNT(*) as count FROM students");
    const [teacherCount] = await db.query("SELECT COUNT(*) as count FROM teacher");
    const [classCount] = await db.query("SELECT COUNT(*) as count FROM classes");
    
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

    const [feeStats] = await db.query(`
      SELECT 
        SUM(amount) as total_amount,
        SUM(paid_amount) as collected_amount,
        SUM(amount - paid_amount) as pending_amount
      FROM invoices
    `);

    const [recentStudents] = await db.query(`
      SELECT s.*, c.class_name, c.section 
      FROM students s 
      LEFT JOIN classes c ON s.class_id = c.class_id 
      ORDER BY s.created_at DESC LIMIT 5
    `);

    const [recentPayments] = await db.query(`
      SELECT p.*, s.name as student_name 
      FROM payments p 
      LEFT JOIN students s ON p.student_id = s.student_id 
      ORDER BY p.created_at DESC LIMIT 5
    `);

    res.status(200).json({
      data: {
        stats: {
          totalStudents: studentCount[0].count,
          totalTeachers: teacherCount[0].count,
          totalClasses: classCount[0].count,
          attendancePercentage: attendancePercentage
        },
        feeStats: feeStats[0],
        recentStudents,
        recentPayments
      },
      message: "Dashboard stats fetched successfully"
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
