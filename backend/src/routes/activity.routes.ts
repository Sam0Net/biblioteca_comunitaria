import { Router } from 'express';
import {
  getActivities,
  registerForActivity,
  cancelRegistration,
  createActivity,
  deleteActivity
} from '../controllers/activity.controller.js';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuthenticate, getActivities);
router.post('/:id/inscribirse', authenticate, registerForActivity);
router.delete('/:id/cancelar', authenticate, cancelRegistration);

// Rutas admin
router.post('/', authenticate, requireAdmin, createActivity);
router.delete('/:id', authenticate, requireAdmin, deleteActivity);

export default router;
