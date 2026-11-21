import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export async function getActivities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    const activities = await prisma.activity.findMany({
      include: {
        registrations: {
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = activities.map(act => {
      const inscritosCount = act.registrations.length;
      const cuposDisponibles = Math.max(0, act.cupos - inscritosCount);
      const isRegistered = userId ? act.registrations.some(r => r.userId === userId) : false;

      return {
        id: act.id,
        titulo: act.titulo,
        fecha: act.fecha,
        hora: act.hora,
        lugar: act.lugar,
        cuposTotales: act.cupos,
        cuposDisponibles,
        inscritos: inscritosCount,
        categoria: act.categoria,
        descripcion: act.descripcion,
        icono: act.icono,
        estaInscrito: isRegistered
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function registerForActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Inicia sesión para inscribirte a un taller o actividad' });
      return;
    }

    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { registrations: true }
    });

    if (!activity) {
      res.status(404).json({ success: false, message: 'Actividad no encontrada' });
      return;
    }

    const alreadyRegistered = activity.registrations.some(r => r.userId === req.user!.id);
    if (alreadyRegistered) {
      res.status(400).json({ success: false, message: 'Ya te encuentras inscrito en esta actividad' });
      return;
    }

    if (activity.registrations.length >= activity.cupos) {
      res.status(400).json({ success: false, message: 'Lo sentimos, las plazas para esta actividad están agotadas' });
      return;
    }

    await prisma.activityRegistration.create({
      data: {
        userId: req.user.id,
        activityId: id
      }
    });

    res.status(201).json({
      success: true,
      message: '¡Inscripción confirmada! Te esperamos en la biblioteca.'
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelRegistration(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }

    const { id } = req.params;

    const reg = await prisma.activityRegistration.findUnique({
      where: {
        userId_activityId: {
          userId: req.user.id,
          activityId: id
        }
      }
    });

    if (!reg) {
      res.status(404).json({ success: false, message: 'No estabas registrado en esta actividad' });
      return;
    }

    await prisma.activityRegistration.delete({
      where: { id: reg.id }
    });

    res.json({ success: true, message: 'Inscripción cancelada' });
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { titulo, fecha, hora, lugar, cupos, categoria, descripcion, icono } = req.body;

    const newAct = await prisma.activity.create({
      data: {
        titulo: titulo?.trim(),
        fecha: fecha?.trim(),
        hora: hora?.trim(),
        lugar: lugar?.trim(),
        cupos: parseInt(cupos, 10) || 20,
        categoria: categoria?.trim() || 'General',
        descripcion: descripcion?.trim() || '',
        icono: icono || 'event'
      }
    });

    res.status(201).json({ success: true, message: 'Actividad creada con éxito', data: newAct });
  } catch (error) {
    next(error);
  }
}

export async function deleteActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.activity.delete({ where: { id } });
    res.json({ success: true, message: 'Actividad eliminada' });
  } catch (error) {
    next(error);
  }
}
