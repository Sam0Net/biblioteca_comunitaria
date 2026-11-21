# Plan de Rediseño Anti-Slop: Biblioteca Comunitaria «Leer nos une»

> **Objetivo:** Eliminar por completo el aspecto genérico de "IA" (plantillas predecibles, píldoras infinitas, gradientes arcoíris, tarjetas idénticas con iconos flotantes y emojis) y transformar la plataforma en una experiencia editorial botánica de alta gama, inspirada en los principios de `design-taste-frontend`, `frontend-design`, `impeccable` y `emil-design-eng`.

---

## 🎨 1. Dirección Visual: Botánico Editorial & Cívico
- **Filosofía:** Un espacio cívico cálido y digno. No es una startup de SaaS ni un juguete infantil. Es una biblioteca viva con jardín botánico, madera noble, papel impreso y saberes compartidos.
- **Paleta Restringida y Auténtica:**
  - Fondo Base: Pergamino cálido `#fef9f0` / Lienzo `#faf7f0` / Blanco puro `#ffffff`
  - Tinta Principal: Verde Bosque Profundo `#003626` (alta autoridad tipográfica)
  - Tonos Secundarios: Pino `#1a4d3b`, Sabia `#52796f`, Musgo suave `#e8f1eb`
  - Acento Noble: Roble / Ámbar tostado `#c48849` (usado con estricta moderación)
  - Bordes: Líneas nítidas y sutiles `#e3ded6` (1px sólido, no sombras flotantes)
- **Tipografía:**
  - Títulos: Fredoka con tracking ajustado (`tracking-tight`), peso 600/700, sin infantilización.
  - Textos & Metadatos: Plus Jakarta Sans con escala armónica, excelente legibilidad (line-height 1.6).
  - Eliminación absoluta de texto degradado y "kickers / eyebrows" en minúsculas forzadas sobre los encabezados.
- **Microinteracciones Táctiles (Emil Kowalski / Apple):**
  - Botones con retroalimentación instantánea al presionar: `active:scale-[0.98]`.
  - Bordes definidos con radio refinado (`rounded-lg` / `rounded-xl`, desterrando el abuso de `rounded-full`).
  - Tarjetas con elevación sutil de 2px en hover (`-translate-y-[2px]`) y sombras suaves calculadas.
  - Portadas de libros con zoom controlado dentro del marco (`scale-[1.02]`).

---

## 📋 2. Tareas de Implementación

### Fase 1: Tokens y Sistema Base (`DESIGN.md` y `design-tokens.css`)
- [x] Actualizar `DESIGN.md` con los lineamientos Anti-Slop, ratios de bordes, sombras y tipografía.
- [x] Refactorizar `design-tokens.css`:
  - Reemplazar estilos de botones redondeados tipo píldora (`rounded-full`) por radios arquitectónicos (`rounded-lg` / `rounded-md`).
  - Ajustar sombras (eliminar difuminados artificiales, usar capas nítidas y sutiles).
  - Definir personalización del navegador (`selection:bg-primary`, scrollbar botánica estilizada, foco accesible).

### Fase 2: Componentes Esenciales de Identidad
- [x] **Navbar (`Navbar.tsx`):**
  - Diseño horizontal limpio con espaciado balanceado.
  - Indicadores activos elegantes (línea sutil inferior o fondo tenue con borde).
  - Selector de acciones claro y sin sobrecarga de píldoras.
- [x] **Footer (`Footer.tsx`):**
  - Bloque cívico sobrio en verde profundo con tipografía clara y datos reales del espacio.
- [x] **Tarjetas de Libro (`BookCard.tsx`):**
  - Proporción editorial 2:3 con simulación de relieve de lomo/tapa.
  - Reemplazo de emojis por metadatos tipográficos limpios.
  - Badges de estado discretos y legibles.
- [x] **Modal de Detalle (`BookDetailModal.tsx`):**
  - Composición de ficha bibliográfica real, formulario de préstamo ordenado con foco visible.

### Fase 3: Componentes Interactivos Refinados
- [x] **DiaTextReveal (`DiaTextReveal.tsx`):**
  - Sustituir el gradiente multicolor por una transición tipográfica limpia y fluida en color tinta `#003626` / `#1a4d3b`.
- [x] **OrbitalImageWheel (`OrbitalImageWheel.tsx`):**
  - Rediseñar el escenario orbital: iluminación ambiental suave en lugar de brillos neon, física de giro suave, tarjeta activa con estética de pedestal editorial y botones de control nítidos.

### Fase 4: Vistas Públicas
- [x] **Home (`Home.tsx`):**
  - Desterrar el banner AI de "Espacio Vecinal", la tarjeta flotante con desenfoque sobre la foto y los kickers.
  - Transformar el bloque de 4 métricas idénticas en una franja cívica integrada de datos concretos.
  - Agenda comunitaria con diseño de fichas de actividades vecinales auténticas.
- [x] **Catálogo (`Catalog.tsx`):**
  - Barra de búsqueda refinada con borde sutil y foco de alta precisión.
  - Filtro de categorías estructurado, eliminando el chip "✨ Todas".
  - Grilla de libros limpia con balance visual en desktop y móvil.
- [x] **Servicios & Contacto (`Services.tsx`, `Contact.tsx`):**
  - Eliminar kickers, ajustar tablas y formularios con diseño limpio y accesible.
- [x] **Login & Registro (`Login.tsx`, `Register.tsx`):**
  - Formularios limpios, botones arquitectónicos, credenciales de prueba ordenadas.

### Fase 5: Panel de Administración (`AdminDashboard.tsx`)
- [x] Armonizar la paleta de Recharts con los tonos botánicos editoriales.
- [x] Pulir las tablas de inventario, préstamos y usuarios con espaciado consistente y acciones directas.

### Fase 6: Verificación y Compilación
- [x] Ejecutar `npm run build` y comprobar 0 errores TypeScript/Vite.
- [x] Verificar que ambos servidores (4000 y 5173) operen fluidamente.
