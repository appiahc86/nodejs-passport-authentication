import Router from 'express';
const router = Router();

import UserController from "../controllers/UserController.js";

//Login
router.get('/login', UserController.login);

//Register
router.get('/register', UserController.register);

export default router;