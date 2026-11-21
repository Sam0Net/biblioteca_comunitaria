import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const Auth: React.FC<AuthPageProps> = ({ initialMode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === '/registro' || initialMode === 'register';
  const [modoActual, setModoActual] = useState<'login' | 'registro'>(isRegisterRoute ? 'registro' : 'login');

  // Referencias a los paneles para animación FLIP
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const panelLadoRef = useRef<HTMLDivElement>(null);
  const panelVisualRef = useRef<HTMLDivElement>(null);

  // Estados del Formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginClave, setLoginClave] = useState('');
  const [verLoginClave, setVerLoginClave] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(true);

  // Estados del Formulario de Registro
  const [registroNombre, setRegistroNombre] = useState('');
  const [registroEmail, setRegistroEmail] = useState('');
  const [registroClave, setRegistroClave] = useState('');
  const [verRegistroClave, setVerRegistroClave] = useState(false);

  // Errores y Alerta Flotante
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState<{ texto: string; esError: boolean } | null>(null);
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

  // Sincronizar ruta con estado
  useEffect(() => {
    if (location.pathname === '/registro' && modoActual !== 'registro') {
      setModoActual('registro');
    } else if (location.pathname === '/login' && modoActual !== 'login') {
      setModoActual('login');
    }
  }, [location.pathname]);

  const aplicarModo = (nuevoModo: 'login' | 'registro') => {
    setAlerta(null);
    setErroresCampos({});
    setModoActual(nuevoModo);
    try {
      window.history.replaceState(null, '', nuevoModo === 'registro' ? '/registro' : '/login');
    } catch (_) {}
  };

  // Alternar entre Iniciar sesión y Crear cuenta con deslizamiento suave de showcase
  const alternarModoAuth = () => {
    const nuevoModo = modoActual === 'login' ? 'registro' : 'login';
    aplicarModo(nuevoModo);
  };

  // Validación de campos
  const validarLogin = () => {
    const errores: Record<string, string> = {};
    if (!loginEmail.trim()) {
      errores.loginEmail = 'Escribe tu correo electrónico para entrar.';
    }
    if (!loginClave.trim()) {
      errores.loginClave = 'Escribe tu contraseña para entrar.';
    }
    setErroresCampos(errores);
    return Object.keys(errores).length === 0;
  };

  const validarRegistro = () => {
    const errores: Record<string, string> = {};
    if (!registroNombre.trim()) {
      errores.registroNombre = 'Escribe tu nombre completo para crear la cuenta.';
    }
    if (!registroEmail.trim()) {
      errores.registroEmail = 'Escribe tu correo electrónico para crear la cuenta.';
    } else if (!/^\S+@\S+\.\S+$/.test(registroEmail.trim())) {
      errores.registroEmail = 'Revisa tu correo: debe tener la forma nombre@ejemplo.com.';
    }
    if (!registroClave.trim()) {
      errores.registroClave = 'Crea una contraseña para tu cuenta.';
    } else if (registroClave.length < 6) {
      errores.registroClave = 'Tu contraseña necesita al menos 6 caracteres.';
    }
    setErroresCampos(errores);
    return Object.keys(errores).length === 0;
  };

  // Envío de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarLogin()) return;

    setCargando(true);
    setAlerta(null);

    try {
      await login(loginEmail.trim(), loginClave);
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const esAdmin = savedUser.rol === 'ADMIN';
      const primerNombre = (savedUser.nombre || 'Vecino').split(' ')[0];

      setAlerta({
        texto: esAdmin ? 'Hola, administrador. Te llevamos al panel.' : `Hola, ${primerNombre}. Te llevamos al inicio.`,
        esError: false
      });

      setTimeout(() => {
        if (esAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 900);
    } catch (err: any) {
      setAlerta({
        texto: err.response?.data?.message || 'Error al iniciar sesión. Revisa tus credenciales.',
        esError: true
      });
    } finally {
      setCargando(false);
    }
  };

  // Envío de Registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarRegistro()) return;

    setCargando(true);
    setAlerta(null);

    try {
      await register({
        nombre: registroNombre.trim(),
        email: registroEmail.trim(),
        password: registroClave
      });

      const primerNombre = registroNombre.trim().split(' ')[0];
      setAlerta({
        texto: `Cuenta creada exitosamente. Te damos la bienvenida, ${primerNombre}.`,
        esError: false
      });

      setTimeout(() => {
        navigate('/libros');
      }, 1000);
    } catch (err: any) {
      setAlerta({
        texto: err.response?.data?.message || 'Error al tramitar la cuenta. Revisa los datos ingresados.',
        esError: true
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cuerpo-auth-fullscreen">
      {/* Botón retorno al portal principal */}
      <Link
        to="/"
        className="boton-volver-portal"
        aria-label="Volver a la página principal de la biblioteca"
      >
        <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
        <span>Volver a la biblioteca</span>
      </Link>

      {/* Tarjeta Split Card de Autenticación */}
      <main
        className={`tarjeta-auth-split ${modoActual === 'registro' ? 'modo-registro' : ''}`}
        id="tarjetaAuth"
        ref={tarjetaRef}
      >
        {/* ==============================================
             COLUMNA IZQUIERDA: FORMULARIO LOGIN
             ============================================== */}
        <div
          className={`panel-auth-col panel-login-col ${modoActual === 'login' ? 'activo' : 'inactivo'}`}
          aria-hidden={modoActual !== 'login'}
        >
          <div className="seccion-form-login">
            <div className="logo-auth-contenedor">
              <div className="logo-auth-icono">
                <span aria-hidden="true" className="material-symbols-outlined">local_florist</span>
              </div>
              <span className="logo-auth-nombre">Leer nos une</span>
            </div>

            <h1 className="titulo-auth" id="tituloLogin">Iniciar sesión</h1>

            {/* Formulario de inicio de sesión */}
            <form id="formAuthLogin" onSubmit={handleLoginSubmit} noValidate>
              <div className="grupo-input-auth">
                <label className="etiqueta-auth" htmlFor="loginEmail">
                  Correo electrónico
                </label>
                <div className={`caja-input-auth ${erroresCampos.loginEmail ? 'con-error' : ''}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    id="loginEmail"
                    name="loginEmail"
                    className="input-auth-campo"
                    placeholder="vecino@ejemplo.com"
                    required
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (erroresCampos.loginEmail) {
                        setErroresCampos((prev) => ({ ...prev, loginEmail: '' }));
                      }
                    }}
                  />
                </div>
                {erroresCampos.loginEmail && (
                  <p className="mensaje-error-auth">{erroresCampos.loginEmail}</p>
                )}
              </div>

              <div className="grupo-input-auth">
                <label className="etiqueta-auth" htmlFor="loginClave">
                  Contraseña
                </label>
                <div className={`caja-input-auth ${erroresCampos.loginClave ? 'con-error' : ''}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">lock</span>
                  <input
                    type={verLoginClave ? 'text' : 'password'}
                    id="loginClave"
                    name="loginClave"
                    className="input-auth-campo"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    value={loginClave}
                    onChange={(e) => {
                      setLoginClave(e.target.value);
                      if (erroresCampos.loginClave) {
                        setErroresCampos((prev) => ({ ...prev, loginClave: '' }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="boton-revelar-clave-auth"
                    onClick={() => setVerLoginClave(!verLoginClave)}
                    aria-label={verLoginClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined">
                      {verLoginClave ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {erroresCampos.loginClave && (
                  <p className="mensaje-error-auth">{erroresCampos.loginClave}</p>
                )}
              </div>

              <div className="fila-opciones-auth">
                <label className="checkbox-auth">
                  <input
                    type="checkbox"
                    id="recordarSesion"
                    checked={recordarSesion}
                    onChange={(e) => setRecordarSesion(e.target.checked)}
                  />
                  <span>Recordar mi sesión</span>
                </label>
                <button
                  type="button"
                  className="enlace-olvido-auth bg-transparent border-0 p-0 text-xs"
                  onClick={() => {
                    setAlerta({
                      texto: 'Te enviaremos las instrucciones de recuperación a tu correo registrado.',
                      esError: false
                    });
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button type="submit" className="boton-auth-submit" id="btnSubmitLogin" disabled={cargando}>
                <span aria-hidden="true" className="material-symbols-outlined">
                  {cargando ? 'hourglass_top' : 'login'}
                </span>
                <span>{cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
              </button>
            </form>

            {/* Notificación de retroalimentación flotante en Login */}
            {alerta && modoActual === 'login' && (
              <div
                className={`alerta-auth-flotante visible ${alerta.esError ? 'error' : ''}`}
                id="alertaAuth"
                role={alerta.esError ? 'alert' : 'status'}
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  {alerta.esError ? 'error' : 'check_circle'}
                </span>
                <span className="texto-alerta-auth" id="textoAlertaAuth">
                  {alerta.texto}
                </span>
                <button
                  type="button"
                  className="boton-cerrar-alerta-auth"
                  aria-label="Cerrar aviso"
                  onClick={() => setAlerta(null)}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==============================================
             COLUMNA DERECHA: FORMULARIO REGISTRO
             ============================================== */}
        <div
          className={`panel-auth-col panel-registro-col ${modoActual === 'registro' ? 'activo' : 'inactivo'}`}
          aria-hidden={modoActual !== 'registro'}
        >
          <div className="seccion-form-registro">
            <div className="logo-auth-contenedor">
              <div className="logo-auth-icono">
                <span aria-hidden="true" className="material-symbols-outlined">local_florist</span>
              </div>
              <span className="logo-auth-nombre">Leer nos une</span>
            </div>

            <h1 className="titulo-auth">Crear cuenta</h1>

            <form id="formRegistro" onSubmit={handleRegisterSubmit} noValidate>
              <div className="grupo-input-auth">
                <label className="etiqueta-auth" htmlFor="registroNombre">
                  Nombre completo
                </label>
                <div className={`caja-input-auth ${erroresCampos.registroNombre ? 'con-error' : ''}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">person</span>
                  <input
                    type="text"
                    id="registroNombre"
                    name="registroNombre"
                    className="input-auth-campo"
                    placeholder="Ej. Ana Morales"
                    required
                    autoComplete="name"
                    value={registroNombre}
                    onChange={(e) => {
                      setRegistroNombre(e.target.value);
                      if (erroresCampos.registroNombre) {
                        setErroresCampos((prev) => ({ ...prev, registroNombre: '' }));
                      }
                    }}
                  />
                </div>
                {erroresCampos.registroNombre && (
                  <p className="mensaje-error-auth">{erroresCampos.registroNombre}</p>
                )}
              </div>

              <div className="grupo-input-auth">
                <label className="etiqueta-auth" htmlFor="registroEmail">
                  Correo electrónico
                </label>
                <div className={`caja-input-auth ${erroresCampos.registroEmail ? 'con-error' : ''}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    id="registroEmail"
                    name="registroEmail"
                    className="input-auth-campo"
                    placeholder="vecino@ejemplo.com"
                    required
                    autoComplete="email"
                    value={registroEmail}
                    onChange={(e) => {
                      setRegistroEmail(e.target.value);
                      if (erroresCampos.registroEmail) {
                        setErroresCampos((prev) => ({ ...prev, registroEmail: '' }));
                      }
                    }}
                  />
                </div>
                {erroresCampos.registroEmail && (
                  <p className="mensaje-error-auth">{erroresCampos.registroEmail}</p>
                )}
              </div>

              <div className="grupo-input-auth">
                <label className="etiqueta-auth" htmlFor="registroClave">
                  Contraseña
                </label>
                <div className={`caja-input-auth ${erroresCampos.registroClave ? 'con-error' : ''}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">lock</span>
                  <input
                    type={verRegistroClave ? 'text' : 'password'}
                    id="registroClave"
                    name="registroClave"
                    className="input-auth-campo"
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoComplete="new-password"
                    value={registroClave}
                    onChange={(e) => {
                      setRegistroClave(e.target.value);
                      if (erroresCampos.registroClave) {
                        setErroresCampos((prev) => ({ ...prev, registroClave: '' }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="boton-revelar-clave-auth"
                    onClick={() => setVerRegistroClave(!verRegistroClave)}
                    aria-label={verRegistroClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined">
                      {verRegistroClave ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {erroresCampos.registroClave && (
                  <p className="mensaje-error-auth">{erroresCampos.registroClave}</p>
                )}
              </div>

              <button
                type="submit"
                className="boton-auth-submit mt-4"
                id="btnSubmitRegistro"
                disabled={cargando}
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  {cargando ? 'hourglass_top' : 'how_to_reg'}
                </span>
                <span>{cargando ? 'Registrando cuenta...' : 'Crear cuenta'}</span>
              </button>
            </form>

            {/* Notificación de retroalimentación flotante en Registro */}
            {alerta && modoActual === 'registro' && (
              <div
                className={`alerta-auth-flotante visible ${alerta.esError ? 'error' : ''}`}
                id="alertaAuthRegistro"
                role={alerta.esError ? 'alert' : 'status'}
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  {alerta.esError ? 'error' : 'check_circle'}
                </span>
                <span className="texto-alerta-auth">
                  {alerta.texto}
                </span>
                <button
                  type="button"
                  className="boton-cerrar-alerta-auth"
                  aria-label="Cerrar aviso"
                  onClick={() => setAlerta(null)}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==============================================
             PANEL VISUAL OSCURO DESLIZANTE (SHOWCASE)
             ============================================== */}
        <div
          className={`panel-auth-visual ${modoActual === 'registro' ? 'desplazado-izquierda' : ''}`}
          id="panelVisual"
          ref={panelVisualRef}
        >
          <span aria-hidden="true" className="material-symbols-outlined marca-agua-logo">
            local_florist
          </span>
          <h2 className="titulo-visual" id="tituloVisual">
            {modoActual === 'registro' ? '¡Bienvenido de nuevo!' : '¿Eres nuevo por aquí?'}
          </h2>
          <p className="descripcion-visual" id="descVisual">
            {modoActual === 'registro'
              ? 'Inicia sesión para consultar tus libros en préstamo, renovar plazos y explorar el catálogo.'
              : 'Crea tu cuenta de vecino lector para solicitar préstamos y participar en talleres comunitarios.'}
          </p>
          <button
            type="button"
            className="boton-cambiar-auth"
            id="btnCambiarAuth"
            onClick={alternarModoAuth}
          >
            <span>{modoActual === 'registro' ? 'Iniciar sesión' : 'Crear cuenta'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Auth;
