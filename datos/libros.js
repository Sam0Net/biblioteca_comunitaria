/* ==========================================================================
   CATÁLOGO DE LIBROS (datos)
   Este archivo es la fuente de los libros que se ven en libros.html.
   - No hace falta tocarlo a mano: el administrador agrega, edita y quita libros
     desde admin.html y descarga aquí el archivo actualizado ("Descargar libros actualizados").
   - Para publicar los cambios: reemplazar este archivo y subirlo al repositorio.
   - Campos: id, titulo, autor, genero (texto de la tarjeta), icono, categorias,
     formatos, estado (disponible | sala | novedad | prestamo), copias (solo si está
     disponible), nota (0 a 5), lectores, descripcion y portada (img/archivo.jpg o enlace https).
   ========================================================================== */
window.LIBROS_ORIGINALES = [
  {
    "id": "cien-anos-de-soledad",
    "titulo": "Cien años de soledad",
    "autor": "Gabriel García Márquez",
    "genero": "Novela / Realismo Mágico",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso",
      "ilustrado"
    ],
    "estado": "disponible",
    "nota": 4.9,
    "lectores": 48,
    "descripcion": "La épica historia de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo. Edición conmemorativa ilustrada.",
    "portada": "img/cien-anos-soledad.jpg",
    "copias": 3
  },
  {
    "id": "la-felicidad",
    "titulo": "La felicidad",
    "autor": "Gabriel Rolón",
    "genero": "Psicoanálisis & Vida",
    "icono": "psychology",
    "categorias": [
      "psicoanalisis"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 4.7,
    "lectores": 31,
    "descripcion": "Una lúcida indagación sobre el anhelo más universal: desentrañar la dicha desde la emoción, el duelo y los vínculos humanos.",
    "portada": "https://lh3.googleusercontent.com/aida-public/AB6AXuD3t7UebnA1ihuXHCDBdjB2jju0-y0B4UFBrUsFFZ8_Cu1HNXOom71TLG9c6hNCL96qARz8IVrQPOoClgU__kH0pGgOCYl85hIYiaE7RI93c7CiN39XHH3VAP64Cv5ZdpkrKm7TxWCVqSspNoiljPzW6Sc9e_zkN5MZDFYwDydhuE4xnRui0sUVivcN3etV7FG5SDKqvYenmPrPi3IMCfB0Blje9-arb9R-bsmmvVU5kpex5B-3PqDB",
    "copias": 2
  },
  {
    "id": "don-quijote-de-la-mancha",
    "titulo": "Don Quijote de la Mancha",
    "autor": "Miguel de Cervantes",
    "genero": "Clásico Universal",
    "icono": "history_edu",
    "categorias": [
      "clasicos"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "sala",
    "nota": 5.0,
    "lectores": 64,
    "descripcion": "La cumbre de la literatura en castellano, en una magnífica edición disponible para consulta en mesas de estudio y jardín.",
    "portada": "img/portada-don-quijote.jpg"
  },
  {
    "id": "el-principito",
    "titulo": "El principito",
    "autor": "Antoine de Saint-Exupéry",
    "genero": "Infantil / Filosofía",
    "icono": "child_care",
    "categorias": [
      "clasicos",
      "infantil"
    ],
    "formatos": [
      "impreso",
      "ilustrado"
    ],
    "estado": "disponible",
    "nota": 5.0,
    "lectores": 92,
    "descripcion": "\"Lo esencial es invisible a los ojos\". Una fábula inmortal con las acuarelas originales del autor para disfrutar en familia.",
    "portada": "img/portada-el-principito.jpg",
    "copias": 5
  },
  {
    "id": "el-murmullo-de-las-abejas",
    "titulo": "El murmullo de las abejas",
    "autor": "Sofía Segovia",
    "genero": "Ficción Histórica",
    "icono": "menu_book",
    "categorias": [
      "novela",
      "historia"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "novedad",
    "nota": 4.8,
    "lectores": 19,
    "descripcion": "En medio de la Revolución mexicana, un niño con un velo de abejas transforma para siempre el destino de una familia en Linares.",
    "portada": "img/portada-el-murmullo-de-las-abejas.jpg"
  },
  {
    "id": "la-vida-secreta-de-las-plantas",
    "titulo": "La vida secreta de las plantas",
    "autor": "Peter Tompkins & Christopher Bird",
    "genero": "Botánica & Naturaleza",
    "icono": "eco",
    "categorias": [
      "ciencia"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 4.3,
    "lectores": 22,
    "descripcion": "Fascinante viaje por las relaciones físicas y emocionales entre plantas y seres humanos. La inspiración de nuestro jardín.",
    "portada": "img/portada-vida-secreta-plantas.jpg",
    "copias": 1
  },
  {
    "id": "rayuela",
    "titulo": "Rayuela",
    "autor": "Julio Cortázar",
    "genero": "Literatura Latinoamericana",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 4.9,
    "lectores": 53,
    "descripcion": "Un contranovelón lúdico y deslumbrante entre París y Buenos Aires, donde cada lector elige su propio laberinto de lectura.",
    "portada": "img/portada-rayuela.jpg",
    "copias": 2
  },
  {
    "id": "veinte-poemas-de-amor",
    "titulo": "Veinte poemas de amor",
    "autor": "Pablo Neruda",
    "genero": "Poesía Iberoamericana",
    "icono": "draw",
    "categorias": [
      "poesia"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 4.8,
    "lectores": 41,
    "descripcion": "El libro lírico más leído y compartido del siglo XX. Incluye versos célebres como \"Puedo escribir los versos más tristes esta noche\".",
    "portada": "img/portada-veinte-poemas.jpg",
    "copias": 1
  },
  {
    "id": "el-jardin-secreto",
    "titulo": "El jardín secreto",
    "autor": "Frances Hodgson Burnett",
    "genero": "Infantil & Juvenil",
    "icono": "yard",
    "categorias": [
      "infantil"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 4.9,
    "lectores": 38,
    "descripcion": "El poder curativo de la naturaleza y la amistad contado a través de un jardín olvidado que vuelve a la vida gracias a tres niños.",
    "portada": "img/portada-el-jardin-secreto.jpg",
    "copias": 3
  }
];
