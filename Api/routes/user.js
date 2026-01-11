import express from "express";
import { createUser, userLogin } from "../controller/userController.js";

const routes =  express.Router();

routes.post('/create', createUser);
routes.post('/login', userLogin);

export default routes;