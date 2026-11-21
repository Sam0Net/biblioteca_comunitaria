import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  // Manejo estructurado de errores de validación de Zod
  if (err instanceof ZodError || err.name === 'ZodError') {
    const formattedErrors = err.errors?.map((e: any) => ({
      campo: e.path.join('.'),
      mensaje: e.message
    }));

    res.status(400).json({
      success: false,
      message: 'Error de validación en los datos enviados',
      errors: formattedErrors
    });
    return;
  }

  // Manejo de errores de Multer (subida de archivos / extensiones inválidas)
  if (err.name === 'MulterError' || err.message?.includes('Solo se aceptan imágenes') || err.message?.includes('Formato de archivo')) {
    res.status(400).json({
      success: false,
      message: err.message || 'Error al procesar el archivo subido'
    });
    return;
  }

  console.error('⚠️ Error no controlado en el servidor:', err);

  const statusCode = err.statusCode || (typeof err.status === 'number' ? err.status : 500);
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Ocurrió un error interno en el servidor'
    : (err.message || 'Error interno del servidor');

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
