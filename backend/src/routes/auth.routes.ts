import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
