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
    novela: "Novela",
    psicoanalisis: "Psicoanálisis",
    clasicos: "Clásicos",
    infantil: "Infantil y juvenil",
    ciencia: "Ciencia y huertos",
    poesia: "Poesía y teatro",
    historia: "Historia",
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
  const FORMATOS = { impreso: "Impreso", audiolibro: "Audiolibro", "letra-grande": "Letra grande", ilustrado: "Ilustrado" };
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
    if (libro.estado === "disponible") return libro.copias + (libro.copias === 1 ? " disponible" : " disponibles");
    return { sala: "En sala de lectura", novedad: "Novedad donada", prestamo: "Prestado" }[libro.estado];
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

    // Arma la tarjeta de un libro: portada completa, título, autor y disponibilidad.
    // El título abre la ventana de detalles y el botón reserva o pide en sala.
    crearTarjeta(libro, indice) {
      const el = (etiqueta, clase, contenido) => {
        const nodo = document.createElement(etiqueta);
        if (clase) nodo.className = clase;
        if (contenido != null) nodo.textContent = contenido;
        return nodo;
      };
      const icono = (nombre) => {
        const nodo = el("span", "material-symbols-outlined", nombre);
        nodo.setAttribute("aria-hidden", "true");
        return nodo;
      };

      const tarjeta = el("article", "tarjeta-libro");
      tarjeta.id = "libro-" + libro.id; // para llegar desde el carrusel del inicio: libros.html#libro-<id>
      tarjeta.dataset.id = libro.id;
      tarjeta.dataset.categorias = libro.categorias.join(" ");
      tarjeta.dataset.formatos = libro.formatos.join(" ");
      tarjeta.dataset.estado = libro.estado;
      tarjeta.dataset.lectores = String(libro.lectores);
      tarjeta.dataset.nota = String(libro.nota);
      tarjeta.dataset.busqueda = [libro.titulo, libro.autor, libro.genero, libro.descripcion].join(" ");

      const contenedor = el("div", "contenedor-portada");
      const imagen = el("img", "imagen-portada");
      imagen.src = libro.portada;
      imagen.alt = "Portada de " + libro.titulo + " de " + libro.autor;
      imagen.width = 400;
      imagen.height = 600;
      if (indice > 3) imagen.loading = "lazy";
      imagen.decoding = "async";
      contenedor.append(imagen, el("div", "sombra-lomo"));

      const titulo = el("h3", "titulo-libro");
      const disparador = el("button", "titulo-boton", libro.titulo);
      disparador.type = "button";
      disparador.setAttribute("aria-haspopup", "dialog");
      titulo.append(disparador);

      const estado = el("p", "estado-libro " + libro.estado);
      estado.append(el("span", "punto-estado"), el("span", "", textoEstado(libro)));

      const cuerpo = el("div", "cuerpo-tarjeta");
      cuerpo.append(titulo, el("p", "autor-libro", libro.autor), estado, el("p", "descripcion-libro", libro.descripcion));
      tarjeta.append(contenedor, cuerpo);

      const sala = libro.estado === "sala";
      const accion = el("button", sala ? "boton-accion-secundario" : "boton-accion-primario");
      accion.type = "button";
      accion.append(icono(sala ? "chair" : "bookmark_add"), el("span", "", sala ? "Pedir en sala" : "Reservar"));
      const acciones = el("div", "acciones-tarjeta");
      acciones.append(accion);
      tarjeta.append(acciones);
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

  // ---- Carrusel de los libros más leídos (index.html) ----
  // El libro del centro va al frente y nítido; los de los lados quedan atrás, más pequeños, girados y desenfocados.
  // Cada 3 segundos avanza solo; se detiene al pasar el cursor, al enfocar con el teclado, al tocarlo y fuera de pantalla.
  function montarCarrusel(raiz) {
    const lista = libros()
      .sort((a, b) => b.lectores - a.lectores || b.nota - a.nota)
      .slice(0, 7);
    const n = lista.length;
    if (!n) {
      raiz.closest("section").hidden = true;
      return;
    }
    const INTERVALO = 3000;
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const el = (etiqueta, clase, contenido) => {
      const nodo = document.createElement(etiqueta);
      if (clase) nodo.className = clase;
      if (contenido != null) nodo.textContent = contenido;
      return nodo;
    };
    const icono = (nombre) => {
      const nodo = el("span", "material-symbols-outlined", nombre);
      nodo.setAttribute("aria-hidden", "true");
      return nodo;
    };
    const boton = (nombre, etiqueta) => {
      const b = el("button", "boton-carrusel");
      b.type = "button";
      b.setAttribute("aria-label", etiqueta);
      b.append(icono(nombre));
      return b;
    };

    raiz.setAttribute("role", "group");
    raiz.setAttribute("aria-roledescription", "carrusel");
    raiz.setAttribute("aria-label", "Libros más leídos del barrio");

    const escena = el("div", "carrusel-escena");
    const pista = el("ol", "carrusel-pista");
    const items = lista.map((libro, i) => {
      const item = el("li", "carrusel-item");
      item.setAttribute("role", "group");
      item.setAttribute("aria-roledescription", "diapositiva");
      item.setAttribute("aria-label", i + 1 + " de " + n);
      const enlace = el("a", "carrusel-enlace");
      enlace.href = "libros.html#libro-" + libro.id;
      const portada = el("span", "carrusel-portada");
      const imagen = el("img");
      imagen.src = libro.portada;
      imagen.alt = "";
      imagen.width = 400;
      imagen.height = 600;
      imagen.decoding = "async";
      portada.append(imagen);
      enlace.append(portada, el("span", "carrusel-titulo", libro.titulo));
      item.append(enlace);
      pista.append(item);
      return item;
    });
    escena.append(pista);

    const anterior = boton("chevron_left", "Libro anterior");
    const siguiente = boton("chevron_right", "Libro siguiente");
    const pausa = boton("pause", "Pausar el carrusel");
    const controles = el("div", "carrusel-controles");
    controles.append(anterior, pausa, siguiente);
    const estado = el("p", "visualmente-oculto");
    estado.setAttribute("aria-live", "polite");
    raiz.replaceChildren(escena, controles, estado);

    let actual = 0;
    function pintar() {
      items.forEach((item, i) => {
        let d = (i - actual + n) % n;
        if (d > n / 2) d -= n;
        const antes = item.dataset.d === undefined ? d : Number(item.dataset.d);
        const salto = Math.abs(d - antes) > 1;
        if (salto) item.classList.add("sin-transicion");
        const fuera = Math.abs(d) > 2;
        item.style.setProperty("--d", String(d));
        item.dataset.d = String(d);
        item.style.zIndex = String(10 - Math.abs(d));
        item.classList.toggle("es-centro", d === 0);
        item.classList.toggle("fuera", fuera);
        item.inert = fuera;
        if (salto) {
          void item.offsetWidth;
          item.classList.remove("sin-transicion");
        }
      });
    }
    pintar();
    requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add("carrusel-listo")));

    let pausaManual = sinMovimiento;
    let suspendido = false;
    let visible = false;
    let temporizador;

    function actualizarBotonPausa() {
      pausa.querySelector(".material-symbols-outlined").textContent = pausaManual ? "play_arrow" : "pause";
      pausa.setAttribute("aria-label", pausaManual ? "Reanudar el carrusel" : "Pausar el carrusel");
    }
    function revisar() {
      clearInterval(temporizador);
      if (!pausaManual && !suspendido && visible && !document.hidden) temporizador = setInterval(() => mover(1, false), INTERVALO);
    }
    function mover(paso, manual) {
      actual = (actual + paso + n) % n;
      pintar();
      if (manual || pausaManual) estado.textContent = "Libro " + (actual + 1) + " de " + n + ": " + lista[actual].titulo;
    }

    anterior.addEventListener("click", () => mover(-1, true));
    siguiente.addEventListener("click", () => mover(1, true));
    pausa.addEventListener("click", () => {
      pausaManual = !pausaManual;
      actualizarBotonPausa();
      revisar();
    });
    actualizarBotonPausa();

    raiz.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mover(-1, true);
      else if (e.key === "ArrowRight") mover(1, true);
    });

    // Se detiene mientras alguien lo mira de cerca
    raiz.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") {
        suspendido = true;
        revisar();
      }
    });
    raiz.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") {
        suspendido = false;
        revisar();
      }
    });
    raiz.addEventListener("focusin", () => {
      suspendido = true;
      revisar();
    });
    raiz.addEventListener("focusout", (e) => {
      if (!raiz.contains(e.relatedTarget)) {
        suspendido = false;
        revisar();
      }
    });

    // En el celular: deslizar cambia de libro; tocar detiene el giro unos segundos
    let inicioX = null;
    let arrastro = false;
    let esperaToque;
    escena.addEventListener("pointerdown", (e) => {
      inicioX = e.clientX;
      arrastro = false;
      if (e.pointerType !== "mouse") {
        suspendido = true;
        revisar();
        clearTimeout(esperaToque);
        esperaToque = setTimeout(() => {
          suspendido = false;
          revisar();
        }, 8000);
      }
    });
    escena.addEventListener("pointerup", (e) => {
      if (inicioX === null) return;
      const dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 45) {
        arrastro = true;
        mover(dx < 0 ? 1 : -1, true);
      }
    });
    escena.addEventListener(
      "click",
      (e) => {
        if (arrastro) {
          e.preventDefault();
          e.stopPropagation();
          arrastro = false;
        }
      },
      true
    );

    new IntersectionObserver(
      (entradas) => {
        visible = entradas[0].isIntersecting;
        revisar();
      },
      { threshold: 0.35 }
    ).observe(raiz);
    document.addEventListener("visibilitychange", revisar);
  }

  // En libros.html: dibuja el catálogo antes de que arranque el script de la página (este archivo va con defer)
  const rejilla = document.querySelector(".rejilla-libros");
  if (rejilla && rejilla.closest("main")) {
    rejilla.replaceChildren(...libros().map((libro, i) => Biblioteca.crearTarjeta(libro, i)));
  }

  // En index.html: carrusel con los libros más leídos
  const carrusel = document.getElementById("carruselLibros");
  if (carrusel) montarCarrusel(carrusel);
})();
