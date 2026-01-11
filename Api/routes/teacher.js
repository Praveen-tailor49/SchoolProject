import express from "express";
import { getAllTeachers, getTeacherById, addTeacher, updateTeacher, deleteTeacher } from "../controller/teacherController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router()

routes.get('/', auth, getAllTeachers);
routes.get('/:id', auth, getTeacherById);
routes.post('/', auth, addTeacher);
routes.put('/:id', auth, updateTeacher);
routes.delete('/:id', auth, deleteTeacher);

export default routes