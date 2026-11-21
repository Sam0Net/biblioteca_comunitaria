import { Router } from 'express';
import {
  requestLoan,
  getMyLoans,
  getAllLoans,
  updateLoanStatus
} from '../controllers/loan.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { loanLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Rutas de usuario autenticado
router.post('/', authenticate, loanLimiter, requestLoan);
router.get('/mis-prestamos', authenticate, getMyLoans);

// Rutas administrativas
router.get('/', authenticate, requireAdmin, getAllLoans);
router.patch('/:id/estado', authenticate, requireAdmin, updateLoanStatus);

export default router;
