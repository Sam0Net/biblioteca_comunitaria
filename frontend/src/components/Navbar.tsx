import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 w-full md:w-auto ${
      isActive
        ? 'text-primary bg-primary-subtle'
        : 'text-on-surface-variant hover:text-primary hover:bg-surface-low'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border-subtle shadow-xs">
      <div className="flex items-center justify-between h-[72px] w-full px-4 sm:px-6">
        {/* Marca / Logo: Pegado a la izquierda */}
        <Link to="/" className="flex items-center gap-2.5 text-primary pl-1 group" onClick={() => setMenuAbierto(false)}>
          <span className="material-symbols-outlined text-[26px] text-primary bg-primary-subtle p-1.5 rounded-lg border border-primary/10">
            local_library
          </span>
          <span className="font-display text-xl font-bold text-primary tracking-tight whitespace-nowrap">
            Biblioteca Comunitaria
          </span>
        </Link>

        {/* Botón Menú Móvil */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-primary hover:bg-surface-low focus:outline-none cursor-pointer"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-2xl">{menuAbierto ? 'close' : 'menu'}</span>
        </button>

        {/* Navegación Principal */}
        <nav
          className={`${
            menuAbierto ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row items-center gap-3 md:gap-6 absolute md:static top-[72px] left-0 right-0 bg-white md:bg-transparent p-5 md:p-0 border-b md:border-b-0 border-border-subtle shadow-md md:shadow-none transition-all`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2 list-none w-full md:w-auto">
            <li className="w-full md:w-auto">
              <NavLink to="/" className={navItemClass} onClick={() => setMenuAbierto(false)}>
                Inicio
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <NavLink to="/libros" className={navItemClass} onClick={() => setMenuAbierto(false)}>
                Catálogo
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <NavLink to="/servicios" className={navItemClass} onClick={() => setMenuAbierto(false)}>
                Servicios
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <NavLink to="/contacto" className={navItemClass} onClick={() => setMenuAbierto(false)}>
                Contacto
              </NavLink>
            </li>
            {isAdmin && (
              <li className="w-full md:w-auto">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 w-full md:w-auto ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`
                  }
                  onClick={() => setMenuAbierto(false)}
                >
                  <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                  Administración
                </NavLink>
              </li>
            )}
          </ul>

          {/* Acciones de Usuario */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-center pt-3 md:pt-0 border-t md:border-t-0 border-border-subtle">
            {user ? (
              <div className="flex items-center gap-3">
                {!isAdmin && (
                  <div className="flex flex-col items-end leading-tight">
                    <span className="font-semibold text-xs text-primary">{user.nombre}</span>
                    <span className="text-[10px] text-on-surface-muted font-mono">{user.carnet || 'VECINO'}</span>
                  </div>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Cerrar sesión">
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/login" className="btn btn-outline btn-sm flex-1 sm:flex-initial" onClick={() => setMenuAbierto(false)}>
                  Ingresar
                </Link>
                <Link to="/registro" className="btn btn-primary btn-sm flex-1 sm:flex-initial" onClick={() => setMenuAbierto(false)}>
                  Solicitar Carnet
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
