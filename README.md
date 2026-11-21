# Biblioteca Comunitaria «Leer nos une» — Plataforma Web Fullstack

Plataforma web completa y funcional con arquitectura desacoplada: **Backend RESTful en Node.js + Express con TypeScript**, base de datos relacional **PostgreSQL con Prisma ORM**, y cliente **Frontend SPA en React con Vite**.

---

## 🚀 Arquitectura y Tecnologías

| Capa | Tecnologías | Descripción |
|---|---|---|
| **Backend** | Node.js, Express, TypeScript, Zod, JWT, Bcrypt, Multer | API RESTful con autenticación robusta por tokens y cookies HttpOnly, autorización por roles y subida de portadas |
| **Frontend** | React 18, Vite, TypeScript, React Router DOM, Axios | SPA reactiva con componentes modulares basada en el sistema de diseño botánico de `DESIGN.md` |
| **Base de Datos** | PostgreSQL, Prisma ORM | Modelos relacionales con integridad referencial: usuarios, libros, préstamos, actividades y contacto |
| **Almacenamiento** | Servidor estático `/uploads` + soporte de URLs externas | Gestión dual para portadas locales históricas, nuevas subidas multipart y enlaces externos |

---

## 👥 Cuentas de Acceso Preconfiguradas

| Rol | Usuario / Correo | Contraseña | Carnet Digital |
|---|---|---|---|
| **Admin sam0net** | `sam0net-taller-web@leernosune.org` *(o `sam0net-taller-web`)* | `sam0net2026` | `ADMIN-SAM0NET` |
| **Admin Principal** | `admin@leernosune.org` | `Admin2025!` | `ADMIN-2026` |
| **Lector Vecino** | `vecino@leernosune.org` | `Vecino2026!` | `VEC-2026-001` |

*También puedes registrar un nuevo vecino en cualquier momento desde `/registro` para obtener un carnet generado automáticamente.*

---

## 🛠️ Requisitos Previos

- **Node.js** (v18 o superior) y **npm**
- **PostgreSQL** activo en el puerto 5432 con la base de datos `biblioteca_db` (ya configurada con el usuario `sam0net_taller_web`).

---

## 📦 Puesta en Marcha

### 1. Iniciar el Backend (Puerto 4000)

En una terminal:

```bash
cd backend
npm install
npx prisma db push
npx tsx prisma/seed.ts   # Si deseas re-sembrar los 22 libros y usuarios iniciales
npm run dev
```

El servidor quedará disponible en `http://localhost:4000`.

### 2. Iniciar el Frontend (Puerto 5173)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 🌟 Módulos y Funcionalidades Implementadas

### 📖 Catálogo y Libros (`/libros`)
- Búsqueda en tiempo real por texto (título, autor, sinopsis).
- Filtros dinámicos por categorías (`#novela`, `#clasicos`, `#filosofia`, `#infantil`, etc.).
- Filtro por estado: Disponibles, Lectura en sala, Novedades.
- Alternador de vista en **Cuadrícula** o **Lista**.
- Modal de ficha técnica interactiva.

### 📋 Préstamos a Domicilio
- Solicitud de préstamo en 1 clic para vecinos registrados con elección de plazo (7, 14 o 21 días).
- Validación de copias en tiempo real (descuenta stock en la base de datos PostgreSQL).
- Control de ejemplares exclusivos para sala de lectura.

### 👑 Panel de Administración (`/admin`)
- **Métricas:** Conteo en tiempo real de títulos, usuarios registrados, préstamos en curso y pendientes.
- **Gestión de Libros (CRUD):** Agregar libros subiendo imagen local o ingresando URL externa, editar datos y eliminar.
- **Gestión de Préstamos:** Aprobar entregas pendientes, registrar devoluciones y restaurar copias al inventario.
- **Padrón de Vecinos:** Lista de lectores registrados y control de activación/suspensión de cuentas.
- **Bandeja de Entrada:** Recepción de mensajes del formulario de contacto.

### 📅 Agenda y Horario de Salas (`/servicios`)
- Cronograma semanal de espacios y aforos.
- Inscripción interactiva a talleres comunitarios con control de cupos máximos.

### 📬 Contacto y FAQ (`/contacto`)
- Formulario funcional con almacenamiento en base de datos.
- Canales de atención y preguntas frecuentes.
