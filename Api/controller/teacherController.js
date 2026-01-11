import bcrypt from 'bcrypt';
import db from '../db.js';

export const getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await db.query("SELECT teacher_id, full_name, user_email, phone, user_subject, qualification, experience, status, join_date, created_at FROM teacher ORDER BY created_at DESC");
        res.status(200).json({ data: teachers, message: "Teachers fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const [teacher] = await db.query("SELECT teacher_id, full_name, user_email, phone, user_subject, qualification, experience, status, join_date, created_at FROM teacher WHERE teacher_id = ?", [id]);
        if (teacher.length === 0) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json({ data: teacher[0], message: "Teacher fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addTeacher = async(req, res) => {
    try {
        const { user_email, user_password, full_name, school_id, user_subject, user_salary, phone, qualification, experience, status } = req.body

        const hashPassword = await bcrypt.hash(user_password, 10)
        const userData = {
            user_email, 
            user_password: hashPassword, 
            full_name, 
            school_id, 
            user_subject, 
            user_salary,
            phone,
            qualification,
            experience,
            status: status || 'Active',
            join_date: new Date(),
            created_at: new Date()
        }
        const [result] = await db.query("INSERT INTO teacher SET ?", userData)
        res.status(201).json({ message: "Teacher added successfully", id: result.insertId })
    }
    catch (error) { 
        console.log(error);
        res.status(400).json({ message: "Internal server error" }) 
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, user_email, phone, user_subject, qualification, experience, status, user_salary } = req.body;
        await db.query(
            "UPDATE teacher SET full_name = ?, user_email = ?, phone = ?, user_subject = ?, qualification = ?, experience = ?, status = ?, user_salary = ? WHERE teacher_id = ?",
            [full_name, user_email, phone, user_subject, qualification, experience, status, user_salary, id]
        );
        res.status(200).json({ message: "Teacher updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM teacher WHERE teacher_id = ?", [id]);
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};