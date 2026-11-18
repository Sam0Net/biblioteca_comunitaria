/* ==========================================================================
   AGENDA Y HORARIO
   - Los datos viven en datos/agenda.js (window.ACTIVIDADES y window.HORARIO_SALAS).
   - index.html: dibuja las actividades del mes a partir del arreglo y abre una ventana (<dialog>)
     para inscribirse. Las inscripciones se guardan en este navegador (localStorage), igual que
     las cuentas de auth.js: es una maqueta sin servidor.
   - servicios.html: dibuja la tabla de horario, une bajo un solo encabezado las filas del mismo día,
     calcula dónde va la franja de cada horario en el eje de 8 a 20 h y suma el aforo total.
   ========================================================================== */
(() => {
  const CLAVE_INSCRIPCIONES = "bibliotecaInscripciones";
  const actividades = Array.isArray(window.ACTIVIDADES) ? window.ACTIVIDADES : [];
  const horario = Array.isArray(window.HORARIO_SALAS) ? window.HORARIO_SALAS : [];

  // ---- Ayudantes para crear nodos (se usa textContent: ningún dato se interpreta como HTML) ----
  function el(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  function icono(nombre) {
    const nodo = el("span", "material-symbols-outlined", nombre);
    nodo.setAttribute("aria-hidden", "true");
    return nodo;
  }

  // "08:30" -> 510 (minutos desde la medianoche)
  function aMinutos(hora) {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  }

  // Une el guion con las horas para que el rango nunca se parta en dos líneas
  const rangoHoras = (desde, hasta) => desde + "⁠–⁠" + hasta;

  // =====================================================================
  // HORARIO DE LAS SALAS (servicios.html)
  // =====================================================================
  const EJE_INICIO = aMinutos("08:00");
  const EJE_FIN = aMinutos("20:00");

  function celda(etiqueta, texto, clase) {
    const td = el("td", clase || "", texto);
    td.dataset.etiqueta = etiqueta;
    return td;
  }

  // Franja del día: la parte verde marca de qué hora a qué hora abre el espacio
  function franjaHoraria(abre, cierra) {
    const franja = el("span", "franja");
    franja.setAttribute("aria-hidden", "true");
    const uso = el("span");
    const desde = Math.max(aMinutos(abre), EJE_INICIO);
    const hasta = Math.min(aMinutos(cierra), EJE_FIN);
    const largoEje = EJE_FIN - EJE_INICIO;
    uso.style.left = ((desde - EJE_INICIO) / largoEje) * 100 + "%";
    uso.style.width = ((hasta - desde) / largoEje) * 100 + "%";
    franja.append(uso);
    return franja;
  }

  function montarHorario(cuerpo) {
    cuerpo.replaceChildren();
    let i = 0;
    while (i < horario.length) {
      // ¿Cuántas filas seguidas son del mismo día? Se agrupan bajo un único encabezado (rowspan)
      let ultima = i;
      while (ultima + 1 < horario.length && horario[ultima + 1].dia === horario[i].dia) ultima++;
      const filasDelDia = ultima - i + 1;

      for (let j = i; j <= ultima; j++) {
        const sala = horario[j];
        const fila = el("tr");
        if (j < ultima) fila.className = "fila-agrupada"; // sin línea con la fila siguiente del mismo día

        if (j === i) {
          const encabezado = el("th", "", sala.dia);
          encabezado.scope = "row";
          if (filasDelDia > 1) encabezado.rowSpan = filasDelDia;
          fila.append(encabezado);
        }

        const hora = celda("Horario", rangoHoras(sala.abre, sala.cierra), "columna-clave");
        hora.append(franjaHoraria(sala.abre, sala.cierra));
        fila.append(
          celda("Espacio", sala.espacio),
          hora,
          celda("Actividad", sala.actividad),
          celda("Aforo", sala.aforo + " " + sala.unidad, "celda-aforo")
        );
        cuerpo.append(fila);
      }
      i = ultima + 1;
    }

    // Aforo total: la suma de todos los espacios (así la nota nunca queda desfasada de la tabla)
    const total = horario.reduce((suma, sala) => suma + sala.aforo, 0);
    const destino = document.getElementById("capacidadTotal");
    if (destino) destino.textContent = String(total);
  }

  // =====================================================================
  // ACTIVIDADES DEL MES E INSCRIPCIÓN (index.html)
  // =====================================================================
  const MESES = {
    Ene: "enero", Feb: "febrero", Mar: "marzo", Abr: "abril", May: "mayo", Jun: "junio",
    Jul: "julio", Ago: "agosto", Sep: "septiembre", Oct: "octubre", Nov: "noviembre", Dic: "diciembre",
  };
  function leerInscripciones() {
    try {
      const lista = JSON.parse(localStorage.getItem(CLAVE_INSCRIPCIONES) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch (error) {
      return [];
    }
  }

  function guardarInscripciones(lista) {
    try {
      localStorage.setItem(CLAVE_INSCRIPCIONES, JSON.stringify(lista));
      return true;
    } catch (error) {
      return false; // sin almacenamiento (modo privado estricto): la inscripción no se puede guardar
    }
  }

  const miInscripcion = (id) => leerInscripciones().find((inscripcion) => inscripcion.actividad === id);

  // Cupos que quedan: los totales menos los anotados en la sede y menos la inscripción hecha aquí
  function cuposLibres(actividad) {
    const propias = leerInscripciones().filter((inscripcion) => inscripcion.actividad === actividad.id).length;
    return Math.max(actividad.cupos - (actividad.inscritos || 0) - propias, 0);
  }

  function textoCupos(libres) {
    if (libres === 0) return "Sin cupos";
    if (libres === 1) return "Queda 1 cupo";
    return "Quedan " + libres + " cupos";
  }

  function dato(nombreIcono, texto, clase) {
    const linea = el("span", clase || "");
    linea.append(icono(nombreIcono), document.createTextNode(texto));
    return linea;
  }

  function botonAccion(actividad) {
    // Sin inscripción: un enlace normal
    if (actividad.cupos == null) {
      const enlace = el("a", "boton-inscribirse-evento");
      enlace.href = actividad.enlace;
      enlace.append(el("span", "", actividad.textoEnlace), icono("arrow_forward"));
      return enlace;
    }

    const boton = el("button", "boton-inscribirse-evento");
    boton.type = "button";
    boton.dataset.actividad = actividad.id;

    if (miInscripcion(actividad.id)) {
      boton.classList.add("inscrito");
      boton.append(el("span", "", "Estás inscrito"), icono("check"));
    } else if (cuposLibres(actividad) === 0) {
      boton.disabled = true;
      boton.append(el("span", "", "Sin cupos"));
    } else {
      boton.append(el("span", "", "Inscribirse gratis"), icono("arrow_forward"));
    }
    return boton;
  }

  function tarjetaActividad(actividad) {
    const tarjeta = el("article", "tarjeta-evento-inicio");

    const cabecera = el("div", "cabecera-evento-inicio");
    const fecha = el("div", "chip-fecha-evento");
    fecha.append(el("span", "chip-dia-evento", String(actividad.dia)), el("span", "chip-mes-evento", actividad.mes));
    cabecera.append(fecha, el("span", "insignia-modalidad-evento", actividad.modalidad));

    const meta = el("div", "detalles-meta-evento");
    meta.append(dato("schedule", actividad.cuando), dato("place", actividad.lugar));
    if (actividad.cupos == null) {
      meta.append(dato("groups", "Entrada libre, sin inscripción"));
    } else {
      const libres = cuposLibres(actividad);
      meta.append(dato("event_seat", textoCupos(libres), libres <= 3 ? "pocos-cupos" : ""));
    }

    tarjeta.append(
      cabecera,
      el("h3", "titulo-evento-inicio", actividad.titulo),
      el("p", "descripcion-evento-inicio", actividad.descripcion),
      meta,
      botonAccion(actividad)
    );
    return tarjeta;
  }

  function montarAgenda(lista) {
    if (!actividades.length) {
      lista.replaceChildren(el("p", "agenda-vacia", "No hay actividades programadas este mes. Vuelve pronto."));
      return;
    }
    lista.replaceChildren(...actividades.map(tarjetaActividad));
  }

  // ---- Ventana de inscripción ----
  function prepararInscripcion(lista) {
    const dialogo = document.getElementById("dialogoInscripcion");
    if (!dialogo || typeof dialogo.showModal !== "function") return;

    const titulo = document.getElementById("inscripcionTitulo");
    const detalle = document.getElementById("inscripcionDetalle");
    const formulario = document.getElementById("formInscripcion");
    const hecha = document.getElementById("inscripcionHecha");
    const hechaTexto = document.getElementById("inscripcionHechaTexto");
    const campoNombre = document.getElementById("inscripcionNombre");
    const campoCorreo = document.getElementById("inscripcionCorreo");
    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const aviso = document.getElementById("avisoAgenda");
    let actual = null; // actividad abierta en la ventana
    let esperaAviso;

    function avisar(texto) {
      if (!aviso) return;
      aviso.textContent = texto;
      aviso.classList.add("visible");
      clearTimeout(esperaAviso);
      esperaAviso = setTimeout(() => aviso.classList.remove("visible"), 4500);
    }

    // Marca el campo como válido o no y muestra el motivo debajo; devuelve true si está bien
    function validar(campo, error, mensaje) {
      error.textContent = mensaje;
      error.hidden = !mensaje;
      campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
      if (mensaje) campo.setAttribute("aria-describedby", error.id);
      else campo.removeAttribute("aria-describedby");
      return !mensaje;
    }

    function abrir(actividad) {
      actual = actividad;
      titulo.textContent = actividad.titulo;
      const mes = MESES[actividad.mes] || actividad.mes;
      detalle.textContent = actividad.dia + " de " + mes + " · " + actividad.cuando + " · " + actividad.lugar;

      const inscripcion = miInscripcion(actividad.id);
      formulario.hidden = Boolean(inscripcion);
      hecha.hidden = !inscripcion;

      if (inscripcion) {
        hechaTexto.textContent = "Ya estás inscrito con el correo " + inscripcion.correo + ". Te esperamos; si no puedes venir, libera tu cupo para otro vecino.";
      } else {
        formulario.reset();
        validar(campoNombre, errorNombre, "");
        validar(campoCorreo, errorCorreo, "");
        // Si hay sesión, los datos ya se conocen
        const sesion = window.Auth && typeof window.Auth.sesion === "function" ? window.Auth.sesion() : null;
        if (sesion) {
          campoNombre.value = sesion.nombre || "";
          campoCorreo.value = sesion.correo || "";
        }
      }
      dialogo.showModal();
    }

    function refrescar() {
      const id = actual && actual.id;
      montarAgenda(lista);
      // El botón se volvió a dibujar: el foco vuelve al de la misma actividad
      const boton = id && lista.querySelector('[data-actividad="' + id + '"]');
      if (boton) boton.focus();
    }

    lista.addEventListener("click", (evento) => {
      const boton = evento.target.closest("button[data-actividad]");
      if (!boton) return;
      const actividad = actividades.find((a) => a.id === boton.dataset.actividad);
      if (actividad) abrir(actividad);
    });

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const nombre = campoNombre.value.trim();
      const correo = campoCorreo.value.trim();

      let todoBien = true;
      todoBien = validar(campoNombre, errorNombre, nombre.length >= 2 ? "" : "Escribe tu nombre, al menos 2 letras.") && todoBien;
      todoBien =
        validar(campoCorreo, errorCorreo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? "" : "Revisa el correo: debe tener la forma nombre@correo.com.") &&
        todoBien;
      if (!todoBien) {
        (campoNombre.getAttribute("aria-invalid") === "true" ? campoNombre : campoCorreo).focus();
        return;
      }

      // Puede que mientras tanto se hayan acabado los cupos
      if (cuposLibres(actual) === 0) {
        dialogo.close();
        avisar("Lo sentimos, ya no quedan cupos para esta actividad.");
        refrescar();
        return;
      }

      const inscripciones = leerInscripciones();
      inscripciones.push({ actividad: actual.id, nombre, correo, fecha: new Date().toISOString() });
      if (!guardarInscripciones(inscripciones)) {
        validar(campoCorreo, errorCorreo, "No pudimos guardar tu inscripción en este navegador. Inténtalo de nuevo o escríbenos.");
        return;
      }
      dialogo.close();
      refrescar(); // se redibuja al momento: el botón pasa a "Estás inscrito" y bajan los cupos
      avisar("Listo, " + nombre.split(" ")[0] + ": te inscribiste en «" + actual.titulo + "».");
    });

    document.getElementById("cancelarInscripcion").addEventListener("click", () => {
      const restantes = leerInscripciones().filter((inscripcion) => inscripcion.actividad !== actual.id);
      guardarInscripciones(restantes);
      dialogo.close();
      refrescar();
      avisar("Cancelaste tu inscripción. Tu cupo quedó libre para otro vecino.");
    });

    dialogo.querySelectorAll("[data-cerrar]").forEach((boton) => boton.addEventListener("click", () => dialogo.close()));
    // Pulsar fuera de la ventana (en el fondo oscuro) también la cierra
    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });
    // Al cerrar sin cambios (Escape, fondo o "Ahora no") el foco vuelve al botón que abrió la ventana
    dialogo.addEventListener("close", () => {
      const boton = actual && lista.querySelector('[data-actividad="' + actual.id + '"]');
      if (boton && document.activeElement !== boton) boton.focus();
    });
  }

  // ---- Arranque ----
  const cuerpoHorario = document.getElementById("cuerpoHorario");
  if (cuerpoHorario) montarHorario(cuerpoHorario);

  const listaActividades = document.getElementById("listaActividades");
  if (listaActividades) {
    montarAgenda(listaActividades);
    prepararInscripcion(listaActividades);
  }
})();
