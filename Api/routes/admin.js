import express from "express";
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from "../controller/adminController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllAdmins);
routes.get('/:id', auth, getAdminById);
routes.post('/', auth, createAdmin);
routes.put('/:id', auth, updateAdmin);
routes.delete('/:id', auth, deleteAdmin);

export default routes;
