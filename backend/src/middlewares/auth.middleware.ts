import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { prisma } from '../config/db.js';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  carnet: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Extraer desde cabecera Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. O desde cookie httpOnly si existe
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Acceso no autorizado: Token no proporcionado' });
      return;
    }

    // Verificar token
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; rol: Role };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, nombre: true, email: true, rol: true, carnet: true, activo: true }
    });

    if (!user || !user.activo) {
      res.status(401).json({ success: false, message: 'Usuario no encontrado o cuenta desactivada' });
      return;
    }

    req.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      carnet: user.carnet
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.rol !== Role.ADMIN) {
    res.status(403).json({ success: false, message: 'Acceso denegado: Se requieren permisos de administrador' });
    return;
  }
  next();
}

export function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; rol: Role };
    prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, nombre: true, email: true, rol: true, carnet: true, activo: true }
    }).then(user => {
      if (user && user.activo) {
        req.user = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          carnet: user.carnet
        };
      }
      next();
    }).catch(() => next());
  } catch {
    next();
  }
}
