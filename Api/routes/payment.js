import express from "express";
import { getAllPayments, getPaymentById, createPayment, updatePaymentStatus, getPaymentStats } from "../controller/paymentController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllPayments);
routes.get('/stats', auth, getPaymentStats);
routes.get('/:id', auth, getPaymentById);
routes.post('/', auth, createPayment);
routes.put('/:id/status', auth, updatePaymentStatus);

export default routes;
