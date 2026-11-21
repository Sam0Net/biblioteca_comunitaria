import rateLimit from 'express-rate-limit';

/**
 * Limitador estricto para rutas de autenticación (Login y Registro)
 * Previene ataques de fuerza bruta y credential stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Máximo 15 intentos por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de acceso desde esta IP. Por favor espera 15 minutos.'
  }
});

/**
 * Limitador para formularios públicos como contacto/sugerencias
 * Previene spam y flooding de la base de datos.
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Máximo 5 mensajes por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has enviado varios mensajes recientemente. Por favor espera antes de enviar otro.'
  }
});

/**
 * Limitador para solicitudes de préstamo
 * Previene abuso de transacciones de inventario.
 */
export const loanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has alcanzado el límite de solicitudes de préstamo temporales. Espera unos minutos.'
  }
});

/**
 * Limitador global para la API
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Límite amplio para navegación general
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes al servicio. Por favor disminuye la frecuencia.'
  }
});
