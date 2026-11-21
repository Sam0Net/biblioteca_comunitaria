import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-[#e5ece8] mt-auto pt-14 border-t border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1.5fr] gap-8 md:gap-12 pb-12">
        {/* Columna Marca & Filosofía */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="material-symbols-outlined text-[26px] text-primary-fixed bg-white/10 p-1.5 rounded-lg">
              local_library
            </span>
            <span className="font-display text-xl text-white font-bold tracking-tight">
              Biblioteca Comunitaria «Leer nos une»
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#c4d7ce] mb-5 max-w-md">
            Espacio cultural y vecinal dedicado a la lectura, el intercambio de saberes y la comunidad activa. Visita nuestras salas y jardín botánico.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-primary-fixed rounded-md text-xs font-medium border border-white/10">
            <span className="material-symbols-outlined text-[17px]">eco</span>
            <span>Espacio sostenible y de libre acceso vecinal</span>
          </div>
        </div>

        {/* Columna Navegación */}
        <div>
          <h4 className="text-white font-display text-base mb-4 font-bold tracking-tight">Navegación</h4>
          <ul className="list-none flex flex-col gap-2 text-sm">
            <li><Link to="/" className="text-[#c4d7ce] hover:text-white transition-colors inline-block">Inicio</Link></li>
            <li><Link to="/libros" className="text-[#c4d7ce] hover:text-white transition-colors inline-block">Catálogo de Libros</Link></li>
            <li><Link to="/servicios" className="text-[#c4d7ce] hover:text-white transition-colors inline-block">Salas y Horarios</Link></li>
            <li><Link to="/contacto" className="text-[#c4d7ce] hover:text-white transition-colors inline-block">Contacto & Preguntas</Link></li>
            <li><Link to="/registro" className="text-[#c4d7ce] hover:text-white transition-colors inline-block">Solicitar Carnet Vecinal</Link></li>
          </ul>
        </div>

        {/* Columna Horarios */}
        <div>
          <h4 className="text-white font-display text-base mb-4 font-bold tracking-tight">Horarios de Atención</h4>
          <ul className="list-none flex flex-col gap-2 text-sm text-[#c4d7ce]">
            <li><strong className="text-white font-medium">Lunes a Viernes:</strong> 08:30 - 19:30</li>
            <li><strong className="text-white font-medium">Sábados:</strong> 09:00 - 16:00</li>
            <li><strong className="text-white font-medium">Domingos:</strong> 10:00 - 14:00 (Patio y Canje)</li>
            <li className="pt-2 text-xs text-[#a0baa9]"><strong className="text-white font-medium">Dirección:</strong> Av. Los Álamos 450</li>
          </ul>
        </div>
      </div>

      {/* Franja Inferior */}
      <div className="border-t border-white/10 py-5 text-xs text-[#a0baa9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-2">
          <p>© 2026 Biblioteca Comunitaria «Leer nos une». Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
