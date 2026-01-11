import express from "express";
import { getAllClasses, getClassById, createClass, updateClass, deleteClass } from "../controller/classController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllClasses);
routes.get('/:id', auth, getClassById);
routes.post('/', auth, createClass);
routes.put('/:id', auth, updateClass);
routes.delete('/:id', auth, deleteClass);

export default routes;
