
import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  try {
    const { user_email, user_password, full_name, school_name, created_at } = req.body;

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const userData = { user_email, user_password: hashedPassword, full_name, school_name, created_at }

    await db.query("INSERT INTO user SET ?", userData)

    res.status(200).json({ message: "School admin created successfully" })
  }
  catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const userLogin = async (req, res) => {
  try {
    const { user_email, user_password } = req.body

    const [userData] = await db.query("SELECT * FROM user WHERE user_email = ?", [user_email])
    if (userData.length === 0) return res.status(401).json({ message: "Invalid credentials" })

    const isPasswordValid = await bcrypt.compare(user_password, userData[0].user_password)

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: userData[0].user_id, email: userData[0].user_email }, "secret", { expiresIn: "24h" })

    res.status(200).json({ message: "Login successful", token })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })
  }
}