import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validations/auth.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup',validateRegister,authController.signUp);
router.post('/login',validateLogin,authController.login);
router.post('/logout',authMiddleware,authController.logout);

router.get('/me',authMiddleware,authController.getUserInfo);

export default router;