import db from '../db.js';

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query("SELECT * FROM students ORDER BY created_at DESC");
    res.status(200).json({ data: students, message: "Students fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [student] = await db.query("SELECT * FROM students WHERE student_id = ?", [id]);
    if (student.length === 0) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ data: student[0], message: "Student fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, roll_no, class_id, section, dob, gender, phone, email, address, parent_name, parent_phone, status } = req.body;
    const studentData = {
      name,
      roll_no,
      class_id,
      section,
      dob,
      gender,
      phone,
      email,
      address,
      parent_name,
      parent_phone,
      status: status || 'Active',
      created_at: new Date()
    };
    const [result] = await db.query("INSERT INTO students SET ?", studentData);
    res.status(201).json({ message: "Student added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll_no, class_id, section, dob, gender, phone, email, address, parent_name, parent_phone, status } = req.body;
    const studentData = { name, roll_no, class_id, section, dob, gender, phone, email, address, parent_name, parent_phone, status };
    await db.query("UPDATE students SET ? WHERE student_id = ?", [studentData, id]);
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM students WHERE student_id = ?", [id]);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const [students] = await db.query("SELECT * FROM students WHERE class_id = ?", [classId]);
    res.status(200).json({ data: students, message: "Students fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
