export type Role = 'ADMIN' | 'VECINO';
export type BookStatus = 'DISPONIBLE' | 'SALA' | 'NOVEDAD' | 'PRESTAMO';
export type LoanStatus = 'PENDIENTE' | 'ACTIVO' | 'DEVUELTO' | 'RECHAZADO';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  carnet: string | null;
  dni?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  activo: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  icono: string;
  categorias: string[];
  formatos: string[];
  estado: BookStatus;
  copias: number;
  nota: number;
  lectores: number;
  descripcion: string;
  portada: string;
  destacado: boolean;
  createdAt?: string;
}

export interface Loan {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    email: string;
    carnet: string | null;
    telefono?: string | null;
  };
  bookId: string;
  book: {
    id: string;
    titulo: string;
    autor: string;
    portada: string;
    genero?: string;
  };
  fechaSolicitud: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal?: string | null;
  estado: LoanStatus;
  notas?: string | null;
}

export interface Activity {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  cuposTotales: number;
  cuposDisponibles: number;
  inscritos: number;
  categoria: string;
  descripcion: string;
  icono: string;
  estaInscrito?: boolean;
}

export interface DashboardStats {
  totalLibros: number;
  totalUsuarios: number;
  totalCopias: number;
  prestamosActivos: number;
  prestamosPendientes: number;
  prestamosDevueltos: number;
  mensajesPendientes: number;
  recentLoans: Loan[];
}

export interface MonthlyStat {
  mes: string;
  prestamos: number;
  devoluciones: number;
  nuevosVecinos: number;
}

export interface CategoryDistribution {
  name: string;
  libros: number;
  lectores: number;
}

export interface AnalyticsData {
  monthlyStats: MonthlyStat[];
  categoryDistribution: CategoryDistribution[];
  topBooks: {
    id: string;
    titulo: string;
    autor: string;
    lectores: number;
    copias: number;
    nota: number;
    portada: string;
  }[];
  kpis: {
    tasaCumplimiento: number;
    tiempoPromedioPrestamoDias: number;
    promedioLecturasPorVecino: number;
    generoPreferido: string;
    participacionTalleresPct: number;
  };
}

export interface MonthlyReportData {
  periodo: string;
  generadoEl: string;
  resumen: {
    prestamosTotalesMes: number;
    librosDevueltosConExito: number;
    solicitudesPendientesRevision: number;
    nuevosLectoresInscritos: number;
    tasaEfectividad: string;
    totalFondosPerdidosOMultas: string;
    espacioMasUtilizado: string;
  };
  categoriaLider: string;
  librosDestacadosMes: {
    titulo: string;
    autor: string;
    prestamos: number;
  }[];
  registrosPrestamos: Loan[];
}
