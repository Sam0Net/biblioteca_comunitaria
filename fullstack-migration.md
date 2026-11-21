# Plan de Modernización Fullstack: Biblioteca Comunitaria "Leer nos une"

> **Objetivo:** Transformar el sitio estático en una aplicación web Fullstack profesional, desacoplada y robusta utilizando Node.js/Express con TypeScript, React con Vite y PostgreSQL gestionado mediante Prisma ORM, respetando estrictamente el sistema de diseño visual definido en `DESIGN.md`.

---

## 🏗️ Arquitectura Técnica del Monorepo

```
biblioteca_comunitaria/
├── backend/                  # Servidor API RESTful (Node.js + Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos relacionales y relaciones
│   │   └── seed.ts           # Semilla con los datos de datos/libros.js y datos/agenda.js
│   ├── src/
│   │   ├── config/           # Variables de entorno y cliente Prisma
│   │   ├── controllers/      # Controladores de lógica de endpoints
│   │   ├── middlewares/      # Autenticación JWT, verificación de roles (admin/vecino), validación Zod
│   │   ├── routes/           # Rutas organizadas: /auth, /libros, /prestamos, /agenda, /usuarios
│   │   └── index.ts          # Inicialización y servidor Express
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Single Page Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── assets/           # Imágenes y recursos heredados de img/
│   │   ├── components/       # Componentes modulares (Navbar, Footer, BookCard, ModalPrestamo, etc.)
│   │   ├── context/          # AuthContext (JWT, estado de sesión, rol de usuario)
│   │   ├── hooks/            # Custom hooks para consumo de API (useLibros, useAgenda, useAuth)
│   │   ├── pages/            # Vistas: Inicio, Catálogo, Servicios, Contacto, Login, Registro, Admin
│   │   ├── services/         # Cliente Axios/Fetch centralizado con interceptores
│   │   ├── styles/           # Tokens de diseño de DESIGN.md (colores botánicos, Fredoka, Plus Jakarta Sans)
│   │   ├── App.tsx           # Router de la aplicación (React Router DOM)
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── datos/                    # Datos estáticos legados (fuente para la migración)
├── DESIGN.md                 # Guía y especificación de tokens visuales y tipográficos
├── DOCUMENTACION.md          # Documentación original del proyecto
└── fullstack-migration.md    # Este plan de trabajo
```

---

## 🗄️ Modelo de Base de Datos Relacional (PostgreSQL + Prisma)

### Entidades Principales:
1. **User**: `id`, `nombre`, `email` (único), `passwordHash`, `rol` (`ADMIN` | `VECINO`), `carnet` (código único), `dni`, `direccion`, `telefono`, `estado`, `createdAt`.
2. **Book**: `id` (slug o uuid), `titulo`, `autor`, `genero`, `icono`, `categorias` (array o relación), `formatos` (array), `estado` (`DISPONIBLE` | `SALA` | `NOVEDAD` | `PRESTAMO`), `copiasDisponibles`, `nota`, `lectores`, `descripcion`, `portadaUrl`, `createdAt`.
3. **Loan / Request (Préstamo)**: `id`, `userId`, `bookId`, `fechaSolicitud`, `fechaDevolucionEsperada`, `fechaDevolucionReal`, `estado` (`PENDIENTE` | `ACTIVO` | `DEVUELTO` | `RECHAZADO`).
4. **Activity (Agenda)**: `id`, `titulo`, `fecha`, `hora`, `lugar`, `cuposTotales`, `cuposDisponibles`, `categoria`, `descripcion`.
5. **ActivityRegistration**: `id`, `userId`, `activityId`, `fechaInscripcion`.

---

## 📋 Fases de Ejecución

### Fase 1: Inicialización del Backend & Configuración de Base de Datos
- **Tarea 1.1:** Inicializar carpeta `/backend` con `package.json`, TypeScript, Express, CORS, dotenv, Prisma y herramientas de desarrollo.
- **Tarea 1.2:** Configurar `prisma/schema.prisma` con la conexión a PostgreSQL y los modelos `User`, `Book`, `Loan`, `Activity`.
- **Tarea 1.3:** Crear script de migración y seed (`prisma/seed.ts`) importando y transformando los 40+ libros de `datos/libros.js` y las actividades de `datos/agenda.js` con contraseñas seguras (bcrypt).
- **Criterio de verificación:** `npx prisma db seed` ejecuta exitosamente y las tablas quedan pobladas en PostgreSQL.

### Fase 2: Implementación de la API REST (Express + TypeScript)
- **Tarea 2.1:** Sistema de autenticación con JWT (registro con carnet vecinal, login, endpoint `/api/auth/me`).
- **Tarea 2.2:** Endpoints públicos y filtrado para `/api/libros` (búsqueda por texto, categoría, orden y disponibilidad).
- **Tarea 2.3:** Endpoints protegidos para préstamos `/api/prestamos` (solicitar préstamo, ver historial personal, aprobación de administrador).
- **Tarea 2.4:** Endpoints de `/api/agenda` (listar actividades e inscribirse) y `/api/contacto`.
- **Tarea 2.5:** Endpoints administrativos `/api/admin` (gestión CRUD de libros, gestión de usuarios vecinales y préstamos).
- **Criterio de verificación:** Pruebas de endpoints con respuestas JSON válidas, códigos de estado HTTP semánticos y validación de permisos.

### Fase 3: Inicialización del Frontend con React + Vite
- **Tarea 3.1:** Crear la aplicación en `/frontend` con Vite + React + TypeScript.
- **Tarea 3.2:** Integrar el sistema de diseño de `DESIGN.md` (tipografías Fredoka y Plus Jakarta Sans, variables de color botánico, contenedores pergamino y botones estilo artesanal).
- **Tarea 3.3:** Configurar React Router DOM y AuthContext para gestión de sesión persistente con JWT.
- **Criterio de verificación:** La aplicación compila sin errores y levanta en el servidor de desarrollo Vite con la identidad visual exacta.

### Fase 4: Migración e Implementación de Componentes y Vistas
- **Tarea 4.1:** **Inicio (`/`)**: Navbar responsivo, Hero, carrusel/grid de libros destacados conectados a la API, agenda comunitaria y sección interactiva.
- **Tarea 4.2:** **Catálogo (`/libros`)**: Barra de búsqueda interactiva en tiempo real, filtros por categoría/formato, alternador de vista cuadrícula/lista, y modal de detalle/solicitud de libro.
- **Tarea 4.3:** **Servicios y Agenda (`/servicios`)**: Horarios de salas, servicios vecinales y botón de inscripción a talleres.
- **Tarea 4.4:** **Autenticación (`/login` y `/registro`)**: Formularios validados para iniciar sesión y solicitar carnet vecinal con DNI.
- **Tarea 4.5:** **Panel de Administración (`/admin`)**: Dashboard con métricas, inventario de libros (crear, editar, eliminar), lista de vecinos registrados y aprobación de préstamos en tiempo real.
- **Criterio de verificación:** Navegación fluida entre todas las rutas con carga reactiva de datos reales desde el backend.

### Fase 5: Conexión Integral, Pruebas y Pulido Final
- **Tarea 5.1:** Conexión completa Frontend ↔ Backend (manejo de errores de red, loaders/skeletons de carga, toasts de notificación).
- **Tarea 5.2:** Migración de recursos multimedia y estáticos (imágenes de portadas).
- **Tarea 5.3:** Auditoría de calidad: validación de tipos TypeScript, verificación de roles protegidos y pruebas funcionales end-to-end de flujo de usuario y administrador.
- **Criterio de verificación:** Un usuario nuevo puede registrarse, explorar el catálogo, solicitar un libro en préstamo; y el administrador puede aprobarlo y agregar nuevos títulos desde el panel.
