import express from "express";
import { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, getSubjectsByClass } from "../controller/subjectController.js";
import auth from "../middlewere/auth.js";

const routes = express.Router();

routes.get('/', auth, getAllSubjects);
routes.get('/:id', auth, getSubjectById);
routes.get('/class/:classId', auth, getSubjectsByClass);
routes.post('/', auth, createSubject);
routes.put('/:id', auth, updateSubject);
routes.delete('/:id', auth, deleteSubject);

export default routes;
