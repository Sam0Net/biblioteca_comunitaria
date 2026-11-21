import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { BookStatus, Prisma } from '@prisma/client';

const bookInputSchema = z.object({
  id: z.string().max(100).optional(),
  titulo: z.string().trim().min(1, 'El título es obligatorio').max(200, 'El título es demasiado largo'),
  autor: z.string().trim().min(1, 'El autor es obligatorio').max(150, 'El autor es demasiado largo'),
  genero: z.string().trim().min(1, 'El género es obligatorio').max(80, 'Género demasiado largo'),
  icono: z.string().trim().max(50).optional(),
  categorias: z.union([z.array(z.string()), z.string()]).optional(),
  formatos: z.union([z.array(z.string()), z.string()]).optional(),
  estado: z.string().optional(),
  copias: z.coerce.number().int('Las copias deben ser un número entero').min(0, 'Las copias no pueden ser negativas').max(1000, 'Máximo 1000 copias').default(1),
  nota: z.coerce.number().min(0, 'La nota mínima es 0').max(5, 'La nota máxima es 5').default(4.5),
  lectores: z.coerce.number().int().min(0).default(0),
  descripcion: z.string().max(2500, 'La descripción es demasiado larga').optional(),
  portada: z.string().max(500).optional(),
  destacado: z.union([z.boolean(), z.string()]).optional()
});

const bookUpdateSchema = bookInputSchema.partial();

export async function getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q, categoria, estado, formato, orden, limit = '50', page = '1' } = req.query;

    const where: Prisma.BookWhereInput = {};

    // Búsqueda por texto libre
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim();
      where.OR = [
        { titulo: { contains: searchTerm, mode: 'insensitive' } },
        { autor: { contains: searchTerm, mode: 'insensitive' } },
        { genero: { contains: searchTerm, mode: 'insensitive' } },
        { descripcion: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Filtro por categoría
    if (categoria && typeof categoria === 'string' && categoria !== 'todos' && categoria.trim()) {
      where.categorias = { has: categoria.trim().toLowerCase() };
    }

    // Filtro por estado
    if (estado && typeof estado === 'string' && estado !== 'todos' && estado.trim()) {
      const estadoEnum = estado.toUpperCase() as BookStatus;
      if (Object.values(BookStatus).includes(estadoEnum)) {
        where.estado = estadoEnum;
      }
    }

    // Filtro por formato
    if (formato && typeof formato === 'string' && formato !== 'todos' && formato.trim()) {
      where.formatos = { has: formato.trim().toLowerCase() };
    }

    // Ordenamiento
    let orderBy: Prisma.BookOrderByWithRelationInput = { createdAt: 'desc' };
    if (orden === 'titulo') {
      orderBy = { titulo: 'asc' };
    } else if (orden === 'nota') {
      orderBy = { nota: 'desc' };
    } else if (orden === 'populares') {
      orderBy = { lectores: 'desc' };
    } else if (orden === 'autor') {
      orderBy = { autor: 'asc' };
    }

    const take = parseInt(limit as string, 10) || 50;
    const skip = ((parseInt(page as string, 10) || 1) - 1) * take;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        take,
        skip
      }),
      prisma.book.count({ where })
    ]);

    res.json({
      success: true,
      data: books,
      pagination: {
        total,
        page: parseInt(page as string, 10) || 1,
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        loans: {
          where: { estado: 'ACTIVO' },
          select: { id: true, fechaDevolucionEsperada: true }
        }
      }
    });

    if (!book) {
      res.status(404).json({ success: false, message: 'Libro no encontrado' });
      return;
    }

    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

export async function createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = bookInputSchema.parse(req.body);

    // Portada: puede venir como archivo subido (req.file) o como URL en el body
    let portada = validated.portada || '/uploads/portada-el-principito.jpg';
    if (req.file) {
      portada = `/uploads/${req.file.filename}`;
    }

    // Procesar categorías y formatos si vienen como string JSON o delimitados por coma
    let categorias: string[] = ['general'];
    if (Array.isArray(validated.categorias)) {
      categorias = validated.categorias.map(c => c.trim().toLowerCase());
    } else if (typeof validated.categorias === 'string') {
      try {
        categorias = JSON.parse(validated.categorias);
      } catch {
        categorias = validated.categorias.split(',').map((c: string) => c.trim().toLowerCase());
      }
    }

    let formatos: string[] = ['impreso'];
    if (Array.isArray(validated.formatos)) {
      formatos = validated.formatos.map(f => f.trim().toLowerCase());
    } else if (typeof validated.formatos === 'string') {
      try {
        formatos = JSON.parse(validated.formatos);
      } catch {
        formatos = validated.formatos.split(',').map((f: string) => f.trim().toLowerCase());
      }
    }

    // Generar ID slug si no viene
    let id = validated.id;
    if (!id || typeof id !== 'string' || !id.trim()) {
      id = validated.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
    }

    const estadoMap: Record<string, BookStatus> = {
      disponible: BookStatus.DISPONIBLE,
      sala: BookStatus.SALA,
      novedad: BookStatus.NOVEDAD,
      prestamo: BookStatus.PRESTAMO
    };

    const estadoVal = (validated.estado && validated.estado.toLowerCase() in estadoMap)
      ? estadoMap[validated.estado.toLowerCase()]
      : (validated.estado && Object.values(BookStatus).includes(validated.estado as BookStatus)
        ? (validated.estado as BookStatus)
        : BookStatus.DISPONIBLE);

    const newBook = await prisma.book.create({
      data: {
        id,
        titulo: validated.titulo,
        autor: validated.autor,
        genero: validated.genero,
        icono: validated.icono || 'menu_book',
        categorias,
        formatos,
        estado: estadoVal,
        copias: validated.copias,
        nota: validated.nota,
        lectores: validated.lectores,
        descripcion: validated.descripcion?.trim() || '',
        portada,
        destacado: validated.destacado === true || validated.destacado === 'true'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente en el catálogo',
      data: newBook
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const validated = bookUpdateSchema.parse(req.body);

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      res.status(404).json({ success: false, message: 'Libro no encontrado para actualizar' });
      return;
    }

    let portada = existingBook.portada;
    if (req.file) {
      portada = `/uploads/${req.file.filename}`;
    } else if (validated.portada) {
      portada = validated.portada;
    }

    let categorias = existingBook.categorias;
    if (validated.categorias) {
      if (Array.isArray(validated.categorias)) {
        categorias = validated.categorias.map(c => c.trim().toLowerCase());
      } else if (typeof validated.categorias === 'string') {
        try {
          categorias = JSON.parse(validated.categorias);
        } catch {
          categorias = validated.categorias.split(',').map((c: string) => c.trim().toLowerCase());
        }
      }
    }

    let formatos = existingBook.formatos;
    if (validated.formatos) {
      if (Array.isArray(validated.formatos)) {
        formatos = validated.formatos.map(f => f.trim().toLowerCase());
      } else if (typeof validated.formatos === 'string') {
        try {
          formatos = JSON.parse(validated.formatos);
        } catch {
          formatos = validated.formatos.split(',').map((f: string) => f.trim().toLowerCase());
        }
      }
    }

    const estadoMap: Record<string, BookStatus> = {
      disponible: BookStatus.DISPONIBLE,
      sala: BookStatus.SALA,
      novedad: BookStatus.NOVEDAD,
      prestamo: BookStatus.PRESTAMO
    };

    let estado = existingBook.estado;
    if (validated.estado) {
      if (validated.estado.toLowerCase() in estadoMap) {
        estado = estadoMap[validated.estado.toLowerCase()];
      } else if (Object.values(BookStatus).includes(validated.estado as BookStatus)) {
        estado = validated.estado as BookStatus;
      }
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        titulo: validated.titulo !== undefined ? validated.titulo.trim() : undefined,
        autor: validated.autor !== undefined ? validated.autor.trim() : undefined,
        genero: validated.genero !== undefined ? validated.genero.trim() : undefined,
        icono: validated.icono || undefined,
        categorias,
        formatos,
        estado,
        copias: validated.copias !== undefined ? validated.copias : undefined,
        nota: validated.nota !== undefined ? validated.nota : undefined,
        lectores: validated.lectores !== undefined ? validated.lectores : undefined,
        descripcion: validated.descripcion !== undefined ? validated.descripcion.trim() : undefined,
        portada,
        destacado: validated.destacado !== undefined ? (validated.destacado === true || validated.destacado === 'true') : undefined
      }
    });

    res.json({
      success: true,
      message: 'Libro actualizado exitosamente',
      data: updatedBook
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      res.status(404).json({ success: false, message: 'Libro no encontrado' });
      return;
    }

    await prisma.book.delete({ where: { id } });
    res.json({ success: true, message: 'Libro eliminado del catálogo' });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const books = await prisma.book.findMany({
      select: { categorias: true }
    });

    const categoryCounts: Record<string, number> = {};
    for (const b of books) {
      for (const cat of b.categorias) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }

    res.json({
      success: true,
      data: categoryCounts
    });
  } catch (error) {
    next(error);
  }
}
