import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Activity } from '../types/index.js';
import { api } from '../services/api.js';
import { BookCard } from '../components/BookCard.js';
import { BookDetailModal } from '../components/BookDetailModal.js';
import { BookCardSkeleton } from '../components/Skeleton.js';
import { DiaTextReveal } from '../components/DiaTextReveal.js';
import { OrbitalImageWheel } from '../components/OrbitalImageWheel.js';
import { useAuth } from '../context/AuthContext.js';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [librosPopulares, setLibrosPopulares] = useState<Book[]>([]);
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [mensajeInscripcion, setMensajeInscripcion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLibros, resAgenda] = await Promise.all([
          api.get('/libros?limit=10&orden=populares'),
          api.get('/agenda')
        ]);

        if (resLibros.data.success) {
          setLibrosPopulares(resLibros.data.data);
        }
        if (resAgenda.data.success) {
          setActividades(resAgenda.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error cargando datos de inicio:', err);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const handleInscribirse = async (actId: string) => {
    if (!user) {
      alert('Por favor inicia sesión con tu carnet vecinal para inscribirte');
      return;
    }
    try {
      const res = await api.post(`/agenda/${actId}/inscribirse`);
      if (res.data.success) {
        setMensajeInscripcion('¡Inscripción confirmada! Te esperamos.');
        const resAgenda = await api.get('/agenda');
        if (resAgenda.data.success) {
          setActividades(resAgenda.data.data.slice(0, 3));
        }
        setTimeout(() => setMensajeInscripcion(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al inscribirse en la actividad');
    }
  };

  return (
    <div className="bg-background text-on-surface">
      {/* Hero Section Editorial Botánico */}
      <section className="border-b border-border-subtle py-12 sm:py-16 bg-[#faf7f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
          <div className="lg:col-span-7 min-w-0 w-full">
            {/* H1 con efecto Dia Text Reveal refinado y contenedor rígido anti-shift */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-tight mb-5 tracking-tight">
              <span className="block mb-1">Leer nos une:</span>
              <span className="block min-h-[1.35em] overflow-hidden text-primary">
                <DiaTextReveal
                  text={[
                    'Historias y comunidad viva.',
                    'Un refugio verde para conectar.',
                    'Lecturas que transforman el barrio.',
                    'Saberes compartidos para todos.'
                  ]}
                  repeat={true}
                  repeatDelay={2.0}
                  duration={0.6}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-xl font-normal">
              Biblioteca comunitaria y jardín de lectura abierto a todo el vecindario. Consulta el catálogo libremente, solicita préstamos a domicilio con tu carnet y participa en los talleres botánicos semanales.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/libros" className="btn btn-primary">
                <span className="material-symbols-outlined text-[19px]">menu_book</span>
                Explorar Catálogo
              </Link>
              {!user ? (
                <Link to="/registro" className="btn btn-secondary">
                  <span className="material-symbols-outlined text-[19px]">badge</span>
                  Solicitar Carnet Gratuito
                </Link>
              ) : (
                <Link to="/servicios" className="btn btn-secondary">
                  <span className="material-symbols-outlined text-[19px]">calendar_today</span>
                  Salas y Talleres
                </Link>
              )}
            </div>
          </div>

          {/* Fotografía Enmarcada estilo Prensa & Encuadernación con dimensiones fijas anti-jitter */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none min-w-0">
            <div className="rounded-xl overflow-hidden border border-border-subtle bg-white shadow-sm p-2 w-full">
              <div className="rounded-lg overflow-hidden bg-[#eee8dc] aspect-[4/3] sm:h-96 w-full">
                <img
                  src="/img/biblioteca-comunitaria.png"
                  alt="Biblioteca Comunitaria Leer nos une"
                  className="w-full h-full object-cover block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/cien-anos-soledad.jpg';
                  }}
                />
              </div>
              <div className="pt-3 px-2 pb-1 flex items-center justify-between text-xs text-on-surface-muted">
                <span className="font-medium text-primary">Jardín botánico & sala de lectura abierta</span>
                <span>Acceso libre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franja de Indicadores Cívicos (Sin tarjetas repetitivas de IA) */}
      <section className="border-b border-border-subtle bg-surface-low py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle/70">
            <div className="pt-2 sm:pt-0 sm:px-4 first:pl-0">
              <span className="block font-display text-2xl lg:text-3xl font-bold text-primary tracking-tight">22+</span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Obras catalogadas en estantería</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="block font-display text-2xl lg:text-3xl font-bold text-primary tracking-tight">100%</span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Servicio público y gratuito</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="block font-display text-2xl lg:text-3xl font-bold text-primary tracking-tight">3</span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Salas y jardín botánico vecinal</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <span className="block font-display text-2xl lg:text-3xl font-bold text-primary tracking-tight">14 días</span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Plazo de préstamo a domicilio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Libros Más Leídos con Orbital Image Wheel */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <BookCardSkeleton key={`home-skel-${i}`} />
              ))}
            </div>
          ) : (
            <OrbitalImageWheel
              books={librosPopulares}
              onSelectBook={(b) => setSelectedBook(b)}
              title="Libros Más Leídos de la Comunidad"
              subtitle="Obras seleccionadas con mayor índice de rotación y lectura entre los vecinos del barrio"
            />
          )}
        </div>
      </section>

      {/* Sección Catálogo Destacado */}
      <section className="py-12 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Obras en Estantería
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Títulos disponibles para consulta en sala o retiro a domicilio.
              </p>
            </div>
            <Link to="/libros" className="btn btn-outline btn-sm">
              Ver Catálogo Completo ({librosPopulares.length}+ títulos) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cargando
              ? Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={`home-grid-skel-${i}`} />)
              : librosPopulares.slice(0, 4).map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={(b) => setSelectedBook(b)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Sección Agenda Comunitaria */}
      <section className="py-14 bg-surface-low border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Próximos Talleres y Encuentros
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Actividades culturales libres con inscripción previa para vecinos registrados.
              </p>
            </div>
            <Link to="/servicios" className="btn btn-outline btn-sm">
              Cronograma de Salas →
            </Link>
          </div>

          {mensajeInscripcion && (
            <div className="p-3.5 bg-status-available-bg text-status-available border border-status-available/20 rounded-lg text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{mensajeInscripcion}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actividades.map((act) => (
              <div key={act.id} className="card p-6 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-sala">{act.categoria}</span>
                    <span className="text-xs font-semibold text-secondary">
                      {act.cuposDisponibles > 0 ? `${act.cuposDisponibles} plazas libres` : 'Agotado'}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary mb-2 leading-snug">
                    {act.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed">
                    {act.descripcion}
                  </p>
                </div>

                <div>
                  <div className="flex flex-col gap-1.5 text-xs text-secondary mb-5 border-t border-border-subtle pt-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">calendar_month</span>
                      <span>{act.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                      <span>{act.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                      <span>{act.lugar}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {act.estaInscrito ? (
                      <span className="badge badge-disponible text-xs">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Inscripción activa
                      </span>
                    ) : act.cuposDisponibles > 0 ? (
                      <button
                        className="btn btn-primary btn-sm w-full sm:w-auto"
                        onClick={() => handleInscribirse(act.id)}
                      >
                        Inscribirme Gratis
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm w-full sm:w-auto opacity-70" disabled>
                        Plazas Agotadas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Detalle */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onLoanCreated={() => {
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
