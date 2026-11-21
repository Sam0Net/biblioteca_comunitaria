import React, { useState } from 'react';
import { api } from '../services/api.js';

export const Contact: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setRespuesta(null);

    try {
      const res = await api.post('/admin/contacto', {
        nombre,
        correo,
        asunto,
        mensaje
      });

      if (res.data.success) {
        setRespuesta({
          tipo: 'success',
          texto: '¡Gracias por escribirnos! Tu mensaje ha sido registrado y te responderemos a la brevedad.'
        });
        setNombre('');
        setCorreo('');
        setAsunto('');
        setMensaje('');
      }
    } catch (err: any) {
      setRespuesta({
        tipo: 'error',
        texto: err.response?.data?.message || 'Error al enviar el mensaje. Inténtalo nuevamente.'
      });
    } finally {
      setEnviando(false);
    }
  };

  const faqs = [
    {
      q: '¿Cómo solicito un préstamo de libro?',
      a: 'Solo necesitas registrarte para obtener tu carnet vecinal. Luego navegas al catálogo, seleccionas la obra deseada y haces clic en "Confirmar Solicitud de Préstamo".'
    },
    {
      q: '¿Cuánto tiempo puedo tener un libro en casa?',
      a: 'El plazo estándar es de 14 días calendario, con posibilidad de renovarlo si no existen solicitudes pendientes de otros vecinos.'
    },
    {
      q: '¿Cómo puedo donar libros a la biblioteca?',
      a: 'Recibimos donaciones los domingos durante la jornada de canje en el patio exterior o de lunes a viernes en recepción. Aceptamos novelas, ensayos, cuentos y textos escolares en buen estado.'
    },
    {
      q: '¿Tiene costo el uso de las salas de lectura?',
      a: 'Ninguno. El acceso al catálogo, las salas de lectura, el jardín botánico y la conexión wifi es totalmente libre y gratuito para la comunidad.'
    }
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-72px)]">
      {/* Banner de Cabecera */}
      <section className="bg-[#faf7f0] py-10 sm:py-14 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-2 tracking-tight">
            Contacto y Preguntas Frecuentes
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
            ¿Tienes dudas, sugerencias o deseas proponer una tertulia literaria? Escríbenos o visítanos en nuestra sede botánica.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-10">
          {/* Formulario */}
          <div className="card p-6 sm:p-8 bg-white border border-border-subtle shadow-xs">
            <h2 className="font-display text-2xl font-bold text-primary mb-1 tracking-tight">Envíanos un Mensaje</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Completa el formulario y te responderemos por correo electrónico en menos de 24 horas.
            </p>

            {respuesta && (
              <div className={`p-3.5 rounded-lg text-xs mb-5 flex items-center gap-2 ${
                respuesta.tipo === 'success'
                  ? 'bg-status-available-bg text-status-available border border-status-available/20'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {respuesta.tipo === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{respuesta.texto}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1" htmlFor="nombre">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Clara Morales"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1" htmlFor="correo">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="clara.morales@correo.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1" htmlFor="asunto">
                  Asunto del Mensaje *
                </label>
                <input
                  type="text"
                  id="asunto"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej: Donación de libros de poesía"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1" htmlFor="mensaje">
                  Mensaje o Consulta *
                </label>
                <textarea
                  id="mensaje"
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Detalla tu consulta vecinal..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
                disabled={enviando}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                {enviando ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

          {/* Preguntas Frecuentes y Canales */}
          <div className="space-y-6">
            <div className="card p-6 sm:p-8 bg-white border border-border-subtle shadow-xs">
              <h2 className="font-display text-xl font-bold text-primary mb-4 tracking-tight">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="pb-3 border-b border-border-subtle last:border-0 last:pb-0">
                    <h3 className="font-display text-sm font-bold text-primary mb-1">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-surface-low border border-border-subtle shadow-xs space-y-3">
              <h3 className="font-display text-base font-bold text-primary tracking-tight">Sede y Atención Presencial</h3>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                <span>Av. Los Álamos 450. Frente al Parque Los Pinos.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">mail</span>
                <span>contacto@bibliotecacomunitaria.org</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">call</span>
                <span>(01) 482-9100</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
