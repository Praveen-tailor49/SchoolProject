import express from "express";
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from "../controller/roleController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllRoles);
routes.get('/:id', auth, getRoleById);
routes.post('/', auth, createRole);
routes.put('/:id', auth, updateRole);
routes.delete('/:id', auth, deleteRole);

export default routes;
