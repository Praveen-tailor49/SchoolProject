import bcrypt from 'bcrypt';
import db from '../db.js';

export const getAllAdmins = async (req, res) => {
  try {
    const [admins] = await db.query("SELECT admin_id, name, email, phone, role, status, last_login, created_at FROM admins ORDER BY created_at DESC");
    res.status(200).json({ data: admins, message: "Admins fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const [admin] = await db.query("SELECT admin_id, name, email, phone, role, status, last_login, created_at FROM admins WHERE admin_id = ?", [id]);
    if (admin.length === 0) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ data: admin[0], message: "Admin fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, role, status } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminData = { name, email, password: hashedPassword, phone, role, status: status || 'Active', created_at: new Date() };
    const [result] = await db.query("INSERT INTO admins SET ?", adminData);
    res.status(201).json({ message: "Admin created successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;
    await db.query("UPDATE admins SET name = ?, email = ?, phone = ?, role = ?, status = ? WHERE admin_id = ?", [name, email, phone, role, status, id]);
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM admins WHERE admin_id = ?", [id]);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
