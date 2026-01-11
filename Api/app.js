import express from "express";
import cors from "cors";
import user from "./routes/user.js"
import teacher from "./routes/teacher.js"
import student from "./routes/student.js"
import classRoutes from "./routes/class.js"
import subject from "./routes/subject.js"
import attendance from "./routes/attendance.js"
import admin from "./routes/admin.js"
import role from "./routes/role.js"
import staff from "./routes/staff.js"
import invoice from "./routes/invoice.js"
import payment from "./routes/payment.js"
import dashboard from "./routes/dashboard.js"

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/school-admin', user)
app.use('/api/teachers', teacher)
app.use('/api/students', student)
app.use('/api/classes', classRoutes)
app.use('/api/subjects', subject)
app.use('/api/attendance', attendance)
app.use('/api/admins', admin)
app.use('/api/roles', role)
app.use('/api/staff', staff)
app.use('/api/invoices', invoice)
app.use('/api/payments', payment)
app.use('/api/dashboard', dashboard)

app.get('/', (req, res) => { res.send('Welcome to School Management System API') })

app.listen(9000, () => { console.log("Server started on port 9000") });
