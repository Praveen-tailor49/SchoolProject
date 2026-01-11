import db from '../db.js';

export const getAllSubjects = async (req, res) => {
  try {
    const [subjects] = await db.query("SELECT * FROM subjects ORDER BY subject_name");
    res.status(200).json({ data: subjects, message: "Subjects fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [subject] = await db.query("SELECT * FROM subjects WHERE subject_id = ?", [id]);
    if (subject.length === 0) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json({ data: subject[0], message: "Subject fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { subject_name, subject_code, class_id, teacher_id, subject_type } = req.body;
    const subjectData = { subject_name, subject_code, class_id, teacher_id, subject_type, created_at: new Date() };
    const [result] = await db.query("INSERT INTO subjects SET ?", subjectData);
    res.status(201).json({ message: "Subject created successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name, subject_code, class_id, teacher_id, subject_type } = req.body;
    await db.query("UPDATE subjects SET subject_name = ?, subject_code = ?, class_id = ?, teacher_id = ?, subject_type = ? WHERE subject_id = ?", 
      [subject_name, subject_code, class_id, teacher_id, subject_type, id]);
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM subjects WHERE subject_id = ?", [id]);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const [subjects] = await db.query("SELECT * FROM subjects WHERE class_id = ?", [classId]);
    res.status(200).json({ data: subjects, message: "Subjects fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
