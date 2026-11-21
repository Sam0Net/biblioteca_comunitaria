import dotenv from 'dotenv';
dotenv.config();

const rawSecret = process.env.JWT_SECRET;
const isProd = process.env.NODE_ENV === 'production';

if (isProd && (!rawSecret || rawSecret === 'biblioteca_default_secret_key_change_me' || rawSecret.length < 32)) {
  throw new Error('FATAL DE SEGURIDAD: En entorno de producción se requiere definir JWT_SECRET con un secreto de al menos 32 caracteres.');
}

if (!isProd && (!rawSecret || rawSecret === 'biblioteca_default_secret_key_change_me')) {
  console.warn('⚠️ ADVERTENCIA DE SEGURIDAD: Usando JWT_SECRET de desarrollo. Define JWT_SECRET en tu .env para mayor seguridad.');
}

export const ENV = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: rawSecret || 'biblioteca_default_secret_key_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
