import express from "express";
import { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, getInvoiceStats } from "../controller/invoiceController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllInvoices);
routes.get('/stats', auth, getInvoiceStats);
routes.get('/:id', auth, getInvoiceById);
routes.post('/', auth, createInvoice);
routes.put('/:id', auth, updateInvoice);
routes.delete('/:id', auth, deleteInvoice);

export default routes;
