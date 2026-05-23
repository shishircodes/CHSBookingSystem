import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import {
  register, login, logout, me, registerSchema, loginSchema,
} from '../controllers/authController.js';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authRequired, me);
export default router;
