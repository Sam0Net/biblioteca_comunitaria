/* ==========================================================================
   AGENDA Y HORARIO (datos)
   De aquí salen las actividades del inicio (index.html) y la tabla de horario de servicios.html.
   Para agregar, cambiar o quitar algo basta con editar estos arreglos: agenda.js dibuja el resto.

   ACTIVIDADES: dia y mes (fecha), modalidad, titulo, descripcion, cuando, lugar y
     - cupos: plazas totales e inscritos: los que ya se anotaron en la sede.
     - Si cupos es null la actividad no necesita inscripción: se muestra "Entrada libre" y el enlace de enlace/textoEnlace.
   HORARIO_SALAS: dia, espacio, abre y cierra (formato 24 h, "HH:MM"), actividad, aforo (número) y unidad.
     Las filas seguidas del mismo día se agrupan solas bajo un único encabezado.
   Los lugares y los aforos de las actividades coinciden con el horario: no superan el aforo de su sala.
   ========================================================================== */
window.ACTIVIDADES = [
  {
    id: "club-cien-anos",
    dia: 12,
    mes: "Sep",
    modalidad: "Presencial",
    titulo: "Club de lectura: «Cien años de soledad»",
    descripcion: "Conversación en grupo sobre los primeros capítulos de la novela de García Márquez. Hay café y té para acompañar la charla.",
    cuando: "Sábado, 10:00 a 12:00",
    lugar: "Sala botánica principal",
    cupos: 20,
    inscritos: 13,
  },
  {
    id: "taller-sembrando-cuento",
    dia: 16,
    mes: "Sep",
    modalidad: "Familiar",
    titulo: "Taller infantil: sembrando un cuento",
    descripcion: "Sesión lúdica para niñas y niños de 5 a 11 años: lectura dramatizada de fábulas y creación de su propio libro plegable.",
    cuando: "Miércoles, 16:00 a 17:30",
    lugar: "Rincón infantil",
    cupos: 15,
    inscritos: 14,
  },
  {
    id: "jornada-donacion",
    dia: 19,
    mes: "Sep",
    modalidad: "Comunidad",
    titulo: "Jornada de donación e intercambio",
    descripcion: "Trae los libros que ya leíste y llévate otros. Las donaciones amplían la colección de la biblioteca.",
    cuando: "Sábado, 10:00 a 16:00",
    lugar: "Patio exterior de la sede",
    cupos: null,
    enlace: "pages/contacto.html#preguntas-frecuentes",
    textoEnlace: "Cómo donar",
  },
];

window.HORARIO_SALAS = [
  { dia: "Lunes a viernes", espacio: "Sala de lectura silenciosa", abre: "08:30", cierra: "19:30", actividad: "Estudio individual, lectura e investigación", aforo: 30, unidad: "personas" },
  { dia: "Lunes a viernes", espacio: "Jardín botánico y mesas de trabajo", abre: "09:00", cierra: "18:30", actividad: "Lectura al aire libre, wifi y tertulias", aforo: 35, unidad: "personas" },
  { dia: "Miércoles", espacio: "Rincón infantil", abre: "16:00", cierra: "17:30", actividad: "Taller infantil de cuentacuentos y títeres", aforo: 15, unidad: "niños con sus tutores" },
  { dia: "Sábados", espacio: "Sala botánica principal", abre: "09:00", cierra: "16:00", actividad: "Clubes de lectura y café literario", aforo: 25, unidad: "personas" },
  { dia: "Domingos", espacio: "Patio exterior", abre: "10:00", cierra: "14:00", actividad: "Intercambio de libros y donaciones vecinales", aforo: 25, unidad: "personas" },
];
