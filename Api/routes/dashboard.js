import express from "express";
import { getDashboardStats, getClassWiseStats, getAttendanceStats, getInvoiceStats, getPaymentStats } from "../controller/dashboardController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/stats', auth, getDashboardStats);
routes.get('/class-stats', auth, getClassWiseStats);
routes.get('/attendance-stats', auth, getAttendanceStats);
routes.get('/invoice-stats', auth, getInvoiceStats);
routes.get('/payment-stats', auth, getPaymentStats);

export default routes;
