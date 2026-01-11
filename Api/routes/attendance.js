import express from "express";
import { getAttendanceByDate, markAttendance, getAttendanceReport, getStudentAttendance } from "../controller/attendanceController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAttendanceByDate);
routes.get('/report', auth, getAttendanceReport);
routes.get('/student/:studentId', auth, getStudentAttendance);
routes.post('/mark', auth, markAttendance);

export default routes;
