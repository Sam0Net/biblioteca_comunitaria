import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Activity } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';

export const Services: React.FC = () => {
  const { user } = useAuth();
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    api.get('/agenda').then((res) => {
      if (res.data.success) {
        setActividades(res.data.data);
      }
    });
  }, []);

  const handleInscribirse = async (id: string) => {
    if (!user) {
      alert('Debes iniciar sesión con tu carnet de vecino para inscribirte');
      return;
    }
    try {
      const res = await api.post(`/agenda/${id}/inscribirse`);
      if (res.data.success) {
        setMensaje('¡Inscripción confirmada! Te esperamos en la sala.');
        const resAgenda = await api.get('/agenda');
        if (resAgenda.data.success) setActividades(resAgenda.data.data);
        setTimeout(() => setMensaje(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al inscribirse');
    }
  };

  const salas = [
    { dia: 'Lunes a viernes', espacio: 'Sala de lectura silenciosa', abre: '08:30', cierra: '19:30', actividad: 'Estudio individual e investigación', aforo: '30 personas' },
    { dia: 'Lunes a viernes', espacio: 'Jardín botánico y mesas', abre: '09:00', cierra: '18:30', actividad: 'Lectura al aire libre, wifi y tertulias', aforo: '35 personas' },
    { dia: 'Miércoles', espacio: 'Rincón infantil', abre: '16:00', cierra: '17:30', actividad: 'Taller infantil de cuentacuentos y títeres', aforo: '15 niños con tutores' },
    { dia: 'Sábados', espacio: 'Sala botánica principal', abre: '09:00', cierra: '16:00', actividad: 'Clubes de lectura y café literario', aforo: '25 personas' },
    { dia: 'Domingos', espacio: 'Patio exterior', abre: '10:00', cierra: '14:00', actividad: 'Intercambio vecinal y donaciones de libros', aforo: '25 personas' }
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-72px)]">
      {/* Banner de Cabecera */}
      <section className="bg-[#faf7f0] py-10 sm:py-14 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
            Salas, Servicios y Horarios
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Conoce nuestros ambientes diseñados para el estudio tranquilo, la investigación y el encuentro vecinal.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">
        {/* Tabla de Horarios */}
        <div className="card p-6 sm:p-8 bg-white border border-border-subtle shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border-subtle">
            <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
                Cronograma Semanal de Salas
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">Acceso libre y ordenado para toda la comunidad.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-low text-primary font-semibold text-xs uppercase tracking-wider">
                  <th className="p-3.5 border-b border-border-subtle">Día</th>
                  <th className="p-3.5 border-b border-border-subtle">Espacio</th>
                  <th className="p-3.5 border-b border-border-subtle">Horario</th>
                  <th className="p-3.5 border-b border-border-subtle">Actividad Principal</th>
                  <th className="p-3.5 border-b border-border-subtle">Aforo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {salas.map((s, idx) => (
                  <tr key={idx} className="hover:bg-surface-low/50 transition-colors">
                    <td className="p-3.5 font-bold text-on-surface">{s.dia}</td>
                    <td className="p-3.5 font-semibold text-primary">{s.espacio}</td>
                    <td className="p-3.5">
                      <span className="badge badge-sala">{s.abre} - {s.cierra}</span>
                    </td>
                    <td className="p-3.5 text-on-surface-variant">{s.actividad}</td>
                    <td className="p-3.5 text-secondary">{s.aforo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Talleres y Actividades */}
        <div className="card p-6 sm:p-8 bg-white border border-border-subtle shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border-subtle">
            <span className="material-symbols-outlined text-primary text-2xl">event_available</span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
                Talleres Comunitarios con Inscripción
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">Cupos reservados para vecinos con carnet registrado.</p>
            </div>
          </div>

          {mensaje && (
            <div className="p-3.5 rounded-lg bg-status-available-bg text-status-available border border-status-available/20 text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{mensaje}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {actividades.map((act) => (
              <div
                key={act.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-lg bg-surface-low border border-border-subtle hover:border-primary/30 transition-colors"
              >
                <div className="bg-primary text-white p-3 rounded-lg flex items-center justify-center shrink-0 w-12 h-12 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">{act.icono}</span>
                </div>
                <div className="flex-1">
                  <span className="badge badge-sala mb-1.5">{act.categoria}</span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-primary mb-1">
                    {act.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {act.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-secondary mt-2">
                    <span><strong>Fecha:</strong> {act.fecha}</span>
                    <span><strong>Hora:</strong> {act.hora}</span>
                    <span><strong>Lugar:</strong> {act.lugar}</span>
                    <span className="font-semibold text-primary">{act.cuposDisponibles} cupos restantes</span>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {act.estaInscrito ? (
                    <span className="badge badge-disponible text-xs">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Inscrito
                    </span>
                  ) : act.cuposDisponibles > 0 ? (
                    <button
                      className="btn btn-primary btn-sm w-full sm:w-auto"
                      onClick={() => handleInscribirse(act.id)}
                    >
                      Inscribirme
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm w-full sm:w-auto opacity-70" disabled>
                      Agotado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
