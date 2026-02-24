import db from '../db.js';

export const getAllClasses = async (req, res) => {
  try {
    const [classes] = await db.query("SELECT * FROM classes ORDER BY class_name, section");
    res.status(200).json(classes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const [classData] = await db.query("SELECT * FROM classes WHERE class_id = ?", [id]);
    if (classData.length === 0) return res.status(404).json({ message: "Class not found" });
    res.status(200).json({ data: classData[0], message: "Class fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createClass = async (req, res) => {
  try {
    const { class_name, section, capacity } = req.body;
    const classData = { class_name, section, capacity, students_count: 0, created_at: new Date() };
    const [result] = await db.query("INSERT INTO classes SET ?", classData);
    res.status(201).json({ message: "Class created successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, section, capacity } = req.body;
    await db.query("UPDATE classes SET class_name = ?, section = ?, capacity = ? WHERE class_id = ?", [class_name, section, capacity, id]);
    res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM classes WHERE class_id = ?", [id]);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
