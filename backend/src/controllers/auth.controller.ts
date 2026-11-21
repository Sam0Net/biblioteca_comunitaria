import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  dni: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  carnet: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().min(1, 'El correo o usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

function generateToken(user: { id: string; email: string; rol: Role }): string {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sendAuthResponse(res: Response, user: any, token: string, statusCode = 200) {
  // Establecer cookie HttpOnly para máxima seguridad
  res.cookie('token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  });

  const { password, ...safeUser } = user;

  res.status(statusCode).json({
    success: true,
    message: 'Operación de autenticación exitosa',
    data: {
      user: safeUser,
      token
    }
  });
}

export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = registerSchema.parse(req.body);

    const emailNormalizado = validatedData.email.trim().toLowerCase();

    // Comprobar si el correo ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalizado }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
      return;
    }

    // Generar carnet único vecinal si no viene uno
    let carnet = validatedData.carnet;
    if (!carnet) {
      const year = new Date().getFullYear();
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      carnet = `VEC-${year}-${randomDigits}`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const newUser = await prisma.user.create({
      data: {
        nombre: validatedData.nombre.trim(),
        email: emailNormalizado,
        password: hashedPassword,
        rol: Role.VECINO,
        carnet,
        dni: validatedData.dni || null,
        direccion: validatedData.direccion || null,
        telefono: validatedData.telefono || null
      }
    });

    const token = generateToken(newUser);
    sendAuthResponse(res, newUser, token, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const identificador = email.trim().toLowerCase();

    // Permite login por email, por carnet o por coincidencia directa de usuario
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identificador },
          { email: `${identificador}@leernosune.org` },
          { carnet: identificador.toUpperCase() },
          { nombre: { equals: email.trim(), mode: 'insensitive' } }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario o contraseña' });
      return;
    }

    if (!user.activo) {
      res.status(403).json({ success: false, message: 'Tu cuenta ha sido suspendida. Contacta a la biblioteca' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario o contraseña' });
      return;
    }

    const token = generateToken(user);
    sendAuthResponse(res, user, token, 200);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        loans: {
          where: { estado: 'ACTIVO' },
          include: { book: true }
        },
        registrations: {
          include: { activity: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    const { password, ...safeUser } = user;

    res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  res.clearCookie('token');
  res.json({ success: true, message: 'Sesión cerrada exitosamente' });
}
