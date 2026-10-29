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
    "portada": "img/portada-la-felicidad.jpg",
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
    "portada": "img/portada-murmullo-abejas.jpg"
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
    "portada": "img/portada-veinte-poemas-de-amor.jpg",
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
  },
  {
    "id": "tan-poca-vida",
    "titulo": "Tan poca vida",
    "autor": "Hanya Yanagihara",
    "genero": "Novela contemporánea",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "La historia de cuatro amigos en Nueva York a lo largo de las décadas, y de Jude, cuyo pasado doloroso marca todas sus relaciones. Una novela sobre la amistad, el trauma y el cuidado.",
    "portada": "img/portada-tan-poca-vida.jpg",
    "copias": 1
  },
  {
    "id": "el-tunel",
    "titulo": "El túnel",
    "autor": "Ernesto Sabato",
    "genero": "Novela argentina",
    "icono": "menu_book",
    "categorias": [
      "novela",
      "clasicos"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "El pintor Juan Pablo Castel confiesa cómo se fue obsesionando con María Iribarne, la única persona que parecía entender su obra. Una novela breve e intensa sobre la soledad y los celos.",
    "portada": "img/portada-el-tunel.jpg",
    "copias": 1
  },
  {
    "id": "boulevard",
    "titulo": "Boulevard",
    "autor": "Flor M. Salvador",
    "genero": "Romance juvenil",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Novela romántica juvenil de Flor M. Salvador, muy leída entre lectores jóvenes. Esta edición está ilustrada por MMIvens.",
    "portada": "img/portada-boulevard.jpg",
    "copias": 1
  },
  {
    "id": "los-ojos-de-mi-princesa",
    "titulo": "Los ojos de mi princesa",
    "autor": "Carlos Cuauhtémoc Sánchez",
    "genero": "Novela juvenil",
    "icono": "menu_book",
    "categorias": [
      "novela",
      "infantil"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Novela juvenil del escritor mexicano Carlos Cuauhtémoc Sánchez sobre el amor, los valores y la superación personal.",
    "portada": "img/portada-los-ojos-de-mi-princesa.jpg",
    "copias": 1
  },
  {
    "id": "la-vegetariana",
    "titulo": "La vegetariana",
    "autor": "Han Kang",
    "genero": "Novela coreana",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Yeong-hye decide dejar de comer carne tras un sueño perturbador, y su decisión desata la reacción de su familia. Una novela inquietante de la ganadora del Nobel de Literatura 2024.",
    "portada": "img/portada-la-vegetariana.jpg",
    "copias": 1
  },
  {
    "id": "lo-que-no-tiene-nombre",
    "titulo": "Lo que no tiene nombre",
    "autor": "Piedad Bonnett",
    "genero": "Memoria y duelo",
    "icono": "psychology",
    "categorias": [
      "psicoanalisis"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Piedad Bonnett escribe sobre el suicidio de su hijo Daniel y sobre el duelo de quienes se quedan. Un relato íntimo y conmovedor de la poeta colombiana.",
    "portada": "img/portada-lo-que-no-tiene-nombre.jpg",
    "copias": 1
  },
  {
    "id": "indigno-de-ser-humano",
    "titulo": "Indigno de ser humano",
    "autor": "Osamu Dazai",
    "genero": "Novela japonesa",
    "icono": "menu_book",
    "categorias": [
      "novela",
      "clasicos"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Yozo Oba cuenta su vida, marcada por la sensación de no encajar entre los demás. Una novela japonesa de 1948, considerada un clásico del siglo XX.",
    "portada": "img/portada-indigno-de-ser-humano.jpg",
    "copias": 1
  },
  {
    "id": "poesia-completa-pizarnik",
    "titulo": "Poesía completa",
    "autor": "Alejandra Pizarnik",
    "genero": "Poesía argentina",
    "icono": "draw",
    "categorias": [
      "poesia"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Reúne la obra poética de la argentina Alejandra Pizarnik, con su lenguaje breve e intenso sobre la soledad, la noche y el silencio.",
    "portada": "img/portada-poesia-completa-pizarnik.jpg",
    "copias": 1
  },
  {
    "id": "la-metamorfosis",
    "titulo": "La metamorfosis",
    "autor": "Franz Kafka",
    "genero": "Clásico universal",
    "icono": "history_edu",
    "categorias": [
      "clasicos",
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Gregor Samsa despierta una mañana convertido en un enorme insecto, y tanto él como su familia deben enfrentarse a la nueva situación. Un relato breve y perturbador sobre la soledad y la alienación.",
    "portada": "img/portada-la-metamorfosis.jpg",
    "copias": 1
  },
  {
    "id": "noches-blancas",
    "titulo": "Noches blancas",
    "autor": "Fiódor Dostoyevski",
    "genero": "Clásico ruso",
    "icono": "history_edu",
    "categorias": [
      "clasicos",
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Un joven soñador conoce una noche a Nástenka y, en cuatro noches, se enamora de ella. Un relato breve sobre la soledad y las ilusiones, ambientado en San Petersburgo.",
    "portada": "img/portada-noches-blancas.jpg",
    "copias": 1
  },
  {
    "id": "la-tregua",
    "titulo": "La tregua",
    "autor": "Mario Benedetti",
    "genero": "Novela uruguaya",
    "icono": "menu_book",
    "categorias": [
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Martín Santomé, un viudo cercano a la jubilación, lleva un diario de sus días de oficina en Montevideo. Un amor inesperado le ofrece una tregua frente a la rutina.",
    "portada": "img/portada-la-tregua.jpg",
    "copias": 1
  },
  {
    "id": "las-penas-del-joven-werther",
    "titulo": "Las penas del joven Werther",
    "autor": "Johann Wolfgang von Goethe",
    "genero": "Clásico romántico",
    "icono": "history_edu",
    "categorias": [
      "clasicos",
      "novela"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "Werther cuenta en cartas su amor imposible por Lotte. Una novela epistolar de 1774 que marcó el Romanticismo europeo.",
    "portada": "img/portada-las-penas-del-joven-werther-alianza.jpg",
    "copias": 1
  },
  {
    "id": "el-mundo-es-ancho-y-ajeno",
    "titulo": "El mundo es ancho y ajeno",
    "autor": "Ciro Alegría",
    "genero": "Novela peruana",
    "icono": "menu_book",
    "categorias": [
      "novela",
      "clasicos",
      "historia"
    ],
    "formatos": [
      "impreso"
    ],
    "estado": "disponible",
    "nota": 0,
    "lectores": 0,
    "descripcion": "En los Andes peruanos, la comunidad indígena de Rumi pierde sus tierras ante un hacendado poderoso. Una gran novela indigenista publicada en 1941.",
    "portada": "img/portada-el-mundo-es-ancho-y-ajeno.jpg",
    "copias": 1
  }
];
