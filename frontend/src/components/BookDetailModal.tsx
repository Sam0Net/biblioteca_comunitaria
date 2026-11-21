import React, { useState } from 'react';
import { Book } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Link } from 'react-router-dom';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onLoanCreated?: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose, onLoanCreated }) => {
  const { user } = useAuth();
  const [dias, setDias] = useState<number>(14);
  const [notas] = useState<string>('');
  const [solicitando, setSolicitando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const portadaSrc = book.portada.startsWith('http')
    ? book.portada
    : book.portada.startsWith('/uploads')
    ? book.portada
    : `/img/${book.portada.replace(/^img\//, '')}`;

  const handleSolicitarPrestamo = async () => {
    if (!user) return;
    setSolicitando(true);
    setMensaje(null);

    try {
      const res = await api.post('/prestamos', {
        bookId: book.id,
        dias,
        notas
      });

      if (res.data.success) {
        setMensaje({
          tipo: 'success',
          texto: '¡Préstamo solicitado con éxito! Pasa por recepción con tu carnet para retirarlo.'
        });
        if (onLoanCreated) {
          setTimeout(() => {
            onLoanCreated();
          }, 1500);
        }
      }
    } catch (err: any) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.message || 'Error al solicitar el préstamo.'
      });
    } finally {
      setSolicitando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1d1c16]/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 z-50 animate-fade-backdrop" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative border border-border-subtle animate-modal-spring"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-surface-low hover:bg-surface-dim text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors cursor-pointer z-10 border border-border-subtle"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr] gap-6 sm:gap-8">
          <div className="flex flex-col gap-3.5">
            <div className="rounded-lg overflow-hidden bg-[#eee8dc] border border-black/10 shadow-xs">
              <img
                src={portadaSrc}
                alt={book.titulo}
                className="w-full h-64 sm:h-76 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
                }}
              />
            </div>
            <div className="bg-surface-low p-3.5 rounded-lg text-xs flex flex-col gap-2 border border-border-subtle">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-muted">Disponibilidad:</span>
                <span className={`badge ${book.copias > 0 ? 'badge-disponible' : 'badge-prestamo'}`}>
                  {book.copias > 0 ? `${book.copias} en estantería` : 'Agotado'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-muted">Lectores:</span>
                <span className="font-semibold text-primary">{book.lectores} vecinos</span>
              </div>
              {book.nota > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-muted">Calificación:</span>
                  <span className="font-semibold text-primary">{book.nota.toFixed(1)} / 5</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-tertiary text-xs font-bold uppercase tracking-wider">{book.genero}</span>
            <h2 className="font-display text-2xl font-bold text-primary my-1 leading-tight tracking-tight">{book.titulo}</h2>
            <p className="text-sm text-on-surface-variant mb-4">Por <strong className="text-on-surface font-semibold">{book.autor}</strong></p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {book.formatos?.map((f, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-surface-container text-primary font-medium border border-border-subtle/50">
                  Formato: {f}
                </span>
              ))}
              {book.categorias?.map((c, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-surface-container text-secondary font-medium border border-border-subtle/50">
                  #{c}
                </span>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="font-display text-sm font-bold text-primary mb-1">Sinopsis</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {book.descripcion || 'Sin descripción disponible en el catálogo.'}
              </p>
            </div>

            {mensaje && (
              <div className={`p-3 rounded-lg text-xs mb-3 flex items-center gap-2 ${
                mensaje.tipo === 'success'
                  ? 'bg-status-available-bg text-status-available border border-status-available/20'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {mensaje.tipo === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{mensaje.texto}</span>
              </div>
            )}

            {/* Acciones de Préstamo */}
            <div className="mt-auto pt-4 border-t border-border-subtle">
              {book.estado === 'SALA' ? (
                <div className="p-3 bg-surface-low text-secondary text-xs rounded-lg border border-border-subtle flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">local_library</span>
                  <span>Este ejemplar es de <strong>lectura exclusiva en sala</strong>. Puedes consultarlo libremente en nuestro horario de atención.</span>
                </div>
              ) : book.copias < 1 ? (
                <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-lg border border-amber-200 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px]">event_busy</span>
                  <span>No hay copias disponibles en este momento. Por favor vuelve a consultar en unos días.</span>
                </div>
              ) : user ? (
                <div className="bg-surface-low p-4 rounded-lg border border-border-subtle">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label htmlFor="diasPrestamo" className="text-xs font-semibold text-primary whitespace-nowrap">
                      Plazo de préstamo:
                    </label>
                    <select
                      id="diasPrestamo"
                      className="form-select text-xs py-1.5 px-3 rounded-md w-full sm:w-auto"
                      value={dias}
                      onChange={(e) => setDias(Number(e.target.value))}
                    >
                      <option value={7}>7 días (1 semana)</option>
                      <option value={14}>14 días (Estándar recomendado)</option>
                      <option value={21}>21 días (Lectura pausada)</option>
                    </select>
                    <button
                      className="btn btn-primary btn-sm whitespace-nowrap w-full sm:w-auto ml-auto"
                      onClick={handleSolicitarPrestamo}
                      disabled={solicitando}
                    >
                      {solicitando ? 'Procesando...' : 'Confirmar Préstamo'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-low p-3.5 rounded-lg border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-on-surface-variant">¿Deseas solicitar este libro a domicilio?</span>
                  <Link to="/login" className="btn btn-primary btn-sm whitespace-nowrap w-full sm:w-auto" onClick={onClose}>
                    Inicia Sesión con tu Carnet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
