import db from '../db.js';

export const getAllRoles = async (req, res) => {
  try {
    const [roles] = await db.query("SELECT * FROM roles ORDER BY role_name");
    res.status(200).json({ data: roles, message: "Roles fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [role] = await db.query("SELECT * FROM roles WHERE role_id = ?", [id]);
    if (role.length === 0) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ data: role[0], message: "Role fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { role_name, description, permissions, color } = req.body;
    const roleData = { role_name, description, permissions: JSON.stringify(permissions), color, created_at: new Date() };
    const [result] = await db.query("INSERT INTO roles SET ?", roleData);
    res.status(201).json({ message: "Role created successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, description, permissions, color } = req.body;
    await db.query("UPDATE roles SET role_name = ?, description = ?, permissions = ?, color = ? WHERE role_id = ?", 
      [role_name, description, JSON.stringify(permissions), color, id]);
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM roles WHERE role_id = ?", [id]);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
