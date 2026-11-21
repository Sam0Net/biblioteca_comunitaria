import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
} from '../controllers/book.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadCover } from '../middlewares/upload.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', getBooks);
router.get('/meta/categorias', getCategories);
router.get('/:id', getBookById);

// Rutas protegidas (solo administrador)
router.post('/', authenticate, requireAdmin, uploadCover.single('portadaFile'), createBook);
router.put('/:id', authenticate, requireAdmin, uploadCover.single('portadaFile'), updateBook);
router.delete('/:id', authenticate, requireAdmin, deleteBook);

export default router;
