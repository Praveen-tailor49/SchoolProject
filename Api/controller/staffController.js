import db from '../db.js';

export const getAllStaff = async (req, res) => {
  try {
    const [staff] = await db.query("SELECT * FROM staff ORDER BY created_at DESC");
    res.status(200).json(staff);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const [staff] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [id]);
    if (staff.length === 0) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ data: staff[0], message: "Staff fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, phone, department, designation, join_date, status, address } = req.body;
    const staffData = { name, email, phone, department, designation, join_date, status: status || 'Active', address, created_at: new Date() };
    const [result] = await db.query("INSERT INTO staff SET ?", staffData);
    res.status(201).json({ message: "Staff added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, designation, join_date, status, address } = req.body;
    await db.query("UPDATE staff SET name = ?, email = ?, phone = ?, department = ?, designation = ?, join_date = ?, status = ?, address = ? WHERE staff_id = ?", 
      [name, email, phone, department, designation, join_date, status, address, id]);
    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM staff WHERE staff_id = ?", [id]);
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
