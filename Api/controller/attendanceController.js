import db from '../db.js';

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, classId } = req.query;
    let query = "SELECT a.*, s.name as student_name, s.roll_no FROM attendance a JOIN students s ON a.student_id = s.student_id WHERE a.date = ?";
    const params = [date];
    
    if (classId) {
      query += " AND a.class_id = ?";
      params.push(classId);
    }
    
    const [attendance] = await db.query(query, params);
    res.status(200).json(attendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { attendance_records } = req.body;
    
    for (const record of attendance_records) {
      const { student_id, class_id, date, status } = record;
      const existingRecord = await db.query(
        "SELECT * FROM attendance WHERE student_id = ? AND date = ?", 
        [student_id, date]
      );
      
      if (existingRecord[0].length > 0) {
        await db.query(
          "UPDATE attendance SET status = ? WHERE student_id = ? AND date = ?",
          [status, student_id, date]
        );
      } else {
        await db.query(
          "INSERT INTO attendance SET ?",
          { student_id, class_id, date, status, created_at: new Date() }
        );
      }
    }
    
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { classId, month, year } = req.query;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;
    
    const [report] = await db.query(`
      SELECT s.student_id, s.name, s.roll_no,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        COUNT(a.attendance_id) as total_days
      FROM students s
      LEFT JOIN attendance a ON s.student_id = a.student_id AND a.date BETWEEN ? AND ?
      WHERE s.class_id = ?
      GROUP BY s.student_id
    `, [startDate, endDate, classId]);
    
    res.status(200).json({ data: report, message: "Attendance report fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;
    
    let query = "SELECT * FROM attendance WHERE student_id = ?";
    const params = [studentId];
    
    if (month && year) {
      query += " AND MONTH(date) = ? AND YEAR(date) = ?";
      params.push(month, year);
    }
    
    const [attendance] = await db.query(query + " ORDER BY date DESC", params);
    res.status(200).json({ data: attendance, message: "Student attendance fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
