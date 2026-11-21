import { Router } from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getMonthlyReport,
  getUsers,
  updateUserStatus,
  submitContactMessage,
  getContactMessages
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { contactLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Mensajes de contacto (público para enviar con rate-limiting, privado para leer)
router.post('/contacto', contactLimiter, submitContactMessage);
router.get('/contacto', authenticate, requireAdmin, getContactMessages);

// Métricas, Analítica e Informes
router.get('/stats', authenticate, requireAdmin, getDashboardStats);
router.get('/analytics', authenticate, requireAdmin, getAnalytics);
router.get('/reports/monthly', authenticate, requireAdmin, getMonthlyReport);

// Gestión de usuarios
router.get('/usuarios', authenticate, requireAdmin, getUsers);
router.patch('/usuarios/:id/estado', authenticate, requireAdmin, updateUserStatus);

export default router;
