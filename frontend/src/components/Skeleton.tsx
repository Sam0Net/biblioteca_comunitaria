import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Primitiva base de Esqueleto con animación de barrido (shimmer) acelerada por GPU.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style, ...props }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Esqueleto para Tarjeta de Libro (Catálogo y Home)
 */
export const BookCardSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 mb-3.5 bg-white border border-border-subtle animate-fade-in">
        <div className="w-full sm:w-24 h-48 sm:h-32 rounded-lg skeleton-shimmer shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5 w-full">
          <div className="flex gap-2">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-16 h-5" />
          </div>
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-full h-10 rounded" />
          <div className="flex gap-4 mt-1">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
        <Skeleton className="w-24 h-8 rounded-lg shrink-0 hidden sm:block" />
      </div>
    );
  }

  return (
    <div className="card flex flex-col h-full bg-white border border-border-subtle overflow-hidden animate-fade-in">
      {/* Portada proporcional de libro */}
      <div className="relative w-full pt-[142%] skeleton-shimmer border-b border-border-subtle/50">
        <div className="absolute top-2.5 right-2.5">
          <Skeleton className="w-20 h-5 rounded-full bg-white/70" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Skeleton className="w-16 h-3 rounded" />
        <Skeleton className="w-4/5 h-5 rounded" />
        <Skeleton className="w-1/2 h-4 rounded mb-2" />
        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
          <Skeleton className="w-14 h-3.5 rounded" />
          <Skeleton className="w-16 h-3.5 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Esqueleto para Tarjetas KPI del Dashboard
 */
export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="kpi-card card bg-white border border-border-subtle p-5 animate-fade-in">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <Skeleton className="w-28 h-3 rounded" />
        <Skeleton className="w-16 h-7 rounded font-display" />
        <Skeleton className="w-24 h-3 rounded" />
      </div>
    </div>
  );
};

/**
 * Esqueleto para Filas de Tablas Administrativas (Préstamos, Inventario, Vecinos, Mensajes)
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-border-subtle shadow-xs animate-fade-in">
      {/* Cabecera simulada */}
      <div className="p-4 border-b border-border-subtle bg-[#fbf9f4] flex gap-4 items-center">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`head-${i}`} className="h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Filas simuladas */}
      <div className="divide-y divide-border-subtle/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="p-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={`cell-${r}-${c}`}
                className={`h-4.5 rounded ${c === 0 ? 'w-10 h-10 rounded-lg shrink-0' : 'flex-1'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Esqueleto para Contenedores de Gráficos (Analytics y Reportes)
 */
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '320px' }) => {
  return (
    <div className="card p-6 bg-white border border-border-subtle flex flex-col gap-4 animate-fade-in" style={{ minHeight: height }}>
      <div className="flex justify-between items-center">
        <Skeleton className="w-48 h-5 rounded" />
        <Skeleton className="w-24 h-4 rounded" />
      </div>
      <div className="flex-1 flex items-end gap-3 pt-6 pb-2 px-4 border-b border-l border-border-subtle/80">
        <Skeleton className="flex-1 h-3/5 rounded-t" />
        <Skeleton className="flex-1 h-4/5 rounded-t" />
        <Skeleton className="flex-1 h-2/5 rounded-t" />
        <Skeleton className="flex-1 h-5/6 rounded-t" />
        <Skeleton className="flex-1 h-1/2 rounded-t" />
        <Skeleton className="flex-1 h-3/4 rounded-t" />
      </div>
      <div className="flex justify-between px-4">
        <Skeleton className="w-8 h-3 rounded" />
        <Skeleton className="w-8 h-3 rounded" />
        <Skeleton className="w-8 h-3 rounded" />
        <Skeleton className="w-8 h-3 rounded" />
        <Skeleton className="w-8 h-3 rounded" />
        <Skeleton className="w-8 h-3 rounded" />
      </div>
    </div>
  );
};
