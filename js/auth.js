/* ==========================================================================
   CUENTAS, ROLES Y ACCESIBILIDAD GLOBAL (maqueta sin servidor)
   - Las cuentas y la sesión se guardan en este navegador (localStorage / sessionStorage).
   - Roles: "admin" (cuenta fija demostrativa) y "usuario" (vecino registrado).
   - Permite al administrador listar, crear y dar de baja usuarios vecinales.
   - Centraliza la sincronización de navegación y el menú móvil responsivo.
   ========================================================================== */
(() => {
  const ADMIN = {
    nombre: "Administrador",
    correo: "admin@leernosune.org",
    clave: "Admin2025!",
    rol: "admin",
    carnet: "ADMIN-2026",
  };
  const CLAVE_USUARIOS = "bibliotecaUsuarios";
  const CLAVE_SESION = "bibliotecaSesion";
  const CLAVE_PEDIDOS = "bibliotecaPedidos";

  function leer(almacen, clave, defecto) {
    try {
      const texto = almacen.getItem(clave);
      return texto ? JSON.parse(texto) : defecto;
    } catch (error) {
      return defecto;
    }
  }

  function escribir(almacen, clave, valor) {
    try {
      almacen.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      return false;
    }
  }

  const normalizar = (correo) =>
    String(correo || "")
      .trim()
      .toLowerCase();

  function generarCarnetId(u) {
    if (u && u.carnet) return u.carnet;
    if (u && u.correo === ADMIN.correo) return "ADMIN-2026";
    let h = 0;
    const str = (u ? u.correo : "") + (u && u.fecha ? u.fecha : "2026");
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    const num = Math.abs(h % 90000) + 10000;
    return `VEC-2026-${num}`;
  }

  const publico = (u) => ({
    nombre: u.nombre,
    correo: u.correo,
    rol: u.rol,
    carnet: u.carnet || generarCarnetId(u),
    fecha: u.fecha,
    direccion: u.direccion || "Sector San José",
    telefono: u.telefono || "",
    dni: u.dni || "",
  });

  const Auth = {
    correoAdmin: ADMIN.correo,

    sesion() {
      return leer(sessionStorage, CLAVE_SESION, null);
    },

    esAdmin() {
      const s = this.sesion();
      return !!s && s.rol === "admin";
    },

    registrar({ nombre, correo, clave, direccion = "", telefono = "", dni = "" }) {
      correo = normalizar(correo);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      if (
        correo === ADMIN.correo ||
        usuarios.some((u) => u.correo === correo)
      ) {
        return {
          ok: false,
          error:
            "Ese correo ya tiene una cuenta. Inicia sesión o usa otro correo.",
        };
      }
      const nombreLimpio = String(nombre || "").trim();
      if (!nombreLimpio) {
        return { ok: false, error: "Escribe tu nombre completo." };
      }
      const usuario = {
        nombre: nombreLimpio,
        correo,
        clave,
        rol: "usuario",
        fecha: new Date().toISOString(),
        direccion: String(direccion).trim() || "Sector San José",
        telefono: String(telefono).trim(),
        dni: String(dni).trim(),
      };
      usuario.carnet = generarCarnetId(usuario);

      usuarios.push(usuario);
      if (!escribir(localStorage, CLAVE_USUARIOS, usuarios)) {
        return {
          ok: false,
          error:
            "Tu navegador no deja guardar la cuenta. Revisa que no esté en modo privado.",
        };
      }
      escribir(sessionStorage, CLAVE_SESION, publico(usuario));
      return { ok: true, usuario: publico(usuario) };
    },

    crearUsuarioPorAdmin({ nombre, correo, clave, direccion = "", telefono = "", dni = "" }) {
      if (!this.esAdmin()) {
        return { ok: false, error: "Solo el administrador puede registrar nuevos vecinos desde aquí." };
      }
      correo = normalizar(correo);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      if (correo === ADMIN.correo || usuarios.some((u) => u.correo === correo)) {
        return { ok: false, error: "Ese correo ya está registrado en el sistema." };
      }
      const nombreLimpio = String(nombre || "").trim();
      if (!nombreLimpio) {
        return { ok: false, error: "Escribe el nombre del vecino lector." };
      }
      if (!clave || clave.length < 6) {
        return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
      }

      const nuevo = {
        nombre: nombreLimpio,
        correo,
        clave,
        rol: "usuario",
        fecha: new Date().toISOString(),
        direccion: String(direccion).trim() || "Sector San José",
        telefono: String(telefono).trim(),
        dni: String(dni).trim(),
      };
      nuevo.carnet = generarCarnetId(nuevo);

      usuarios.push(nuevo);
      if (!escribir(localStorage, CLAVE_USUARIOS, usuarios)) {
        return { ok: false, error: "No se pudo guardar en el almacenamiento local." };
      }
      return { ok: true, usuario: publico(nuevo) };
    },

    iniciar(correo, clave) {
      correo = normalizar(correo);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      const cuenta =
        correo === ADMIN.correo
          ? ADMIN
          : usuarios.find((u) => u.correo === correo);
      if (!cuenta || cuenta.clave !== clave) {
        return {
          ok: false,
          error:
            "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.",
        };
      }
      escribir(sessionStorage, CLAVE_SESION, publico(cuenta));
      return { ok: true, usuario: publico(cuenta) };
    },

    cerrar() {
      try {
        sessionStorage.removeItem(CLAVE_SESION);
      } catch (error) {
        /* sin almacenamiento */
      }
    },

    // Lista completa de usuarios para el administrador
    usuarios() {
      if (!this.esAdmin()) return [];
      return leer(localStorage, CLAVE_USUARIOS, []).map((u) => ({
        nombre: u.nombre,
        correo: u.correo,
        fecha: u.fecha,
        carnet: u.carnet || generarCarnetId(u),
        rol: u.rol || "usuario",
        direccion: u.direccion || "Sector San José",
        telefono: u.telefono || "",
        dni: u.dni || "",
      }));
    },

    obtenerUsuario(correo) {
      correo = normalizar(correo);
      if (correo === ADMIN.correo) return publico(ADMIN);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      const u = usuarios.find((item) => item.correo === correo);
      return u ? publico(u) : null;
    },

    eliminarUsuario(correo) {
      if (!this.esAdmin()) {
        return { ok: false, error: "Solo el administrador puede dar de baja cuentas." };
      }
      correo = normalizar(correo);
      if (correo === ADMIN.correo) {
        return { ok: false, error: "No es posible eliminar la cuenta principal de administración." };
      }
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      const filtrados = usuarios.filter((u) => u.correo !== correo);
      if (filtrados.length === usuarios.length) {
        return { ok: false, error: "No encontramos ese usuario para eliminar." };
      }
      if (!escribir(localStorage, CLAVE_USUARIOS, filtrados)) {
        return { ok: false, error: "Error al actualizar la lista de usuarios en almacenamiento." };
      }
      // Limpiar pedidos asociados al usuario
      try {
        const pedidos = leer(localStorage, CLAVE_PEDIDOS, {});
        if (pedidos[correo]) {
          delete pedidos[correo];
          escribir(localStorage, CLAVE_PEDIDOS, pedidos);
        }
      } catch (err) {}

      return { ok: true };
    },

    generarCarnetId,
  };

  window.Auth = Auth;

  // ---- Encabezado: actualiza los botones y accesos según la sesión actual ----
  function ajustarEncabezado() {
    const sesion = Auth.sesion();
    if (!sesion) return;

    // Ocultar invitaciones innecesarias para usuarios con sesión activa
    document
      .querySelectorAll("[data-solo-visitantes]")
      .forEach((e) => (e.hidden = true));

    const carnet = document.querySelector(".boton-carnet");
    if (carnet) {
      carnet.setAttribute("href", "#");
      carnet.setAttribute("aria-label", "Cerrar sesión de " + sesion.nombre);
      const icono = carnet.querySelector(".material-symbols-outlined");
      if (icono) icono.textContent = "logout";
      const texto = carnet.querySelector("span:last-child");
      if (texto) texto.textContent = "Cerrar sesión";
      carnet.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.cerrar();
        window.location.reload();
      });
    }

    const avatar = document.querySelector(".avatar-perfil");
    if (avatar) {
      avatar.setAttribute(
        "aria-label",
        "Mi cuenta: sesión de " + sesion.nombre,
      );
      avatar.setAttribute("title", "Sesión de " + sesion.nombre + " (" + (sesion.rol === "admin" ? "Administrador" : "Vecino Lector") + ")");
    }

    const esPaginaAdmin = window.location.pathname.endsWith("admin.html") || window.location.href.includes("admin.html");
    const enSubcarpeta = window.location.pathname.includes("/pages/") || window.location.pathname.includes("\\pages\\");
    const rutaAdmin = enSubcarpeta ? "admin.html" : "pages/admin.html";

    if (sesion.rol === "admin") {
      const nav = document.querySelector(".navegacion-principal");
      if (nav && !nav.querySelector('a[href="admin.html"]')) {
        const enlace = document.createElement("a");
        enlace.className = "enlace-nav" + (esPaginaAdmin ? " activo" : "");
        enlace.href = rutaAdmin;
        enlace.textContent = "Panel admin";
        if (esPaginaAdmin) enlace.setAttribute("aria-current", "page");
        nav.appendChild(enlace);
      }
      const navMovil = document.querySelector(".navegacion-movil");
      if (navMovil && !navMovil.querySelector('a[href="admin.html"]')) {
        const enlace = document.createElement("a");
        enlace.className = "enlace-nav-movil" + (esPaginaAdmin ? " activo" : "");
        enlace.href = rutaAdmin;
        if (esPaginaAdmin) enlace.setAttribute("aria-current", "page");
        enlace.innerHTML =
          '<span aria-hidden="true" class="material-symbols-outlined">admin_panel_settings</span><span>Panel admin</span>' +
          '<span aria-hidden="true" class="material-symbols-outlined flecha-nav">chevron_right</span>';
        navMovil.appendChild(enlace);
      }
    }
  }

  // ---- Menú desplegable móvil estilo Apple (Idempotente, una sola instancia segura) ----
  function iniciarMenuMovil() {
    const btnMenu = document.getElementById("btnMenuMovil");
    const menuMovil = document.getElementById("menuMovilDesplegable");
    const encabezado = document.querySelector(".encabezado");
    if (!btnMenu || !menuMovil) return;

    if (btnMenu.dataset.menuIniciado === "true") return;
    btnMenu.dataset.menuIniciado = "true";

    const alternar = (abrir) => {
      menuMovil.classList.toggle("abierto", abrir);
      btnMenu.classList.toggle("activo", abrir);
      btnMenu.setAttribute("aria-expanded", String(abrir));
      btnMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
      menuMovil.setAttribute("aria-hidden", String(!abrir));
    };

    btnMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      alternar(!menuMovil.classList.contains("abierto"));
    });

    // Cerrar al pulsar Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuMovil.classList.contains("abierto")) {
        alternar(false);
        btnMenu.focus();
      }
    });

    // Cerrar al hacer clic fuera del encabezado
    document.addEventListener("click", (e) => {
      if (
        menuMovil.classList.contains("abierto") &&
        encabezado &&
        !encabezado.contains(e.target)
      ) {
        alternar(false);
      }
    });

    // Cerrar al hacer clic en un enlace del menú móvil
    menuMovil.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", () => {
        alternar(false);
      });
    });

    // Si la pantalla se agranda más allá de 860px, cerrar el menú móvil
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
      if (e.matches && menuMovil.classList.contains("abierto")) alternar(false);
    });
  }

  function iniciarEncabezado() {
    ajustarEncabezado();
    iniciarMenuMovil();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarEncabezado);
  } else {
    iniciarEncabezado();
  }
})();
