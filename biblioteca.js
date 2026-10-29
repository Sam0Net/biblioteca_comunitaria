/* ==========================================================================
   CATÁLOGO DE LIBROS (maqueta sin servidor)
   - Los libros originales viven en datos/libros.js (window.LIBROS_ORIGINALES).
   - El administrador los cambia desde admin.html: los cambios se guardan en este navegador
     (localStorage) y se ven al instante. Para que los vea todo el mundo, descarga el archivo
     actualizado y reemplaza datos/libros.js en el repositorio.
   - Solo el administrador puede agregar, editar o quitar (se comprueba con Auth.esAdmin()).
     Igual que en auth.js: es una simulación, no seguridad real.
   ========================================================================== */
(() => {
  const CLAVE = "bibliotecaLibros";

  const CATEGORIAS = {
    novela: "Novela y Narrativa",
    psicoanalisis: "Psicoanálisis y Crecimiento",
    clasicos: "Clásicos Universales",
    infantil: "Infantil y Juvenil",
    ciencia: "Ciencia, Botánica y Huertos",
    poesia: "Poesía y Teatro",
    historia: "Historia y Comunidad",
  };
  const ICONOS = {
    novela: "menu_book",
    psicoanalisis: "psychology",
    clasicos: "history_edu",
    infantil: "child_care",
    ciencia: "eco",
    poesia: "draw",
    historia: "menu_book",
  };
  const FORMATOS = { impreso: "Libro impreso", audiolibro: "Audiolibro", "letra-grande": "Letra grande", ilustrado: "Ilustrado" };
  const ESTADOS = { disponible: "Disponible", sala: "Solo en sala", novedad: "Novedad donada", prestamo: "Prestado" };

  const originales = () => (Array.isArray(window.LIBROS_ORIGINALES) ? window.LIBROS_ORIGINALES : []);
  const copiar = (valor) => JSON.parse(JSON.stringify(valor));

  // Huella sencilla de los datos originales: si el archivo cambia, los cambios guardados en el navegador se descartan
  function huella(texto) {
    let h = 0;
    for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) | 0;
    return String(h);
  }
  const huellaOriginales = () => huella(JSON.stringify(originales()));

  function leerGuardado() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (guardado && guardado.huella === huellaOriginales() && Array.isArray(guardado.libros)) return guardado.libros;
    } catch (error) {
      /* sin almacenamiento o datos dañados: se usan los originales */
    }
    return null;
  }

  function escribirGuardado(libros) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ huella: huellaOriginales(), libros }));
      return true;
    } catch (error) {
      return false;
    }
  }

  function libros() {
    return copiar(leerGuardado() || originales());
  }

  const sinPermiso = { ok: false, error: "Solo el administrador puede cambiar los libros." };
  const puede = () => !!(window.Auth && window.Auth.esAdmin());

  const PORTADA_VALIDA = /^(img\/[\w\-. ]+\.(jpe?g|png|webp|avif|gif)|https:\/\/\S+)$/i;
  const quitarTildes = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Revisa y limpia los datos que llegan del formulario; devuelve { ok, libro } o { ok:false, error, campo }
  function validar(datos, lista, idActual) {
    const texto = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
    const titulo = texto(datos.titulo);
    const autor = texto(datos.autor);
    const genero = texto(datos.genero) || "Libro";
    const descripcion = texto(datos.descripcion);
    const portada = texto(datos.portada);
    const categorias = (datos.categorias || []).filter((c) => c in CATEGORIAS);
    const formatos = (datos.formatos || []).filter((f) => f in FORMATOS);
    const estado = datos.estado in ESTADOS ? datos.estado : "";

    if (!titulo) return { ok: false, campo: "titulo", error: "Escribe el título del libro." };
    if (titulo.length > 120) return { ok: false, campo: "titulo", error: "El título es demasiado largo (máximo 120 letras)." };
    if (!autor) return { ok: false, campo: "autor", error: "Escribe el nombre del autor o la autora." };
    if (!categorias.length) return { ok: false, campo: "categorias", error: "Elige al menos una categoría para que el libro aparezca en los filtros." };
    if (!descripcion) return { ok: false, campo: "descripcion", error: "Escribe una descripción corta del libro." };
    if (descripcion.length > 400) return { ok: false, campo: "descripcion", error: "La descripción es demasiado larga (máximo 400 letras)." };
    if (!estado) return { ok: false, campo: "estado", error: "Elige la disponibilidad del libro." };
    if (!PORTADA_VALIDA.test(portada) || portada.includes("..")) {
      return { ok: false, campo: "portada", error: "La portada debe ser un archivo de la carpeta img (por ejemplo img/mi-libro.jpg) o un enlace que empiece con https://." };
    }
    if (lista.some((l) => l.id !== idActual && quitarTildes(l.titulo).toLowerCase() === quitarTildes(titulo).toLowerCase() && quitarTildes(l.autor).toLowerCase() === quitarTildes(autor).toLowerCase())) {
      return { ok: false, campo: "titulo", error: "Ese libro ya está en el catálogo." };
    }

    const libro = {
      id: idActual || "",
      titulo,
      autor,
      genero,
      icono: ICONOS[categorias[0]],
      categorias,
      formatos: formatos.length ? formatos : ["impreso"],
      estado,
      nota: Math.min(5, Math.max(0, Number(datos.nota) || 0)),
      lectores: Math.max(0, Math.floor(Number(datos.lectores) || 0)),
      descripcion,
      portada,
    };
    if (estado === "disponible") libro.copias = Math.min(99, Math.max(1, Math.floor(Number(datos.copias) || 1)));
    return { ok: true, libro };
  }

  function nuevoId(titulo, lista) {
    const base = quitarTildes(titulo).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "libro";
    let id = base;
    for (let n = 2; lista.some((l) => l.id === id); n++) id = base + "-" + n;
    return id;
  }

  function guardarLista(lista, extra) {
    if (!escribirGuardado(lista)) {
      return { ok: false, error: "Tu navegador no deja guardar los cambios. Revisa que no esté en modo privado." };
    }
    return { ok: true, ...extra };
  }

  const textoEstado = (libro) => {
    if (libro.estado === "disponible") return libro.copias + (libro.copias === 1 ? " Disponible" : " Disponibles");
    return { sala: "En Sala de Lectura", novedad: "Novedad Donada", prestamo: "Prestado" }[libro.estado];
  };

  const Biblioteca = {
    categorias: CATEGORIAS,
    formatos: FORMATOS,
    estados: ESTADOS,
    textoEstado,
    libros,

    agregar(datos) {
      if (!puede()) return sinPermiso;
      const lista = libros();
      const r = validar(datos, lista, "");
      if (!r.ok) return r;
      r.libro.id = nuevoId(r.libro.titulo, lista);
      lista.push(r.libro);
      return guardarLista(lista, { libro: r.libro });
    },

    editar(id, datos) {
      if (!puede()) return sinPermiso;
      const lista = libros();
      const posicion = lista.findIndex((l) => l.id === id);
      if (posicion < 0) return { ok: false, error: "No encontramos ese libro. Recarga la página." };
      const r = validar({ nota: lista[posicion].nota, lectores: lista[posicion].lectores, ...datos }, lista, id);
      if (!r.ok) return r;
      lista[posicion] = r.libro;
      return guardarLista(lista, { libro: r.libro });
    },

    quitar(id) {
      if (!puede()) return sinPermiso;
      const lista = libros();
      const libro = lista.find((l) => l.id === id);
      if (!libro) return { ok: false, error: "No encontramos ese libro. Recarga la página." };
      return guardarLista(
        lista.filter((l) => l.id !== id),
        { libro }
      );
    },

    restaurar() {
      if (!puede()) return sinPermiso;
      try {
        localStorage.removeItem(CLAVE);
      } catch (error) {
        /* sin almacenamiento: nada que restaurar */
      }
      return { ok: true };
    },

    // Texto listo para guardar como datos/libros.js
    exportar() {
      if (!puede()) return "";
      return (
        "/* Catálogo de libros. Reemplaza datos/libros.js con este archivo y súbelo al repositorio.\n" +
        "   Campos: id, titulo, autor, genero, icono, categorias, formatos, estado (disponible | sala | novedad | prestamo),\n" +
        "   copias (solo si está disponible), nota (0 a 5), lectores, descripcion y portada. */\n" +
        "window.LIBROS_ORIGINALES = " +
        JSON.stringify(libros(), null, 2) +
        ";\n"
      );
    },

    // ¿Hay cambios del admin sin publicar en datos/libros.js?
    hayCambiosLocales() {
      return leerGuardado() !== null;
    },

    // Arma la tarjeta de un libro (misma estructura que usaban las tarjetas escritas a mano)
    // enlace=true: tarjeta del inicio, cuyo botón lleva al catálogo en vez de reservar
    crearTarjeta(libro, indice, enlace) {
      const el = (etiqueta, clase, contenido) => {
        const nodo = document.createElement(etiqueta);
        if (clase) nodo.className = clase;
        if (contenido != null) nodo.textContent = contenido;
        return nodo;
      };
      const icono = (nombre, clase) => {
        const nodo = el("span", "material-symbols-outlined" + (clase ? " " + clase : ""), nombre);
        nodo.setAttribute("aria-hidden", "true");
        return nodo;
      };

      const tarjeta = el("article", "tarjeta-libro");
      tarjeta.dataset.id = libro.id;
      tarjeta.dataset.categorias = libro.categorias.join(" ");
      tarjeta.dataset.formatos = libro.formatos.join(" ");

      const cuerpo = el("div", "cuerpo-tarjeta");

      const contenedor = el("div", "contenedor-portada");
      const imagen = el("img", "imagen-portada");
      imagen.src = libro.portada;
      imagen.alt = "Portada de " + libro.titulo + " de " + libro.autor;
      if (indice > 0) imagen.loading = "lazy";
      imagen.decoding = "async";
      const insignia = el("div", "insignia-disponibilidad " + libro.estado);
      if (libro.estado === "sala" || libro.estado === "novedad") {
        insignia.append(icono(libro.estado === "sala" ? "menu_book" : "auto_awesome"));
      } else {
        insignia.append(el("span", "punto-estado"));
      }
      insignia.append(el("span", "", textoEstado(libro)));
      contenedor.append(imagen, el("div", "sombra-lomo"), insignia);

      const genero = el("div", "genero-libro");
      genero.append(icono(libro.icono), el("span", "", libro.genero));

      const calificacion = el("div", "calificacion-libro");
      if (libro.lectores > 0 && libro.nota > 0) {
        const estrellas = el("div", "estrellas");
        const enteras = Math.floor(libro.nota);
        const fraccion = libro.nota - enteras;
        // 4.9 o más cuenta como 5 estrellas; de 4.3 a 4.8 se muestra media estrella (igual que las tarjetas originales)
        const llenas = fraccion >= 0.85 ? enteras + 1 : enteras;
        for (let i = 0; i < llenas; i++) estrellas.append(icono("star"));
        if (fraccion >= 0.25 && fraccion < 0.85) estrellas.append(icono("star_half"));
        calificacion.append(estrellas, el("span", "texto-lectores", libro.nota.toFixed(1) + " (" + libro.lectores + " lectores)"));
      } else {
        calificacion.append(el("span", "texto-lectores", "Aún sin valoraciones"));
      }

      cuerpo.append(contenedor, genero, el("h3", "titulo-libro", libro.titulo), el("p", "autor-libro", libro.autor), calificacion, el("p", "descripcion-libro", libro.descripcion));

      const acciones = el("div", "acciones-tarjeta");
      const sala = libro.estado === "sala";
      const accion = el(enlace ? "a" : "button", sala ? "boton-accion-secundario" : "boton-accion-primario");
      if (enlace) accion.href = "libros.html";
      else accion.type = "button";
      accion.append(icono(sala ? "chair" : "bookmark_add"), el("span", "", enlace ? "Ver en Catálogo" : sala ? "Pedir en Sala" : "Reservar"));
      if (enlace) {
        acciones.append(accion);
        tarjeta.append(cuerpo, acciones);
        return tarjeta;
      }
      const info = el("button", "boton-accion-info");
      info.type = "button";
      info.setAttribute("aria-label", "Ver detalles y opiniones de " + libro.titulo);
      info.title = "Ver detalles y opiniones";
      info.append(icono("info"));
      acciones.append(accion, info);

      tarjeta.append(cuerpo, acciones);
      return tarjeta;
    },
  };

  // ---- Donaciones: cualquier usuario con sesión las envía y solo el administrador las acepta o rechaza ----
  // Se guardan en este navegador (igual que las cuentas); el admin ve las de ese mismo navegador.
  const CLAVE_DONACIONES = "bibliotecaDonaciones";
  const ESTADOS_LIBRO = { nuevo: "Como nuevo", bueno: "Buen estado", usado: "Usado" };
  const SITUACIONES = { pendiente: "Pendiente", aceptada: "Aceptada", rechazada: "Rechazada" };

  function leerDonaciones() {
    try {
      const lista = JSON.parse(localStorage.getItem(CLAVE_DONACIONES) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch (error) {
      return [];
    }
  }

  function escribirDonaciones(lista) {
    try {
      localStorage.setItem(CLAVE_DONACIONES, JSON.stringify(lista));
      return true;
    } catch (error) {
      return false;
    }
  }

  const sesionActual = () => (window.Auth ? window.Auth.sesion() : null);
  const limpiar = (valor) => String(valor == null ? "" : valor).replace(/\s+/g, " ").trim();

  Object.assign(Biblioteca, {
    estadosLibro: ESTADOS_LIBRO,
    situaciones: SITUACIONES,

    donar(datos) {
      const sesion = sesionActual();
      if (!sesion) return { ok: false, error: "Inicia sesión para donar un libro." };
      if (sesion.rol === "admin") return { ok: false, error: "El administrador agrega libros directamente desde el panel." };
      const titulo = limpiar(datos.titulo);
      const autor = limpiar(datos.autor);
      const comentario = limpiar(datos.comentario);
      const estado = datos.estado in ESTADOS_LIBRO ? datos.estado : "";
      if (!titulo) return { ok: false, campo: "titulo", error: "Escribe el título del libro que quieres donar." };
      if (titulo.length > 120) return { ok: false, campo: "titulo", error: "El título es demasiado largo (máximo 120 letras)." };
      if (!autor) return { ok: false, campo: "autor", error: "Escribe el nombre del autor o la autora." };
      if (!estado) return { ok: false, campo: "estado", error: "Elige en qué estado está el libro." };
      if (comentario.length > 300) return { ok: false, campo: "comentario", error: "El comentario es demasiado largo (máximo 300 letras)." };
      const lista = leerDonaciones();
      const donacion = {
        id: "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        titulo,
        autor,
        estado,
        comentario,
        nombre: sesion.nombre,
        correo: sesion.correo,
        fecha: new Date().toISOString(),
        situacion: "pendiente",
        motivo: "",
      };
      lista.push(donacion);
      if (!escribirDonaciones(lista)) {
        return { ok: false, error: "Tu navegador no deja guardar la donación. Revisa que no esté en modo privado." };
      }
      return { ok: true, donacion };
    },

    // Cada usuario ve solo las suyas
    misDonaciones() {
      const sesion = sesionActual();
      if (!sesion) return [];
      return leerDonaciones()
        .filter((d) => d.correo === sesion.correo)
        .reverse();
    },

    // Solo el administrador ve todas
    donaciones() {
      return puede() ? leerDonaciones().reverse() : [];
    },

    resolverDonacion(id, aceptada, motivo) {
      if (!puede()) return sinPermiso;
      const lista = leerDonaciones();
      const donacion = lista.find((d) => d.id === id);
      if (!donacion) return { ok: false, error: "No encontramos esa donación. Recarga la página." };
      donacion.situacion = aceptada ? "aceptada" : "rechazada";
      donacion.motivo = aceptada ? "" : limpiar(motivo).slice(0, 200);
      if (!escribirDonaciones(lista)) return { ok: false, error: "Tu navegador no deja guardar los cambios." };
      return { ok: true, donacion };
    },
  });

  window.Biblioteca = Biblioteca;

  // En libros.html: dibuja el catálogo antes de que arranque el script de la página (este archivo va con defer)
  const rejilla = document.querySelector(".rejilla-libros");
  if (rejilla && rejilla.closest("main")) {
    rejilla.replaceChildren(...libros().map((libro, i) => Biblioteca.crearTarjeta(libro, i)));
  }

  // En index.html: los 4 libros con más lectores (la sección se llama "Libros más leídos")
  const destacados = document.querySelector(".rejilla-destacados-inicio");
  if (destacados) {
    const masLeidos = libros()
      .sort((a, b) => b.lectores - a.lectores || b.nota - a.nota)
      .slice(0, 4);
    destacados.replaceChildren(...masLeidos.map((libro, i) => Biblioteca.crearTarjeta(libro, i + 1, true)));
  }
})();
