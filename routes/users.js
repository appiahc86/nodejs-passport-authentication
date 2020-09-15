import Router from 'express';
const router = Router();

import UserController from "../controllers/UserController.js";

//Login
router.get('/login', UserController.showLoginForm);
router.post('/login', UserController.login);

//Register
router.get('/register', UserController.registerationForm);
router.post('/register', UserController.register);

router.get('/logout', UserController.logout);

export default router;