import express from "express";
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentsByClass } from "../controller/studentController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllStudents);
routes.get('/:id', auth, getStudentById);
routes.get('/class/:classId', auth, getStudentsByClass);
routes.post('/', auth, createStudent);
routes.put('/:id', auth, updateStudent);
routes.delete('/:id', auth, deleteStudent);

export default routes;
