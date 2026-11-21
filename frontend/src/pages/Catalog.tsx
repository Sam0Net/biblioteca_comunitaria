import React, { useState, useEffect } from 'react';
import { Book } from '../types/index.js';
import { api } from '../services/api.js';
import { BookCard } from '../components/BookCard.js';
import { BookDetailModal } from '../components/BookDetailModal.js';
import { BookCardSkeleton } from '../components/Skeleton.js';

export const Catalog: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('todos');
  const [estado, setEstado] = useState<string>('todos');
  const [orden, setOrden] = useState<string>('recientes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [categoriasList, setCategoriasList] = useState<string[]>([
    'todos',
    'novela',
    'clasicos',
    'filosofia',
    'infantil',
    'poesia',
    'psicoanalisis',
    'historia'
  ]);

  const fetchBooks = async () => {
    setCargando(true);
    try {
      const params: any = {};
      if (busqueda.trim()) params.q = busqueda.trim();
      if (categoria !== 'todos') params.categoria = categoria;
      if (estado !== 'todos') params.estado = estado;
      if (orden) params.orden = orden;

      const res = await api.get('/libros', { params });
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (err) {
      console.error('Error al cargar libros:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [busqueda, categoria, estado, orden]);

  useEffect(() => {
    api.get('/libros/meta/categorias')
      .then((res) => {
        if (res.data.success) {
          const keys = Object.keys(res.data.data);
          if (keys.length > 0) {
            setCategoriasList(['todos', ...keys]);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-[calc(100vh-72px)]">
      {/* Banner de Cabecera Editorial */}
      <section className="bg-[#faf7f0] py-10 sm:py-14 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
            Catálogo General de Libros
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Explora las obras disponibles para préstamo a domicilio y consulta en el jardín y salas de lectura.
          </p>

          {/* Barra de Búsqueda de Precisión */}
          <div className="relative max-w-2xl mt-6">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/70 text-2xl">
              search
            </span>
            <input
              type="text"
              className="w-full pl-12 pr-12 py-3 rounded-lg border border-border-subtle bg-white text-base font-body shadow-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-on-surface-muted"
              placeholder="Buscar por título, autor, género o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center cursor-pointer"
                onClick={() => setBusqueda('')}
                title="Limpiar búsqueda"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Controles y Filtros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Selector de Categorías Estructurado */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {categoriasList.map((cat) => (
            <button
              key={cat}
              className={`px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoria === cat
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white border-border-subtle text-on-surface-variant hover:bg-surface-low hover:text-primary'
              }`}
              onClick={() => setCategoria(cat)}
            >
              {cat === 'todos' ? 'Todas las Categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Toolbar de Filtros y Orden */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3.5 sm:px-5 sm:py-3 rounded-lg border border-border-subtle mb-8 shadow-xs">
          <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-on-surface">
              Mostrando <strong className="text-primary font-semibold">{books.length}</strong> {books.length === 1 ? 'título' : 'títulos'}
            </span>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <label htmlFor="filtroEstado">Estado:</label>
              <select
                id="filtroEstado"
                className="form-select py-1 px-2.5 text-xs rounded-md w-auto bg-surface-low border border-border-subtle"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="DISPONIBLE">Disponibles</option>
                <option value="PRESTAMO">En préstamo</option>
                <option value="SALA">Solo en sala</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <label htmlFor="filtroOrden">Ordenar por:</label>
              <select
                id="filtroOrden"
                className="form-select py-1 px-2.5 text-xs rounded-md w-auto bg-surface-low border border-border-subtle"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="populares">Más leídos</option>
                <option value="titulo">Título (A-Z)</option>
                <option value="autor">Autor (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Selector de Vista: Cuadrícula / Lista */}
          <div className="flex items-center gap-1 border border-border-subtle rounded-lg p-1 bg-surface-low">
            <button
              className={`p-1.5 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-muted hover:text-primary'
              }`}
              onClick={() => setViewMode('grid')}
              title="Vista en cuadrícula"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              className={`p-1.5 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-muted hover:text-primary'
              }`}
              onClick={() => setViewMode('list')}
              title="Vista en lista"
            >
              <span className="material-symbols-outlined text-lg">view_list</span>
            </button>
          </div>
        </div>

        {/* Estado de Carga con Esqueletos Shimmer */}
        {cargando ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <BookCardSkeleton key={`catalog-skel-${i}`} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={`catalog-skel-list-${i}`} viewMode="list" />
              ))}
            </div>
          )
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-border-subtle p-8 shadow-xs">
            <span className="material-symbols-outlined text-4xl text-on-surface-muted mb-2 inline-block">
              search_off
            </span>
            <h3 className="font-display text-lg font-bold text-primary mb-1">
              No se encontraron obras coincidentes
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-5">
              Prueba modificando los términos de búsqueda o restableciendo los filtros de categoría.
            </p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setBusqueda('');
                setCategoria('todos');
                setEstado('todos');
              }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'flex flex-col'
            }
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={(b) => setSelectedBook(b)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Detalle */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onLoanCreated={() => {
            fetchBooks();
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default Catalog;
