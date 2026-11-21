import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Book, Loan, User, DashboardStats, AnalyticsData, MonthlyReportData } from '../types/index.js';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Skeleton, KpiCardSkeleton, TableSkeleton, ChartSkeleton } from '../components/Skeleton.js';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'stats' | 'reportes' | 'libros' | 'prestamos' | 'usuarios' | 'mensajes'>('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Estados de datos principales
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reporteMensual, setReporteMensual] = useState<MonthlyReportData | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('Noviembre 2026');
  const [libros, setLibros] = useState<Book[]>([]);
  const [prestamos, setPrestamos] = useState<Loan[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Filtros y búsquedas
  const [busquedaLibro, setBusquedaLibro] = useState('');
  const [filtroCategoriaLibro, setFiltroCategoriaLibro] = useState('todas');
  const [filtroPrestamo, setFiltroPrestamo] = useState('todos');
  const [busquedaPrestamo, setBusquedaPrestamo] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [filtroEstadoUsuario, setFiltroEstadoUsuario] = useState<'todos' | 'activos' | 'suspendidos'>('todos');

  // Modal Crear/Editar Libro
  const [modalLibroAbierto, setModalLibroAbierto] = useState(false);
  const [libroEditando, setLibroEditando] = useState<Book | null>(null);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [categorias, setCategorias] = useState('');
  const [formatos, setFormatos] = useState('impreso');
  const [copias, setCopias] = useState(1);
  const [estado, setEstado] = useState('DISPONIBLE');
  const [descripcion, setDescripcion] = useState('');
  const [portadaUrl, setPortadaUrl] = useState('');
  const [portadaArchivo, setPortadaArchivo] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [tipoPortada, setTipoPortada] = useState<'archivo' | 'url'>('archivo');
  const [guardandoLibro, setGuardandoLibro] = useState(false);

  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const [resStats, resAnalytics, resReport, resLibros, resPrestamos, resUsuarios, resMensajes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics'),
        api.get(`/admin/reports/monthly?mes=${encodeURIComponent(mesSeleccionado)}`),
        api.get('/libros?limit=100'),
        api.get('/prestamos'),
        api.get('/admin/usuarios'),
        api.get('/admin/contacto')
      ]);

      if (resStats.data.success) setStats(resStats.data.data);
      if (resAnalytics.data.success) setAnalytics(resAnalytics.data.data);
      if (resReport.data.success) setReporteMensual(resReport.data.data);
      if (resLibros.data.success) setLibros(resLibros.data.data);
      if (resPrestamos.data.success) setPrestamos(resPrestamos.data.data);
      if (resUsuarios.data.success) setUsuarios(resUsuarios.data.data);
      if (resMensajes.data.success) setMensajes(resMensajes.data.data);
    } catch (err) {
      console.error('Error al cargar datos administrativos:', err);
    } finally {
      setCargandoDatos(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      cargarDatos();
    }
  }, [isAdmin, mesSeleccionado]);

  if (isLoading) {
    return (
      <div className="admin-dashboard-layout">
        <aside className="admin-sidebar" style={{ width: '260px' }}>
          <div className="sidebar-top-brand">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1 flex flex-col gap-1.5 ml-3">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          </div>
          <div className="sidebar-nav gap-2.5 mt-4">
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
          <div className="sidebar-bottom-user mt-auto">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1 flex flex-col gap-1">
                <Skeleton className="w-24 h-3.5 rounded" />
                <Skeleton className="w-16 h-2.5 rounded" />
              </div>
            </div>
          </div>
        </aside>
        <main className="admin-main-viewport">
          <div className="dashboard-top-header">
            <div>
              <Skeleton className="w-64 h-8 rounded mb-2" />
              <Skeleton className="w-96 h-4 rounded" />
            </div>
            <Skeleton className="w-32 h-9 rounded-lg" />
          </div>
          <div className="kpi-cards-grid">
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartSkeleton height="320px" />
            <ChartSkeleton height="320px" />
          </div>
        </main>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Manejo de Modal de Libro
  const abrirModalNuevoLibro = () => {
    setLibroEditando(null);
    setTitulo('');
    setAutor('');
    setGenero('');
    setCategorias('novela, general');
    setFormatos('impreso');
    setCopias(1);
    setEstado('DISPONIBLE');
    setDescripcion('');
    setPortadaUrl('');
    setPortadaArchivo(null);
    setPreviewImagen(null);
    setTipoPortada('archivo');
    setModalLibroAbierto(true);
  };

  const abrirModalEditarLibro = (b: Book) => {
    setLibroEditando(b);
    setTitulo(b.titulo);
    setAutor(b.autor);
    setGenero(b.genero);
    setCategorias(b.categorias.join(', '));
    setFormatos(b.formatos.join(', '));
    setCopias(b.copias);
    setEstado(b.estado);
    setDescripcion(b.descripcion);
    setPortadaUrl(b.portada);
    setPortadaArchivo(null);
    setPreviewImagen(
      b.portada.startsWith('http')
        ? b.portada
        : b.portada.startsWith('/uploads')
        ? b.portada
        : `/img/${b.portada.replace(/^img\//, '')}`
    );
    setTipoPortada(b.portada.startsWith('http') ? 'url' : 'archivo');
    setModalLibroAbierto(true);
  };

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPortadaArchivo(file);
      setPreviewImagen(URL.createObjectURL(file));
    }
  };

  const handleGuardarLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoLibro(true);

    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('autor', autor);
      formData.append('genero', genero);
      formData.append('categorias', categorias);
      formData.append('formatos', formatos);
      formData.append('copias', copias.toString());
      formData.append('estado', estado);
      formData.append('descripcion', descripcion);

      if (tipoPortada === 'archivo' && portadaArchivo) {
        formData.append('portadaFile', portadaArchivo);
      } else if (portadaUrl) {
        formData.append('portada', portadaUrl);
      }

      if (libroEditando) {
        await api.put(`/libros/${libroEditando.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/libros', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalLibroAbierto(false);
      cargarDatos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el libro');
    } finally {
      setGuardandoLibro(false);
    }
  };

  const handleEliminarLibro = async (id: string, nombreLibro: string) => {
    if (confirm(`¿Estás seguro de eliminar "${nombreLibro}" del inventario?`)) {
      try {
        await api.delete(`/libros/${id}`);
        cargarDatos();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  // Operaciones de Préstamos
  const handleCambiarEstadoPrestamo = async (loanId: string, nuevoEstado: string) => {
    try {
      await api.patch(`/prestamos/${loanId}/estado`, { estado: nuevoEstado });
      cargarDatos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado del préstamo');
    }
  };

  // Operaciones de Usuarios
  const handleToggleEstadoUsuario = async (userId: string, estadoActual: boolean) => {
    try {
      await api.patch(`/admin/usuarios/${userId}/estado`, { activo: !estadoActual });
      cargarDatos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al modificar estado del vecino');
    }
  };

  // Exportar datos a CSV
  const handleExportarCSV = () => {
    if (!reporteMensual) return;
    const encabezados = ['ID Prestamo', 'Vecino', 'Carnet', 'Libro', 'Fecha Solicitud', 'Fecha Esperada', 'Estado'];
    const filas = reporteMensual.registrosPrestamos.map(p => [
      p.id,
      `"${p.user?.nombre || 'Anónimo'}"`,
      p.user?.carnet || '',
      `"${p.book?.titulo || ''}"`,
      new Date(p.fechaSolicitud).toLocaleDateString(),
      new Date(p.fechaDevolucionEsperada).toLocaleDateString(),
      p.estado
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [encabezados.join(','), ...filas.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `informe_prestamos_${mesSeleccionado.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImprimirReporte = () => {
    window.print();
  };

  // Filtros en memoria para libros
  const librosFiltrados = libros.filter(b => {
    const matchBusqueda =
      b.titulo.toLowerCase().includes(busquedaLibro.toLowerCase()) ||
      b.autor.toLowerCase().includes(busquedaLibro.toLowerCase()) ||
      b.genero.toLowerCase().includes(busquedaLibro.toLowerCase());
    const matchCategoria = filtroCategoriaLibro === 'todas' || b.categorias.includes(filtroCategoriaLibro);
    return matchBusqueda && matchCategoria;
  });

  // Filtros de préstamos con buscador
  const prestamosFiltrados = prestamos.filter(p => {
    const matchEstado = filtroPrestamo === 'todos' || p.estado === filtroPrestamo;
    const q = busquedaPrestamo.toLowerCase().trim();
    const matchBusqueda = !q ||
      (p.user?.nombre?.toLowerCase().includes(q) || false) ||
      (p.user?.carnet?.toLowerCase().includes(q) || false) ||
      (p.book?.titulo?.toLowerCase().includes(q) || false) ||
      (p.book?.autor?.toLowerCase().includes(q) || false);
    return matchEstado && matchBusqueda;
  });

  // Filtros de usuarios con estado
  const usuariosFiltrados = usuarios.filter(u => {
    const q = busquedaUsuario.toLowerCase().trim();
    const matchBusqueda = !q ||
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.carnet && u.carnet.toLowerCase().includes(q)) ||
      (u.dni && u.dni.includes(q));
    const matchEstado =
      filtroEstadoUsuario === 'todos' ||
      (filtroEstadoUsuario === 'activos' && u.activo) ||
      (filtroEstadoUsuario === 'suspendidos' && !u.activo);
    return matchBusqueda && matchEstado;
  });

  const CHART_COLORS = ['#003626', '#c48849', '#2b6e4e', '#1a4d3b', '#89bda6', '#e5a563', '#717974'];

  return (
    <div className="admin-dashboard-layout">
      {/* Barra Superior Móvil */}
      <div className="mobile-admin-bar">
        <button
          className="mobile-admin-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir navegación del panel"
        >
          <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
        <div className="mobile-admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '22px' }}>
            admin_panel_settings
          </span>
          <span>Panel Administrador</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button className="btn btn-primary btn-sm mobile-add-btn" onClick={abrirModalNuevoLibro}>
            + Libro
          </button>
          <button
            type="button"
            className="mobile-admin-menu-btn"
            style={{ color: '#dc2626' }}
            title="Cerrar sesión"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar de Navegación Lateral (Desktop y Drawer Móvil) */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'drawer-open' : ''}`}>
        <div className="sidebar-top-brand">
          {!sidebarCollapsed ? (
            <>
              <div className="sidebar-brand-link">
                <span className="material-symbols-outlined sidebar-brand-icon">local_library</span>
                <div className="sidebar-brand-text">
                  <h3 className="sidebar-brand-name">Biblioteca Comunitaria</h3>
                  <span className="sidebar-brand-sub">Gestión Central</span>
                </div>
              </div>
              <button
                className="sidebar-toggle-btn"
                onClick={() => setSidebarCollapsed(true)}
                title="Colapsar barra lateral"
                aria-label="Colapsar barra lateral"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </>
          ) : (
            <button
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(false)}
              title="Expandir barra lateral"
              aria-label="Expandir barra lateral"
            >
              <span className="material-symbols-outlined sidebar-brand-icon" style={{ fontSize: '20px', padding: '6px' }}>menu_open</span>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {!sidebarCollapsed && (
            <span className="sidebar-section-title">Principal & Reportes</span>
          )}
          <button
            className={`sidebar-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stats'); setMobileMenuOpen(false); }}
            title="Estadísticas & KPIs"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            {!sidebarCollapsed && <span>Estadísticas & KPIs</span>}
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reportes'); setMobileMenuOpen(false); }}
            title="Informes Mensuales"
          >
            <span className="material-symbols-outlined">description</span>
            {!sidebarCollapsed && <span>Informes Mensuales</span>}
          </button>

          {!sidebarCollapsed && (
            <span className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>Operaciones</span>
          )}
          <button
            className={`sidebar-nav-item ${activeTab === 'libros' ? 'active' : ''}`}
            onClick={() => { setActiveTab('libros'); setMobileMenuOpen(false); }}
            title={`Inventario Libros (${libros.length})`}
          >
            <span className="material-symbols-outlined">menu_book</span>
            {!sidebarCollapsed && (
              <>
                <span>Inventario Libros</span>
                <span className="sidebar-counter">{libros.length}</span>
              </>
            )}
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'prestamos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('prestamos'); setMobileMenuOpen(false); }}
            title={`Préstamos (${prestamos.length})`}
          >
            <span className="material-symbols-outlined">assignment_return</span>
            {!sidebarCollapsed && (
              <>
                <span>Préstamos</span>
                {stats && stats.prestamosPendientes > 0 && (
                  <span className="sidebar-counter alert-count">{stats.prestamosPendientes}</span>
                )}
              </>
            )}
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => { setActiveTab('usuarios'); setMobileMenuOpen(false); }}
            title={`Padrón de Vecinos (${usuarios.length})`}
          >
            <span className="material-symbols-outlined">groups</span>
            {!sidebarCollapsed && (
              <>
                <span>Padrón de Vecinos</span>
                <span className="sidebar-counter">{usuarios.length}</span>
              </>
            )}
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'mensajes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('mensajes'); setMobileMenuOpen(false); }}
            title={`Consultas (${mensajes.length})`}
          >
            <span className="material-symbols-outlined">mark_email_unread</span>
            {!sidebarCollapsed && (
              <>
                <span>Consultas</span>
                <span className="sidebar-counter">{mensajes.length}</span>
              </>
            )}
          </button>
        </nav>

        {/* Tarjeta de Administrador colocada en la parte inferior */}
        <div className="sidebar-bottom-user">
          <div
            className={`admin-user-row ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={user.email || user.nombre}
            style={sidebarCollapsed ? { justifyContent: 'center' } : undefined}
          >
            <div className="admin-avatar">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="admin-user-details">
                <strong className="admin-name">{user.email || user.nombre}</strong>
                <span className="admin-role-badge">Super Administrador</span>
              </div>
            )}
          </div>

          {/* Acciones del Administrador */}
          {!sidebarCollapsed ? (
            <div className="sidebar-user-actions">
              <Link to="/" className="sidebar-action-btn" title="Ir al portal público de la biblioteca">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
                <span>Ver Portal</span>
              </Link>
              <button
                type="button"
                className="sidebar-action-btn logout"
                title="Cerrar sesión de administrador"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem', alignItems: 'center', width: '100%' }}>
              <Link to="/" className="sidebar-toggle-btn" title="Ver portal público de biblioteca">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>storefront</span>
              </Link>
              <button
                type="button"
                className="sidebar-toggle-btn"
                title="Cerrar sesión"
                style={{ color: '#dc2626' }}
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop para cerrar el Drawer en móvil */}
      {mobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Área de Contenido Principal */}
      <main className="admin-main-viewport">
        {/* Top Header en Pantallas Medianas/Grandes */}
        <header className="dashboard-top-header">
          <div>
            <h1 className="viewport-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {activeTab === 'stats' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>dashboard</span>
                  <span>Panel Administrativo</span>
                </>
              )}
              {activeTab === 'reportes' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>description</span>
                  <span>Informes y Balances Mensuales</span>
                </>
              )}
              {activeTab === 'libros' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>menu_book</span>
                  <span>Gestión del Catálogo de Libros</span>
                </>
              )}
              {activeTab === 'prestamos' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>assignment_return</span>
                  <span>Control de Préstamos y Devoluciones</span>
                </>
              )}
              {activeTab === 'usuarios' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>groups</span>
                  <span>Padrón de Lectores Vecinales</span>
                </>
              )}
              {activeTab === 'mensajes' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>mark_email_unread</span>
                  <span>Bandeja de Consultas Recibidas</span>
                </>
              )}
            </h1>
          </div>
          <div className="top-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/"
              className="btn btn-outline btn-sm"
              title="Abrir vista pública de la biblioteca"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
              <span>Ver Portal</span>
            </Link>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fca5a5',
                cursor: 'pointer'
              }}
              title="Cerrar sesión"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* PESTAÑA 1: ESTADÍSTICAS Y GRÁFICOS VISUALES */}
        {/* ============================================================== */}
        {activeTab === 'stats' && (
          cargandoDatos ? (
            <div className="tab-pane-fade flex flex-col gap-6">
              <div className="kpi-cards-grid">
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </div>
              <div className="charts-main-grid">
                <ChartSkeleton height="350px" />
                <ChartSkeleton height="350px" />
              </div>
              <TableSkeleton rows={4} columns={5} />
            </div>
          ) : (
            <div className="tab-pane-fade">
            {/* Tarjetas KPI Superiores */}
            <div className="kpi-cards-grid">
              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ backgroundColor: 'var(--surface-container)' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>auto_stories</span>
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Títulos Catalogados</span>
                  <strong className="kpi-value">{stats?.totalLibros || libros.length}</strong>
                  <span className="kpi-trend positive">↑ {stats?.totalCopias || 28} ejemplares físicos</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ backgroundColor: '#e6f4ea' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--status-available)' }}>assignment_turned_in</span>
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Préstamos Activos</span>
                  <strong className="kpi-value">{stats?.prestamosActivos || 0}</strong>
                  <span className="kpi-trend positive">En manos de vecinos</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ backgroundColor: '#fef3c7' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--status-borrowed)' }}>pending_actions</span>
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Solicitudes Pendientes</span>
                  <strong className="kpi-value">{stats?.prestamosPendientes || 0}</strong>
                  <span className="kpi-trend warning">Por entregar en sala</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-icon-wrap" style={{ backgroundColor: '#e0f2fe' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--status-reserved)' }}>verified_user</span>
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Tasa de Devolución</span>
                  <strong className="kpi-value">{analytics?.kpis.tasaCumplimiento || 97}%</strong>
                  <span className="kpi-trend positive">Cumplimiento en plazo</span>
                </div>
              </div>
            </div>

            {/* Fila de Gráficos Principales */}
            <div className="charts-main-grid">
              {/* Gráfico 1: Evolución Mensual de Préstamos */}
              <div className="chart-box card">
                <div className="chart-box-header">
                  <div>
                    <h3 className="chart-box-title">Evolución de Préstamos y Devoluciones</h3>
                    <p className="chart-box-sub">Flujo de circulación de libros en el último semestre</p>
                  </div>
                  <span className="badge badge-disponible">Actividad 2026</span>
                </div>
                <div className="chart-canvas-wrapper">
                  {analytics && (
                    <ResponsiveContainer width="100%" height={290}>
                      <AreaChart data={analytics.monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#003626" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#003626" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="colorDevueltos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c48849" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#c48849" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4db" />
                        <XAxis dataKey="mes" stroke="#717974" fontSize={12} />
                        <YAxis stroke="#717974" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            border: '1px solid #c0c9c2',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                        <Area
                          type="monotone"
                          dataKey="prestamos"
                          name="Libros Prestados"
                          stroke="#003626"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorPrestamos)"
                        />
                        <Area
                          type="monotone"
                          dataKey="devoluciones"
                          name="Devoluciones"
                          stroke="#c48849"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorDevueltos)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Gráfico 2: Distribución por Género/Categoría */}
              <div className="chart-box card">
                <div className="chart-box-header">
                  <div>
                    <h3 className="chart-box-title">Distribución por Categorías</h3>
                    <p className="chart-box-sub">Títulos en el acervo bibliográfico</p>
                  </div>
                  <span className="badge badge-sala">Fondos</span>
                </div>
                <div className="category-chart-container">
                  {analytics && (
                    <>
                      <div className="category-pie-wrapper">
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={analytics.categoryDistribution}
                              dataKey="libros"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={48}
                              outerRadius={78}
                              paddingAngle={4}
                            >
                              {analytics.categoryDistribution.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any, name: any) => [`${value} libros`, name]}
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '10px',
                                border: '1px solid #c0c9c2',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="category-legend-grid">
                        {analytics.categoryDistribution.map((cat, idx) => {
                          const totalLibros = analytics.categoryDistribution.reduce((acc, c) => acc + c.libros, 0);
                          const pct = totalLibros > 0 ? Math.round((cat.libros / totalLibros) * 100) : 0;
                          return (
                            <div key={cat.name} className="cat-legend-item">
                              <span
                                className="cat-legend-dot"
                                style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                              />
                              <span className="cat-legend-name">{cat.name}</span>
                              <span className="cat-legend-pct">{pct}%</span>
                              <span className="cat-legend-count">({cat.libros})</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ranking de Libros Más Leídos y Métricas Operativas */}
            <div className="stats-bottom-grid">
              <div className="card rank-box">
                <div className="chart-box-header">
                  <h3 className="chart-box-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--tertiary)' }}>trophy</span>
                    <span>Top 5 Obras Más Solicitadas</span>
                  </h3>
                  <span className="badge badge-novedad">Mayor Impacto</span>
                </div>
                <div className="rank-list">
                  {analytics?.topBooks.map((b, idx) => (
                    <div key={b.id} className="rank-item">
                      <span className="rank-number">0{idx + 1}</span>
                      <div className="rank-details">
                        <strong className="rank-title">{b.titulo}</strong>
                        <span className="rank-author">{b.autor}</span>
                        <div className="rank-bar-bg">
                          <div
                            className="rank-bar-fill"
                            style={{ width: `${Math.min(100, (b.lectores / 50) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="rank-count">
                        <strong>{b.lectores}</strong>
                        <span>lectores</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card indicators-box">
                <div className="chart-box-header">
                  <h3 className="chart-box-title">Métricas de Rendimiento del Servicio</h3>
                </div>
                <div className="indicators-list">
                  <div className="indicator-row">
                    <span className="indicator-name">Tiempo promedio de préstamo:</span>
                    <strong>13.5 días (dentro del límite de 14)</strong>
                  </div>
                  <div className="indicator-row">
                    <span className="indicator-name">Promedio de lecturas por vecino:</span>
                    <strong>3.4 obras anuales</strong>
                  </div>
                  <div className="indicator-row">
                    <span className="indicator-name">Género más demandado:</span>
                    <strong style={{ color: 'var(--primary)' }}>Novela y Realismo Mágico</strong>
                  </div>
                  <div className="indicator-row">
                    <span className="indicator-name">Asistencia a talleres botánicos:</span>
                    <strong style={{ color: 'var(--status-available)' }}>88% de cupos cubiertos</strong>
                  </div>
                  <div className="indicator-row">
                    <span className="indicator-name">Libros con retraso de entrega:</span>
                    <strong>0 ejemplares (100% regularizados)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 2: INFORMES MENSUALES FORMALES */}
        {/* ============================================================== */}
        {activeTab === 'reportes' && (
          cargandoDatos ? (
            <div className="tab-pane-fade flex flex-col gap-6">
              <div className="kpi-cards-grid">
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </div>
              <ChartSkeleton height="350px" />
              <TableSkeleton rows={6} columns={6} />
            </div>
          ) : (
            <div className="tab-pane-fade printable-report-section">
            {/* Controles de Selección y Exportación */}
            <div className="report-controls-bar no-print">
              <div className="report-period-selector">
                <label htmlFor="selectMes"><strong>Periodo del Informe:</strong></label>
                <select
                  id="selectMes"
                  className="form-select toolbar-select"
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                >
                  <option value="Noviembre 2026">Noviembre 2026 (Mes Actual)</option>
                  <option value="Octubre 2026">Octubre 2026</option>
                  <option value="Septiembre 2026">Septiembre 2026</option>
                  <option value="Agosto 2026">Agosto 2026</option>
                </select>
              </div>

              <div className="report-action-buttons">
                <button className="btn btn-outline btn-sm" onClick={handleExportarCSV}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                  Descargar CSV
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleImprimirReporte}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
                  Imprimir / Guardar PDF
                </button>
              </div>
            </div>

            {/* Hoja Membretada del Informe Mensual */}
            {reporteMensual && (
              <div className="monthly-report-sheet card">
                {/* Encabezado Institucional */}
                <div className="report-letterhead">
                  <div className="report-brand">
                    <span className="material-symbols-outlined brand-seal">local_library</span>
                    <div>
                      <h2>Biblioteca Comunitaria «Leer nos une»</h2>
                      <p>Sede Central — Biblioteca Comunitaria</p>
                    </div>
                  </div>
                  <div className="report-meta-doc">
                    <span className="doc-code">INF-MES-{mesSeleccionado.slice(0, 3).toUpperCase()}-2026</span>
                    <span className="doc-date">Fecha de emisión: {reporteMensual.generadoEl}</span>
                  </div>
                </div>

                <div className="report-divider" />

                <h3 className="report-doc-title">
                  INFORME MENSUAL DE CIRCULACIÓN BIBLIOTECARIA Y GESTIÓN VECINAL
                </h3>
                <p className="report-doc-period">
                  Correspondiente al periodo mensual: <strong>{reporteMensual.periodo}</strong>
                </p>

                {/* Resumen Ejecutivo */}
                <div className="report-executive-summary">
                  <h4>1. Resumen Ejecutivo del Periodo</h4>
                  <p>
                    Durante el mes de {reporteMensual.periodo}, la biblioteca comunitaria mantuvo sus servicios
                    de préstamo domiciliario y salas de lectura presencial con un alto índice de satisfacción y rotación
                    de acervo bibliográfico.
                  </p>

                  <div className="summary-numbers-grid">
                    <div className="summary-box">
                      <span className="sum-val">{reporteMensual.resumen.prestamosTotalesMes}</span>
                      <span className="sum-lbl">Préstamos Totales Procesados</span>
                    </div>
                    <div className="summary-box">
                      <span className="sum-val">{reporteMensual.resumen.librosDevueltosConExito}</span>
                      <span className="sum-lbl">Libros Devueltos en Buen Estado</span>
                    </div>
                    <div className="summary-box">
                      <span className="sum-val">{reporteMensual.resumen.nuevosLectoresInscritos}</span>
                      <span className="sum-lbl">Nuevos Carnets Vecinales</span>
                    </div>
                    <div className="summary-box">
                      <span className="sum-val" style={{ color: 'var(--status-available)' }}>
                        {reporteMensual.resumen.tasaEfectividad}
                      </span>
                      <span className="sum-lbl">Tasa de Devolución a Tiempo</span>
                    </div>
                  </div>
                </div>

                {/* Obras Destacadas en el Mes */}
                <div className="report-section-block">
                  <h4>2. Títulos de Mayor Demanda en el Periodo</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Título de la Obra</th>
                        <th>Autor / Responsabilidad</th>
                        <th>Préstamos Registrados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteMensual.librosDestacadosMes.map((l, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{l.titulo}</strong></td>
                          <td>{l.autor}</td>
                          <td><strong>{l.prestamos}</strong> salidas</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Detalle de Préstamos del Mes */}
                <div className="report-section-block">
                  <h4>3. Registro de Movimientos de Préstamo</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Vecino</th>
                        <th>Carnet</th>
                        <th>Libro</th>
                        <th>Fecha Salida</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteMensual.registrosPrestamos.slice(0, 10).map((p) => (
                        <tr key={p.id}>
                          <td>{p.user?.nombre}</td>
                          <td><code>{p.user?.carnet}</code></td>
                          <td>{p.book?.titulo}</td>
                          <td>{new Date(p.fechaSolicitud).toLocaleDateString()}</td>
                          <td>{new Date(p.fechaDevolucionEsperada).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge badge-${p.estado.toLowerCase()}`}>
                              {p.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reporteMensual.registrosPrestamos.length > 10 && (
                    <p className="table-caption">
                      * Mostrando los 10 primeros registros. Para el padrón completo use el botón Descargar CSV.
                    </p>
                  )}
                </div>

                {/* Firmas de Conformidad */}
                <div className="report-signatures">
                  <div className="signature-box">
                    <div className="sig-line" />
                    <strong>{user.nombre}</strong>
                    <span>Administrador General de Biblioteca</span>
                  </div>
                  <div className="signature-box">
                    <div className="sig-line" />
                    <strong>Coordinación Vecinal</strong>
                    <span>Comité de Vecinos «Leer nos une»</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          )
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 3: GESTIÓN DE LIBROS (INVENTARIO CRUD) */}
        {/* ============================================================== */}
        {activeTab === 'libros' && (
          cargandoDatos ? (
            <div className="tab-pane-fade">
              <TableSkeleton rows={8} columns={7} />
            </div>
          ) : (
            <div className="tab-pane-fade">
            {/* Barra de Filtros y Búsqueda */}
            <div className="catalog-admin-controls card">
              <div className="search-box-admin">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Buscar libro por título, autor o género..."
                  value={busquedaLibro}
                  onChange={(e) => setBusquedaLibro(e.target.value)}
                />
                {busquedaLibro && (
                  <button className="clear-filter-btn" onClick={() => setBusquedaLibro('')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              <div className="filter-group-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  className="form-select toolbar-select"
                  value={filtroCategoriaLibro}
                  onChange={(e) => setFiltroCategoriaLibro(e.target.value)}
                  style={{ width: 'auto', minWidth: '200px' }}
                >
                  <option value="todas">Todas las categorías</option>
                  <option value="novela">Novela</option>
                  <option value="clasicos">Clásicos</option>
                  <option value="filosofia">Filosofía</option>
                  <option value="infantil">Infantil</option>
                  <option value="poesia">Poesía</option>
                  <option value="psicoanalisis">Psicoanálisis</option>
                </select>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={abrirModalNuevoLibro}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                  <span>Nuevo Libro</span>
                </button>
              </div>
            </div>

            {/* Vista Tabla Adaptativa Desktop & Card en Móvil */}
            <div className="table-card-wrapper card">
              <div className="table-responsive">
                <table className="admin-table enhanced-table">
                  <thead>
                    <tr>
                      <th>Portada</th>
                      <th>Título y Autor</th>
                      <th>Categorías</th>
                      <th>Copias</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {librosFiltrados.map((b) => {
                      const portadaSrc = b.portada.startsWith('http')
                        ? b.portada
                        : b.portada.startsWith('/uploads')
                        ? b.portada
                        : `/img/${b.portada.replace(/^img\//, '')}`;

                      return (
                        <tr key={b.id}>
                          <td>
                            <img
                              src={portadaSrc}
                              alt={b.titulo}
                              className="admin-book-thumb"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
                              }}
                            />
                          </td>
                          <td>
                            <strong className="book-row-title">{b.titulo}</strong>
                            <span className="book-row-author">{b.autor}</span>
                            <span className="book-row-genre">{b.genero}</span>
                          </td>
                          <td>
                            <div className="cat-tags-wrap">
                              {b.categorias.map((c, i) => (
                                <span key={i} className="mini-cat-tag">#{c}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong className="copies-badge">{b.copias}</strong>
                          </td>
                          <td>
                            <span className={`badge badge-${b.estado.toLowerCase()}`}>
                              {b.estado}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons-cell">
                              <button
                                className="btn btn-outline btn-sm action-icon-btn"
                                onClick={() => abrirModalEditarLibro(b)}
                                title="Editar libro"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>edit</span>
                              </button>
                              <button
                                className="btn btn-secondary btn-sm action-icon-btn delete-btn"
                                onClick={() => handleEliminarLibro(b.id, b.titulo)}
                                title="Eliminar del catálogo"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 4: PRÉSTAMOS Y DEVOLUCIONES (DISEÑO PROFESIONAL) */}
        {/* ============================================================== */}
        {activeTab === 'prestamos' && (
          cargandoDatos ? (
            <div className="tab-pane-fade">
              <TableSkeleton rows={8} columns={6} />
            </div>
          ) : (
            <div className="tab-pane-fade">
            <div className="catalog-admin-controls card">
              <div className="search-box-admin" style={{ flex: '1 1 300px' }}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Buscar por vecino, carnet o título del libro..."
                  value={busquedaPrestamo}
                  onChange={(e) => setBusquedaPrestamo(e.target.value)}
                />
                {busquedaPrestamo && (
                  <button className="clear-filter-btn" onClick={() => setBusquedaPrestamo('')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              <div className="filter-group-admin">
                <div className="state-pills-bar">
                  <button
                    className={`state-pill ${filtroPrestamo === 'todos' ? 'active' : ''}`}
                    onClick={() => setFiltroPrestamo('todos')}
                  >
                    Todos ({prestamos.length})
                  </button>
                  <button
                    className={`state-pill ${filtroPrestamo === 'PENDIENTE' ? 'active' : ''}`}
                    onClick={() => setFiltroPrestamo('PENDIENTE')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>hourglass_empty</span>
                    <span>Pendientes ({prestamos.filter(p => p.estado === 'PENDIENTE').length})</span>
                  </button>
                  <button
                    className={`state-pill ${filtroPrestamo === 'ACTIVO' ? 'active' : ''}`}
                    onClick={() => setFiltroPrestamo('ACTIVO')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>menu_book</span>
                    <span>En Curso ({prestamos.filter(p => p.estado === 'ACTIVO').length})</span>
                  </button>
                  <button
                    className={`state-pill ${filtroPrestamo === 'DEVUELTO' ? 'active' : ''}`}
                    onClick={() => setFiltroPrestamo('DEVUELTO')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>check_circle</span>
                    <span>Devueltos ({prestamos.filter(p => p.estado === 'DEVUELTO').length})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="table-card-wrapper card">
              <div className="table-responsive">
                <table className="admin-table enhanced-table">
                  <thead>
                    <tr>
                      <th style={{ width: '28%' }}>Lector Vecinal</th>
                      <th style={{ width: '32%' }}>Libro Solicitado</th>
                      <th style={{ width: '18%' }}>Cronograma</th>
                      <th style={{ width: '10%' }}>Estado</th>
                      <th style={{ width: '12%', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-table-cell">
                          <span className="material-symbols-outlined">assignment_late</span>
                          <p>No se encontraron préstamos con los criterios seleccionados.</p>
                        </td>
                      </tr>
                    ) : (
                      prestamosFiltrados.map((p) => {
                        const bookCover = p.book?.portada?.startsWith('http')
                          ? p.book.portada
                          : p.book?.portada?.startsWith('/uploads')
                          ? p.book.portada
                          : `/img/${p.book?.portada?.replace(/^img\//, '') || 'portada-el-principito.jpg'}`;

                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="table-user-cell">
                                <div className="table-user-avatar">
                                  {p.user?.nombre ? p.user.nombre.charAt(0).toUpperCase() : 'V'}
                                </div>
                                <div className="table-user-info">
                                  <strong className="user-cell-name">{p.user?.nombre || 'Vecino'}</strong>
                                  <div className="user-cell-sub">
                                    <span className="badge badge-sala mini-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>badge</span>
                                      <span>{p.user?.carnet || 'S/C'}</span>
                                    </span>
                                    {p.user?.telefono && (
                                      <span className="user-cell-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>call</span>
                                        <span>{p.user.telefono}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="table-book-cell">
                                <img
                                  src={bookCover}
                                  alt={p.book?.titulo}
                                  className="table-book-thumb"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/img/portada-el-principito.jpg';
                                  }}
                                />
                                <div className="table-book-info">
                                  <strong className="book-cell-title">{p.book?.titulo}</strong>
                                  <span className="book-cell-author">{p.book?.autor}</span>
                                  {p.book?.genero && (
                                    <span className="mini-cat-tag">{p.book.genero}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="table-dates-cell">
                                <div className="date-row">
                                  <span className="date-lbl">Pedido:</span>
                                  <span className="date-val">{new Date(p.fechaSolicitud).toLocaleDateString()}</span>
                                </div>
                                <div className="date-row">
                                  <span className="date-lbl">Vence:</span>
                                  <span className="date-val highlight">{new Date(p.fechaDevolucionEsperada).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="status-cell-wrapper">
                                <span className={`badge badge-${p.estado.toLowerCase()} status-pill-dot`}>
                                  <span className="status-dot" />
                                  {p.estado === 'PENDIENTE' ? 'Pendiente' : p.estado === 'ACTIVO' ? 'En préstamo' : p.estado === 'DEVUELTO' ? 'Devuelto' : 'Rechazado'}
                                </span>
                              </div>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                                {p.estado === 'PENDIENTE' && (
                                  <>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleCambiarEstadoPrestamo(p.id, 'ACTIVO')}
                                      title="Aprobar y entregar libro físico"
                                    >
                                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                                      Entregar
                                    </button>
                                    <button
                                      className="btn btn-outline btn-sm delete-btn"
                                      onClick={() => handleCambiarEstadoPrestamo(p.id, 'RECHAZADO')}
                                      title="Rechazar solicitud"
                                    >
                                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                                    </button>
                                  </>
                                )}
                                {p.estado === 'ACTIVO' && (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleCambiarEstadoPrestamo(p.id, 'DEVUELTO')}
                                    title="Registrar devolución en sala y restaurar ejemplar"
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment_returned</span>
                                    Recibir
                                  </button>
                                )}
                                {p.estado === 'DEVUELTO' && (
                                  <span className="completed-tag">
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                                    Completado
                                  </span>
                                )}
                                {p.estado === 'RECHAZADO' && (
                                  <span className="rejected-tag">
                                    Denegado
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 5: PADRÓN DE VECINOS (DISEÑO PROFESIONAL) */}
        {/* ============================================================== */}
        {activeTab === 'usuarios' && (
          cargandoDatos ? (
            <div className="tab-pane-fade">
              <TableSkeleton rows={8} columns={6} />
            </div>
          ) : (
            <div className="tab-pane-fade">
            <div className="catalog-admin-controls card">
              <div className="search-box-admin" style={{ flex: '1 1 350px' }}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Buscar vecino por nombre, carnet, DNI o email..."
                  value={busquedaUsuario}
                  onChange={(e) => setBusquedaUsuario(e.target.value)}
                />
                {busquedaUsuario && (
                  <button className="clear-filter-btn" onClick={() => setBusquedaUsuario('')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              <div className="filter-group-admin">
                <div className="state-pills-bar">
                  <button
                    className={`state-pill ${filtroEstadoUsuario === 'todos' ? 'active' : ''}`}
                    onClick={() => setFiltroEstadoUsuario('todos')}
                  >
                    Todos ({usuarios.length})
                  </button>
                  <button
                    className={`state-pill ${filtroEstadoUsuario === 'activos' ? 'active' : ''}`}
                    onClick={() => setFiltroEstadoUsuario('activos')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#16a34a' }}>check_circle</span>
                    <span>Activos ({usuarios.filter(u => u.activo).length})</span>
                  </button>
                  <button
                    className={`state-pill ${filtroEstadoUsuario === 'suspendidos' ? 'active' : ''}`}
                    onClick={() => setFiltroEstadoUsuario('suspendidos')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#9ca3af' }}>pause_circle</span>
                    <span>Suspendidos ({usuarios.filter(u => !u.activo).length})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="table-card-wrapper card">
              <div className="table-responsive">
                <table className="admin-table enhanced-table">
                  <thead>
                    <tr>
                      <th style={{ width: '24%' }}>Lector Vecinal</th>
                      <th style={{ width: '15%' }}>Credencial Digital</th>
                      <th style={{ width: '10%' }}>DNI</th>
                      <th style={{ width: '23%' }}>Contacto & Dirección</th>
                      <th style={{ width: '8%' }}>Rol</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Estado & Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-table-cell">
                          <span className="material-symbols-outlined">person_search</span>
                          <p>No se encontraron vecinos registrados con ese criterio de búsqueda.</p>
                        </td>
                      </tr>
                    ) : (
                      usuariosFiltrados.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="table-user-cell">
                              <div className="table-user-avatar member-avatar">
                                {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="table-user-info">
                                <strong className="user-cell-name">{u.nombre}</strong>
                                <span className="user-cell-email">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="credential-badge-box">
                              <span className="badge badge-sala credential-pill">
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>badge</span>
                                <code>{u.carnet || 'SIN CARNET'}</code>
                              </span>
                            </div>
                          </td>

                          <td>
                            <span className="dni-tag">
                              {u.dni || 'Sin DNI'}
                            </span>
                          </td>

                          <td>
                            <div className="contact-details-box">
                              <div className="contact-item">
                                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--tertiary)' }}>location_on</span>
                                <span className="contact-text" title={u.direccion || 'Sin dirección'}>
                                  {u.direccion || 'Sin dirección'}
                                </span>
                              </div>
                              <div className="contact-item">
                                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--status-available)' }}>call</span>
                                <span className="contact-text">
                                  {u.telefono || 'Sin teléfono'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`badge ${u.rol === 'ADMIN' ? 'badge-novedad' : 'badge-disponible'} mini-pill`}>
                              {u.rol}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                              <span className={`badge ${u.activo ? 'badge-disponible' : 'badge-prestamo'} status-pill-dot`}>
                                <span className="status-dot" />
                                {u.activo ? 'Activo' : 'Pausado'}
                              </span>
                              <button
                                className={`btn btn-sm ${u.activo ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => handleToggleEstadoUsuario(u.id, u.activo)}
                                title={u.activo ? 'Suspender acceso temporalmente' : 'Reactivar carnet'}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                  {u.activo ? 'pause_circle' : 'play_circle'}
                                </span>
                                {u.activo ? 'Pausar' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 6: MENSAJES Y CONSULTAS */}
        {/* ============================================================== */}
        {activeTab === 'mensajes' && (
          cargandoDatos ? (
            <div className="tab-pane-fade">
              <TableSkeleton rows={6} columns={5} />
            </div>
          ) : (
            <div className="tab-pane-fade">
            <div className="messages-stream">
              {mensajes.length === 0 ? (
                <div className="card empty-msg-box">
                  <span className="material-symbols-outlined">mail</span>
                  <h3>No hay consultas registradas</h3>
                  <p>Los mensajes enviados desde el formulario de contacto aparecerán aquí.</p>
                </div>
              ) : (
                mensajes.map((m) => (
                  <div key={m.id} className="card message-detail-card">
                    <div className="msg-card-top">
                      <div>
                        <strong className="msg-sender">{m.nombre}</strong>
                        <span className="msg-email">{m.correo}</span>
                      </div>
                      <span className="msg-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="msg-subject">Asunto: {m.asunto}</span>
                    <p className="msg-body">{m.mensaje}</p>
                    <div className="msg-actions">
                      <a href={`mailto:${m.correo}?subject=Respuesta a: ${m.asunto}`} className="btn btn-outline btn-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>reply</span>
                        Responder por Correo
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          )
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL CREAR / EDITAR LIBRO */}
      {/* ============================================================== */}
      {modalLibroAbierto && (
        <div className="modal-overlay" onClick={() => setModalLibroAbierto(false)}>
          <div className="modal-content modal-edit-book" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalLibroAbierto(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2>{libroEditando ? 'Editar Ejemplar' : 'Agregar Nuevo Libro al Catálogo'}</h2>
            <p className="subtext" style={{ marginBottom: '1.25rem' }}>
              Registra los datos bibliográficos. Puedes subir una imagen desde tu equipo o ingresar una URL externa.
            </p>

            <form onSubmit={handleGuardarLibro}>
              <div className="form-group">
                <label className="form-label" htmlFor="tituloLibro">Título del Libro *</label>
                <input
                  id="tituloLibro"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Cien años de soledad"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="autorLibro">Autor / Creador *</label>
                  <input
                    id="autorLibro"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej. Gabriel García Márquez"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="generoLibro">Género Literario *</label>
                  <input
                    id="generoLibro"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej. Realismo Mágico, Filosofía"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="categoriasLibro">Categorías (separadas por comas)</label>
                  <input
                    id="categoriasLibro"
                    type="text"
                    className="form-input"
                    placeholder="novela, clasicos, historia"
                    value={categorias}
                    onChange={(e) => setCategorias(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="copiasLibro">Copias Disponibles</label>
                  <input
                    id="copiasLibro"
                    type="number"
                    min={0}
                    className="form-input"
                    value={copias}
                    onChange={(e) => setCopias(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="estadoLibro">Estado del Libro</label>
                <select
                  id="estadoLibro"
                  className="form-select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="DISPONIBLE">Disponible para préstamo a domicilio</option>
                  <option value="SALA">Solo lectura en sala botánica</option>
                  <option value="NOVEDAD">Novedad destacada</option>
                  <option value="PRESTAMO">En préstamo</option>
                </select>
              </div>

              {/* Selector Dual de Portada: Archivo Local o URL */}
              <div className="form-group cover-selector-group">
                <label className="form-label">Portada del Libro:</label>
                <div className="cover-tabs">
                  <button
                    type="button"
                    className={`btn btn-sm ${tipoPortada === 'archivo' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setTipoPortada('archivo')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                    <span>Subir Imagen Local</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${tipoPortada === 'url' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setTipoPortada('url')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>link</span>
                    <span>Enlace Web (URL)</span>
                  </button>
                </div>

                {tipoPortada === 'archivo' ? (
                  <div className="upload-input-box">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="form-input"
                      onChange={handleSeleccionarArchivo}
                    />
                    <span className="subtext">Formatos permitidos: JPG, PNG, WEBP (máx. 5MB)</span>
                  </div>
                ) : (
                  <div className="url-input-box">
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://ejemplo.com/portada.jpg"
                      value={portadaUrl}
                      onChange={(e) => {
                        setPortadaUrl(e.target.value);
                        setPreviewImagen(e.target.value);
                      }}
                    />
                  </div>
                )}

                {previewImagen && (
                  <div className="preview-image-wrap">
                    <span className="preview-label">Vista Previa de la Portada:</span>
                    <img src={previewImagen} alt="Previsualización" className="preview-img-thumb" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="descLibro">Descripción / Sinopsis</label>
                <textarea
                  id="descLibro"
                  rows={3}
                  className="form-textarea"
                  placeholder="Resumen o sinopsis del libro..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={guardandoLibro}
              >
                <span className="material-symbols-outlined">save</span>
                {guardandoLibro ? 'Guardando en Base de Datos...' : 'Guardar Ejemplar'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
