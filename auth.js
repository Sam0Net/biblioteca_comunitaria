/* ==========================================================================
   CUENTAS Y ROLES (maqueta sin servidor)
   - Las cuentas y la sesión se guardan en este navegador (localStorage / sessionStorage).
   - Roles: "admin" (una cuenta fija, abajo) y "usuario" (cualquiera que cree su cuenta).
   - IMPORTANTE: es una simulación para la entrega. Las contraseñas se guardan sin cifrar y
     cualquiera con las herramientas del navegador puede cambiar los datos. Los roles reales
     necesitan un servidor.
   ========================================================================== */
(() => {
  const ADMIN = { nombre: "Administrador", correo: "admin@leernosune.org", clave: "Admin2025!", rol: "admin" };
  const CLAVE_USUARIOS = "bibliotecaUsuarios";
  const CLAVE_SESION = "bibliotecaSesion";

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

  const normalizar = (correo) => String(correo || "").trim().toLowerCase();
  const publico = (u) => ({ nombre: u.nombre, correo: u.correo, rol: u.rol });

  const Auth = {
    correoAdmin: ADMIN.correo,

    sesion() {
      return leer(sessionStorage, CLAVE_SESION, null);
    },

    esAdmin() {
      const s = this.sesion();
      return !!s && s.rol === "admin";
    },

    registrar({ nombre, correo, clave }) {
      correo = normalizar(correo);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      if (correo === ADMIN.correo || usuarios.some((u) => u.correo === correo)) {
        return { ok: false, error: "Ese correo ya tiene una cuenta. Inicia sesión o usa otro correo." };
      }
      const usuario = { nombre: String(nombre).trim(), correo, clave, rol: "usuario", fecha: new Date().toISOString() };
      usuarios.push(usuario);
      if (!escribir(localStorage, CLAVE_USUARIOS, usuarios)) {
        return { ok: false, error: "Tu navegador no deja guardar la cuenta. Revisa que no esté en modo privado." };
      }
      escribir(sessionStorage, CLAVE_SESION, publico(usuario));
      return { ok: true, usuario: publico(usuario) };
    },

    iniciar(correo, clave) {
      correo = normalizar(correo);
      const usuarios = leer(localStorage, CLAVE_USUARIOS, []);
      const cuenta = correo === ADMIN.correo ? ADMIN : usuarios.find((u) => u.correo === correo);
      if (!cuenta || cuenta.clave !== clave) {
        return { ok: false, error: "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo." };
      }
      escribir(sessionStorage, CLAVE_SESION, publico(cuenta));
      return { ok: true, usuario: publico(cuenta) };
    },

    cerrar() {
      try {
        sessionStorage.removeItem(CLAVE_SESION);
      } catch (error) {
        /* sin almacenamiento: no hay sesión que cerrar */
      }
    },

    // Solo el admin puede ver la lista de cuentas registradas en este navegador
    usuarios() {
      if (!this.esAdmin()) return [];
      return leer(localStorage, CLAVE_USUARIOS, []).map((u) => ({ nombre: u.nombre, correo: u.correo, fecha: u.fecha }));
    },
  };

  window.Auth = Auth;

  // ---- Encabezado: cambia según la sesión (el HTML del encabezado es el mismo en todas las páginas) ----
  function ajustarEncabezado() {
    const sesion = Auth.sesion();
    if (!sesion) return;

    // Invitaciones a crear cuenta: no tienen sentido para quien ya inició sesión
    document.querySelectorAll("[data-solo-visitantes]").forEach((e) => (e.hidden = true));

    const carnet = document.querySelector(".boton-carnet");
    if (carnet) {
      carnet.setAttribute("href", "#");
      carnet.setAttribute("aria-label", "Cerrar sesión");
      carnet.querySelector(".material-symbols-outlined").textContent = "logout";
      carnet.querySelector("span:last-child").textContent = "Cerrar sesión";
      carnet.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.cerrar();
        window.location.reload();
      });
    }

    const avatar = document.querySelector(".avatar-perfil");
    if (avatar) {
      avatar.setAttribute("aria-label", "Mi cuenta: sesión de " + sesion.nombre);
      avatar.setAttribute("title", "Sesión de " + sesion.nombre);
    }

    if (sesion.rol === "admin") {
      const nav = document.querySelector(".navegacion-principal");
      if (nav) {
        const enlace = document.createElement("a");
        enlace.className = "enlace-nav";
        enlace.href = "admin.html";
        enlace.textContent = "Panel admin";
        nav.appendChild(enlace);
      }
      const navMovil = document.querySelector(".navegacion-movil");
      if (navMovil) {
        const enlace = document.createElement("a");
        enlace.className = "enlace-nav-movil";
        enlace.href = "admin.html";
        enlace.innerHTML =
          '<span aria-hidden="true" class="material-symbols-outlined">admin_panel_settings</span><span>Panel admin</span>' +
          '<span aria-hidden="true" class="material-symbols-outlined flecha-nav">chevron_right</span>';
        navMovil.appendChild(enlace);
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ajustarEncabezado);
  else ajustarEncabezado();
})();
