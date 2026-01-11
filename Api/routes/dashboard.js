import express from "express";
import { getDashboardStats, getClassWiseStats, getAttendanceStats } from "../controller/dashboardController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/stats', auth, getDashboardStats);
routes.get('/class-stats', auth, getClassWiseStats);
routes.get('/attendance-stats', auth, getAttendanceStats);

export default routes;
