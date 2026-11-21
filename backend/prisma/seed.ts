import { PrismaClient, Role, BookStatus, LoanStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de base de datos PostgreSQL...');

  // Limpiar datos existentes en orden de dependencias
  await prisma.activityRegistration.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear Usuarios Iniciales
  const salt = await bcrypt.genSalt(10);

  // Usuario Admin solicitado por el usuario
  const adminSam0netPassword = await bcrypt.hash('sam0net2026', salt);
  const adminSam0net = await prisma.user.create({
    data: {
      nombre: 'Administrador sam0net',
      email: 'sam0net-taller-web@leernosune.org',
      password: adminSam0netPassword,
      rol: Role.ADMIN,
      carnet: 'ADMIN-SAM0NET',
      dni: '70891234',
      telefono: '987654321',
      direccion: 'Av. Las Gardenias 450'
    }
  });

  // Usuario Admin original de demostración
  const adminLegacyPassword = await bcrypt.hash('Admin2025!', salt);
  await prisma.user.create({
    data: {
      nombre: 'Administrador Principal',
      email: 'admin@leernosune.org',
      password: adminLegacyPassword,
      rol: Role.ADMIN,
      carnet: 'ADMIN-2026',
      dni: '12345678',
      telefono: '999888777',
      direccion: 'Sede Principal - Biblioteca'
    }
  });

  // Usuario Vecino de prueba
  const vecinoPassword = await bcrypt.hash('Vecino2026!', salt);
  const vecino = await prisma.user.create({
    data: {
      nombre: 'María Elena Morales',
      email: 'vecino@leernosune.org',
      password: vecinoPassword,
      rol: Role.VECINO,
      carnet: 'VEC-2026-001',
      dni: '45678912',
      telefono: '912345678',
      direccion: 'Calle Los Sauces 120, Dpto 3B'
    }
  });

  console.log(`✅ Usuarios creados: Admin (${adminSam0net.email}), Vecino (${vecino.email})`);

  // 2. Sembrar Libros desde datos/libros.js
  const librosPath = path.join(__dirname, 'libros_data.json');
  const librosRaw = JSON.parse(fs.readFileSync(librosPath, 'utf8'));

  const statusMap: Record<string, BookStatus> = {
    disponible: BookStatus.DISPONIBLE,
    sala: BookStatus.SALA,
    novedad: BookStatus.NOVEDAD,
    prestamo: BookStatus.PRESTAMO
  };

  let countBooks = 0;
  for (const b of librosRaw) {
    let portadaNormalizada = b.portada || '';
    if (portadaNormalizada.startsWith('img/')) {
      portadaNormalizada = `/uploads/${portadaNormalizada.replace('img/', '')}`;
    }

    const estadoEnum = statusMap[b.estado?.toLowerCase()] || BookStatus.DISPONIBLE;

    await prisma.book.create({
      data: {
        id: b.id,
        titulo: b.titulo,
        autor: b.autor,
        genero: b.genero || 'Literatura',
        icono: b.icono || 'menu_book',
        categorias: Array.isArray(b.categorias) ? b.categorias : ['general'],
        formatos: Array.isArray(b.formatos) ? b.formatos : ['impreso'],
        estado: estadoEnum,
        copias: typeof b.copias === 'number' ? b.copias : 1,
        nota: typeof b.nota === 'number' ? b.nota : 4.5,
        lectores: typeof b.lectores === 'number' ? b.lectores : 0,
        descripcion: b.descripcion || '',
        portada: portadaNormalizada,
        destacado: countBooks < 4 // Los primeros 4 destacados para el home
      }
    });
    countBooks++;
  }
  console.log(`✅ ${countBooks} libros insertados exitosamente en la base de datos.`);

  // 3. Sembrar Actividades de la Agenda
  const actividades = [
    {
      id: 'club-cien-anos',
      titulo: 'Club de lectura: «Cien años de soledad»',
      descripcion: 'Conversación en grupo sobre los primeros capítulos de la novela de García Márquez. Hay café y té para acompañar la charla.',
      fecha: 'Sábado 12 de Noviembre',
      hora: '10:00 a 12:00',
      lugar: 'Sala botánica principal',
      cupos: 20,
      categoria: 'Club de Lectura',
      icono: 'menu_book'
    },
    {
      id: 'taller-sembrando-cuento',
      titulo: 'Taller infantil: sembrando un cuento',
      descripcion: 'Sesión lúdica para niñas y niños de 5 a 11 años: lectura dramatizada de fábulas y creación de su propio libro plegable.',
      fecha: 'Miércoles 16 de Noviembre',
      hora: '16:00 a 17:30',
      lugar: 'Rincón infantil',
      cupos: 15,
      categoria: 'Taller Infantil',
      icono: 'child_care'
    },
    {
      id: 'jornada-donacion',
      titulo: 'Jornada de donación e intercambio',
      descripcion: 'Trae los libros que ya leíste y llévate otros. Las donaciones amplían la colección de la biblioteca vecinal.',
      fecha: 'Sábado 19 de Noviembre',
      hora: '10:00 a 16:00',
      lugar: 'Patio exterior de la sede',
      cupos: 40,
      categoria: 'Comunidad',
      icono: 'volunteer_activism'
    }
  ];

  for (const act of actividades) {
    await prisma.activity.create({ data: act });
  }
  console.log('✅ Actividades comunitarias sembradas.');

  // 4. Crear un Préstamo de demostración
  const fechaPrestamo = new Date();
  const fechaDevolucion = new Date();
  fechaDevolucion.setDate(fechaPrestamo.getDate() + 14);

  await prisma.loan.create({
    data: {
      userId: vecino.id,
      bookId: 'cien-anos-de-soledad',
      fechaSolicitud: fechaPrestamo,
      fechaDevolucionEsperada: fechaDevolucion,
      estado: LoanStatus.ACTIVO,
      notas: 'Préstamo a domicilio por 14 días calendario'
    }
  });
  console.log('✅ Préstamo de demostración creado.');

  console.log('🎉 Siembra completada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
