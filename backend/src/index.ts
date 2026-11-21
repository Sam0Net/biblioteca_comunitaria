import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { ENV } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import loanRoutes from './routes/loan.routes.js';
import activityRoutes from './routes/activity.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';

const app = express();

// Middlewares de seguridad y utilidad
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  xssFilter: true,
  noSniff: true
}));

app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de uploads (portadas de libros locales y subidas)
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Biblioteca Comunitaria API',
    time: new Date().toISOString()
  });
});

// Rutas de la API (con limitación general de tasa)
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/libros', bookRoutes);
app.use('/api/prestamos', loanRoutes);
app.use('/api/agenda', activityRoutes);
app.use('/api/admin', adminRoutes);

// Manejo global de errores
app.use(errorHandler);

const PORT = parseInt(ENV.PORT, 10) || 4000;
app.listen(PORT, () => {
  console.log(`🌿 Servidor Backend de Biblioteca Comunitaria activo en http://localhost:${PORT}`);
  console.log(`📚 Base de datos: PostgreSQL (biblioteca_db)`);
});

export default app;
