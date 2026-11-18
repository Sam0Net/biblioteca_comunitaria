/* ==========================================================================
   COMPORTAMIENTO COMÚN A TODAS LAS PÁGINAS
   El menú del celular vive en js/auth.js (se carga en todas las páginas).
   Formularios con el atributo data-validar (contacto y registro): en vez de los avisos
      del navegador, el error aparece debajo de cada campo, en español y diciendo cómo corregirlo.
   ========================================================================== */
(() => {
  // =====================================================================
  // VALIDACIÓN DE FORMULARIOS JUNTO AL CAMPO
  // =====================================================================
  // El mensaje según qué falló (validity es el estado de validación que el propio navegador calcula)
  function mensajeDeError(campo) {
    const v = campo.validity;
    if (v.valid) return "";

    if (v.valueMissing) {
      if (campo.type === "checkbox") return "Marca esta casilla para poder enviar.";
      if (campo.tagName === "SELECT") return "Elige una opción de la lista.";
      if (campo.type === "email") return "Escribe tu correo electrónico.";
      return "Este dato es obligatorio.";
    }
    if (v.typeMismatch && campo.type === "email") return "Revisa el correo: debe tener la forma nombre@correo.com.";
    if (v.patternMismatch) {
      // Patrones del tipo [0-9]{8}: se explica cuántos números hacen falta
      const cifras = /^\[0-9\]\{(\d+)\}$/.exec(campo.getAttribute("pattern") || "");
      if (cifras) return "Escribe " + cifras[1] + " números, sin espacios ni guiones.";
      return "El formato no es válido.";
    }
    if (v.tooShort) return "Escribe al menos " + campo.minLength + " caracteres.";
    if (v.tooLong) return "Escribe como máximo " + campo.maxLength + " caracteres.";
    return "Revisa este dato.";
  }

  // Crea (una sola vez) el párrafo donde se muestra el error de un campo
  function parrafoDeError(campo) {
    let parrafo = document.getElementById("error-" + campo.id);
    if (parrafo) return parrafo;
    parrafo = document.createElement("p");
    parrafo.className = "error-campo";
    parrafo.id = "error-" + campo.id;
    parrafo.hidden = true;
    const ancla = campo.closest(".contenedor-input-icono") || campo.closest(".grupo-casilla") || campo;
    ancla.after(parrafo);
    // Se guarda la descripción original (por ejemplo, la ayuda del DNI) para no perderla
    campo.dataset.descripcionOriginal = campo.getAttribute("aria-describedby") || "";
    return parrafo;
  }

  // Muestra u oculta el error de un campo; devuelve true si el campo está bien
  function revisarCampo(campo) {
    const mensaje = mensajeDeError(campo);
    if (!mensaje && !document.getElementById("error-" + campo.id)) return true;

    const parrafo = parrafoDeError(campo);
    parrafo.textContent = mensaje;
    parrafo.hidden = !mensaje;
    campo.setAttribute("aria-invalid", mensaje ? "true" : "false");

    const descripcion = [campo.dataset.descripcionOriginal, mensaje ? parrafo.id : ""].filter(Boolean).join(" ");
    if (descripcion) campo.setAttribute("aria-describedby", descripcion);
    else campo.removeAttribute("aria-describedby");
    return !mensaje;
  }

  const formularios = Array.from(document.querySelectorAll("form[data-validar]"));
  formularios.forEach((formulario) => {
    formulario.noValidate = true; // sin los globos del navegador: los mensajes los ponemos nosotros

    // Mientras se corrige, el error desaparece en cuanto el dato es válido
    formulario.addEventListener("input", (evento) => {
      if (evento.target.getAttribute("aria-invalid") === "true") revisarCampo(evento.target);
    });
    formulario.addEventListener("change", (evento) => {
      if (evento.target.getAttribute("aria-invalid") === "true") revisarCampo(evento.target);
    });
  });

  // Se escucha en fase de captura: así esto corre ANTES que el envío de cada página
  // (enviarFormulario, registrarCarnet) y lo detiene si hay errores
  document.addEventListener(
    "submit",
    (evento) => {
      const formulario = evento.target;
      if (!formularios.includes(formulario)) return;

      const campos = Array.from(formulario.elements).filter((campo) => campo.willValidate && campo.id);
      let primero = null;
      for (const campo of campos) {
        const bien = revisarCampo(campo);
        if (!bien && !primero) primero = campo;
      }
      if (primero) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        primero.focus();
      }
    },
    true
  );
})();
