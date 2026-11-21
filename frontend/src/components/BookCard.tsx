import React from 'react';
import { Book } from '../types/index.js';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  viewMode?: 'grid' | 'list';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, viewMode = 'grid' }) => {
  const getBadgeClass = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'DISPONIBLE':
        return 'badge-disponible';
      case 'PRESTAMO':
        return 'badge-prestamo';
      case 'SALA':
        return 'badge-sala';
      case 'NOVEDAD':
        return 'badge-novedad';
      default:
        return 'badge-disponible';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'PRESTAMO':
        return 'En préstamo';
      case 'SALA':
        return 'Lectura en sala';
      case 'NOVEDAD':
        return 'Novedad';
      default:
        return estado;
    }
  };

  const portadaSrc = book.portada.startsWith('http')
    ? book.portada
    : book.portada.startsWith('/uploads')
    ? book.portada
    : `/img/${book.portada.replace(/^img\//, '')}`;

  if (viewMode === 'list') {
    return (
      <div
        className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 cursor-pointer mb-3.5 bg-white border border-border-subtle hover:border-primary/30"
        onClick={() => onSelect(book)}
      >
        <div className="w-full sm:w-24 h-48 sm:h-32 rounded-lg overflow-hidden bg-[#eee8dc] shrink-0 border border-black/5">
          <img
            src={portadaSrc}
            alt={book.titulo}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`badge ${getBadgeClass(book.estado)}`}>
              {getStatusLabel(book.estado)}
            </span>
            <span className="text-xs text-on-surface-muted font-medium">{book.genero}</span>
          </div>
          <h3 className="font-display text-lg font-bold text-primary leading-tight">{book.titulo}</h3>
          <p className="text-sm text-on-surface-variant font-medium">{book.autor}</p>
          <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{book.descripcion}</p>
          <div className="flex flex-wrap gap-4 text-xs text-secondary mt-1">
            <span><strong>Copias:</strong> {book.copias}</span>
            <span><strong>Lectores:</strong> {book.lectores}</span>
            {book.nota > 0 && <span><strong>Nota:</strong> {book.nota.toFixed(1)}/5</span>}
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            className="btn btn-outline btn-sm w-full sm:w-auto"
            onClick={(e) => { e.stopPropagation(); onSelect(book); }}
          >
            Ver Ficha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card flex flex-col h-full cursor-pointer group bg-white border border-border-subtle hover:border-primary/30"
      onClick={() => onSelect(book)}
    >
      {/* Marco Editorial de Portada con proporción áurea de libro */}
      <div className="relative w-full pt-[142%] bg-[#eee8dc] overflow-hidden border-b border-border-subtle/60">
        <img
          src={portadaSrc}
          alt={book.titulo}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
          }}
        />
        {/* Sombra de relieve de lomo de libro */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
        <span className={`badge ${getBadgeClass(book.estado)} absolute top-2.5 right-2.5 shadow-xs`}>
          {getStatusLabel(book.estado)}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] text-tertiary font-bold tracking-wide uppercase mb-1">{book.genero}</span>
        <h3 className="font-display text-base font-bold text-primary leading-snug mb-1 line-clamp-2 min-h-[2.4rem]" title={book.titulo}>
          {book.titulo}
        </h3>
        <p className="text-xs text-on-surface-variant font-medium mb-3">{book.autor}</p>

        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-secondary">
          <span>{book.copias} {book.copias === 1 ? 'copia' : 'copias'}</span>
          <span className="font-semibold text-primary">
            {book.lectores} lectores
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
