import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { LoanStatus, BookStatus } from '@prisma/client';

const requestLoanSchema = z.object({
  bookId: z.string().min(1, 'El identificador del libro es obligatorio').max(100),
  dias: z.coerce.number().int('Los días deben ser un número entero').min(1, 'El préstamo mínimo es de 1 día').max(30, 'El préstamo máximo es de 30 días').default(14),
  notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional()
});

const updateLoanStatusSchema = z.object({
  estado: z.nativeEnum(LoanStatus, { errorMap: () => ({ message: 'Estado de préstamo no válido (PENDIENTE, ACTIVO, DEVUELTO, RECHAZADO)' }) }),
  notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional()
});

export async function requestLoan(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Inicia sesión para solicitar un préstamo' });
      return;
    }

    const { bookId, dias, notas } = requestLoanSchema.parse(req.body);

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      res.status(404).json({ success: false, message: 'El libro solicitado no existe' });
      return;
    }

    if (book.estado === BookStatus.SALA) {
      res.status(400).json({ success: false, message: 'Este ejemplar solo está disponible para lectura en sala' });
      return;
    }

    if (book.copias < 1) {
      res.status(400).json({ success: false, message: 'No hay ejemplares disponibles en este momento' });
      return;
    }

    // Comprobar si el usuario ya tiene un préstamo activo de este mismo libro
    const activeLoan = await prisma.loan.findFirst({
      where: {
        userId: req.user.id,
        bookId,
        estado: { in: [LoanStatus.PENDIENTE, LoanStatus.ACTIVO] }
      }
    });

    if (activeLoan) {
      res.status(400).json({
        success: false,
        message: 'Ya tienes una solicitud o un préstamo en curso para este libro'
      });
      return;
    }

    const fechaSolicitud = new Date();
    const fechaDevolucionEsperada = new Date();
    fechaDevolucionEsperada.setDate(fechaSolicitud.getDate() + Number(dias));

    // Crear el préstamo
    const loan = await prisma.$transaction(async (tx) => {
      // Disminuir una copia disponible del libro
      await tx.book.update({
        where: { id: bookId },
        data: {
          copias: { decrement: 1 },
          lectores: { increment: 1 }
        }
      });

      return await tx.loan.create({
        data: {
          userId: req.user!.id,
          bookId,
          fechaSolicitud,
          fechaDevolucionEsperada,
          estado: LoanStatus.PENDIENTE,
          notas: notas || 'Solicitud generada desde la plataforma web'
        },
        include: {
          book: true
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud de préstamo registrada con éxito. Puedes retirarlo en recepción.',
      data: loan
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyLoans(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }

    const loans = await prisma.loan.findMany({
      where: { userId: req.user.id },
      include: {
        book: {
          select: {
            id: true,
            titulo: true,
            autor: true,
            portada: true,
            genero: true
          }
        }
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    res.json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
}

export async function getAllLoans(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { estado } = req.query;

    const where: any = {};
    if (estado && typeof estado === 'string') {
      const estadoEnum = estado.toUpperCase() as LoanStatus;
      if (Object.values(LoanStatus).includes(estadoEnum)) {
        where.estado = estadoEnum;
      }
    }

    const loans = await prisma.loan.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            carnet: true,
            telefono: true
          }
        },
        book: {
          select: {
            id: true,
            titulo: true,
            autor: true,
            portada: true
          }
        }
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    res.json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
}

export async function updateLoanStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { estado: estadoEnum, notas } = updateLoanStatusSchema.parse(req.body);

    const existingLoan = await prisma.loan.findUnique({
      where: { id },
      include: { book: true }
    });

    if (!existingLoan) {
      res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
      return;
    }

    const updatedLoan = await prisma.$transaction(async (tx) => {
      // Si se marca como DEVUELTO o RECHAZADO y antes no lo estaba, devolvemos la copia al stock
      if (
        (estadoEnum === LoanStatus.DEVUELTO || estadoEnum === LoanStatus.RECHAZADO) &&
        existingLoan.estado !== LoanStatus.DEVUELTO &&
        existingLoan.estado !== LoanStatus.RECHAZADO
      ) {
        await tx.book.update({
          where: { id: existingLoan.bookId },
          data: { copias: { increment: 1 } }
        });
      }

      return await tx.loan.update({
        where: { id },
        data: {
          estado: estadoEnum,
          fechaDevolucionReal: estadoEnum === LoanStatus.DEVUELTO ? new Date() : undefined,
          notas: notas || existingLoan.notas
        },
        include: { user: true, book: true }
      });
    });

    res.json({
      success: true,
      message: `Préstamo actualizado a estado: ${estadoEnum}`,
      data: updatedLoan
    });
  } catch (error) {
    next(error);
  }
}
