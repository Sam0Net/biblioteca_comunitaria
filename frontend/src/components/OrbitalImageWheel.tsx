import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '../types/index.js';

interface OrbitalImageWheelProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  title?: string;
  subtitle?: string;
}

export const OrbitalImageWheel: React.FC<OrbitalImageWheelProps> = ({
  books,
  onSelectBook,
  title = 'Colección Más Leída del Barrio',
  subtitle = 'Obras con mayor rotación en préstamos vecinales y lectura en sala'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = books.length;
  if (total === 0) return null;

  const nextItem = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevItem = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextItem, prevItem]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextItem();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextItem, isPaused]);

  const activeBook = books[activeIndex] || books[0];

  const getPortadaUrl = (book: Book) => {
    if (!book) return '/img/portada-el-principito.jpg';
    if (book.portada.startsWith('http')) return book.portada;
    if (book.portada.startsWith('/uploads')) return book.portada;
    return `/img/${book.portada.replace(/^img\//, '')}`;
  };

  const angleStep = 20;
  const radius = 580;

  return (
    <div
      className="relative w-full overflow-hidden py-10 px-3 bg-surface-low rounded-2xl border border-border-subtle my-8 shadow-xs"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      {/* Cabecera Editorial Limpia (Sin Kickers de IA) */}
      <div className="text-center mb-8 px-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          {title}
        </h2>
        <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Rueda Orbital */}
      <div className="relative w-full h-[360px] sm:h-[430px] flex items-center justify-center [perspective:1200px] select-none">
        {/* Iluminación ambiental botánica tenue y no fluorescente */}
        <div className="absolute w-[360px] sm:w-[520px] h-[260px] sm:h-[320px] top-[15%] left-1/2 -translate-x-1/2 bg-[radial-gradient(circle,rgba(210,230,220,0.4)_0%,rgba(244,239,230,0.2)_50%,transparent_75%)] blur-2xl pointer-events-none z-[1]" />

        <div className="relative w-full h-full">
          {books.map((book, index) => {
            let diff = index - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isFocus = diff === 0;
            const absDiff = Math.abs(diff);

            if (absDiff > 3) return null;

            const angleDeg = diff * angleStep;
            const angleRad = (angleDeg * Math.PI) / 180;

            const x = Math.sin(angleRad) * radius;
            const y = (1 - Math.cos(angleRad)) * radius;

            const scale = Math.max(0.74, 1.05 - absDiff * 0.11);
            const opacity = Math.max(0.4, 1 - absDiff * 0.22);
            const blur = absDiff * 1.2;
            const zIndex = 20 - absDiff;

            return (
              <motion.div
                key={book.id}
                className={`w-[140px] sm:w-[176px] h-[210px] sm:h-[264px] -ml-[70px] sm:-ml-[88px] mt-4 rounded-xl bg-white transition-shadow duration-300 ${
                  isFocus
                    ? 'shadow-[0_12px_32px_rgba(0,54,38,0.18)] ring-2 ring-primary/40'
                    : 'shadow-[0_4px_14px_rgba(0,54,38,0.06)]'
                }`}
                onClick={() => {
                  if (isFocus) {
                    onSelectBook(book);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                animate={{
                  x,
                  y,
                  rotate: angleDeg * 0.7,
                  scale,
                  opacity,
                  filter: `blur(${blur}px) brightness(${isFocus ? 1.02 : 0.88})`,
                  zIndex
                }}
                transition={{
                  type: 'spring',
                  stiffness: 170,
                  damping: 22,
                  mass: 0.8
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '12%'
                }}
                whileHover={{
                  scale: scale * 1.03,
                  cursor: 'pointer'
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/5 bg-[#f5f2eb]">
                  <img
                    src={getPortadaUrl(book)}
                    alt={book.titulo}
                    className="w-full h-full object-cover block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
                    }}
                  />
                  {isFocus && (
                    <motion.div
                      className="absolute top-2.5 inset-x-2.5 bg-primary/95 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold text-center tracking-wide shadow-sm"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span>Colección #{activeIndex + 1}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controles de Navegación Lateral (Estilo Táctil Arquitectónico) */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-white shadow-sm text-primary flex items-center justify-center cursor-pointer z-40 transition-all border border-border-subtle hover:bg-primary hover:text-white active:scale-95"
          onClick={prevItem}
          aria-label="Libro anterior"
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-white shadow-sm text-primary flex items-center justify-center cursor-pointer z-40 transition-all border border-border-subtle hover:bg-primary hover:text-white active:scale-95"
          onClick={nextItem}
          aria-label="Siguiente libro"
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>

      {/* Ficha Editorial del Libro Activo */}
      <AnimatePresence mode="wait">
        {activeBook && (
          <motion.div
            key={activeBook.id}
            className="card max-w-3xl mx-3 sm:mx-auto mt-6 mb-2 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 border border-border-subtle bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
                <span className="badge badge-sala">{activeBook.genero}</span>
                <span className={`badge ${activeBook.copias > 0 ? 'badge-disponible' : 'badge-prestamo'}`}>
                  {activeBook.copias > 0 ? `${activeBook.copias} en estantería` : 'Préstamo activo'}
                </span>
                <span className="text-xs text-on-surface-muted font-medium ml-1">
                  {activeBook.lectores} lectores registrados
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-primary mb-1 leading-snug">
                {activeBook.titulo}
              </h3>
              <p className="text-sm text-on-surface-variant mb-2">
                Por <strong className="text-on-surface font-semibold">{activeBook.autor}</strong>
              </p>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                {activeBook.descripcion}
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                className="btn btn-primary w-full md:w-auto"
                onClick={() => onSelectBook(activeBook)}
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                Consultar Ficha
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrbitalImageWheel;
