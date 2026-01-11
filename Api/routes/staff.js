import express from "express";
import { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff } from "../controller/staffController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllStaff);
routes.get('/:id', auth, getStaffById);
routes.post('/', auth, createStaff);
routes.put('/:id', auth, updateStaff);
routes.delete('/:id', auth, deleteStaff);

export default routes;
