# Biblioteca Comunitaria "Leer nos une"

Sitio web de una biblioteca comunitaria de barrio: catálogo de libros, servicios y salas, contacto y acceso para vecinos.
Proyecto académico del **Taller de Programación Web**.

Es un sitio **estático**: HTML, CSS y JavaScript sin frameworks, sin servidor y sin base de datos.
Los formularios son una **maqueta**: validan y muestran avisos, pero no envían datos a ningún sitio.

## Cómo verlo

1. Descarga o clona el repositorio.
2. Abre `index.html` con doble clic (o clic derecho → Abrir con tu navegador).
3. Navega por el menú. No hay que instalar nada.

Necesita **conexión a internet** solo para las fuentes (Fredoka y Plus Jakarta Sans) y los iconos (Material Symbols), que se cargan desde Google Fonts, y para las portadas de algunos libros. Sin conexión el sitio funciona, pero con letras e iconos de respaldo.

Si prefieres abrirlo con un servidor local (opcional):

```bash
python -m http.server 8000
```

y entra en `http://localhost:8000`.

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Inicio: bienvenida, libros destacados, agenda, video y audio, normas de convivencia |
| `libros.html` | Catálogo: búsqueda, categorías, filtros, orden, paginación y vista en cuadrícula o lista |
| `servicios.html` | Servicios, salas y jardín, cronograma semanal (tabla) |
| `contacto.html` | Formulario de contacto, canales de atención, tabla de plazos y preguntas frecuentes |
| `login.html` | Iniciar sesión y crear cuenta (se abre en "Crear cuenta" con `login.html#crear-cuenta`). Las cuentas son reales dentro del navegador, ver "Cuentas y roles" |
| `admin.html` | Panel del administrador: lista de cuentas registradas. Solo entra el rol admin |
| `registro.html` | Solicitud completa de carnet vecinal (con DNI y dirección). Hoy ninguna página enlaza a ella |
| `actividades.html`, `catalogo.html` | Páginas de paso que redirigen a `servicios.html` y `libros.html` |

## Estructura

```
biblioteca_comunitaria/
├── index.html, libros.html, servicios.html, contacto.html,
│   login.html, admin.html, registro.html, actividades.html, catalogo.html
├── auth.js           Cuentas, sesión y roles (se guardan en el navegador)
├── styles.css        Hoja de estilos única (índice de 30 secciones al inicio)
├── DESIGN.md         Sistema de diseño: colores, tipografía, formas y componentes
├── img/              Imágenes del sitio
└── multimedia/       Video del recorrido y audio de música relajante
```

## Decisiones de diseño y de código

- **Dirección de arte:** "biblioteca de barrio con jardín": pergamino, verde bosque, salvia y ámbar. Títulos en Fredoka y texto en Plus Jakarta Sans. El detalle está en `DESIGN.md`.
- **Variables CSS:** todos los colores, espacios, radios, sombras y curvas de movimiento salen de las variables de la sección 1 de `styles.css`. Se cambian en un solo lugar.
- **Encabezado y pie repetidos:** están copiados en cada página, **idénticos** (solo cambia el enlace activo del menú). Es deliberado: cargarlos con JavaScript no funciona al abrir los archivos con doble clic, y el HTML se ve completo en el código fuente.
- **Sin estilos en línea:** todo el estilo está en `styles.css`. Las portadas de los libros son imágenes (`<img>`) con texto alternativo.
- **JavaScript:** cada página lleva su script al final del HTML. Se usa para el menú móvil, el catálogo (filtros, orden, paginación y panel plegable), la validación de `login.html` y el deslizamiento entre "Iniciar sesión" y "Crear cuenta".

## Cuentas y roles

No hay servidor ni base de datos, así que las cuentas viven **en el navegador de cada persona** (`localStorage`) y la sesión dura hasta cerrar la pestaña (`sessionStorage`). Todo está en `auth.js`.

- **Usuario:** cualquiera que cree su cuenta en `login.html#crear-cuenta`. No puede entrar a `admin.html`.
- **Administrador (cuenta de demostración):** correo `admin@leernosune.org`, contraseña `Admin2025!`. Al iniciar sesión va a `admin.html`.
- El encabezado cambia con la sesión: el botón pasa a "Cerrar sesión" y el admin ve "Panel admin".
- `admin.html` lista las cuentas creadas **en ese mismo navegador**. No muestra las de otros equipos: eso necesita un servidor.
- **Límite importante:** es una simulación. Las contraseñas se guardan sin cifrar y quien abra las herramientas del navegador puede cambiar los datos. Los roles con seguridad real necesitan servidor.
- Para que las cuentas se compartan entre páginas conviene abrir el sitio con `python -m http.server` o con Chrome; algunos navegadores aíslan los archivos abiertos con doble clic.

## Accesibilidad

- Contraste de texto AA medido; foco visible (anillo sólido de 3px); enlace "Saltar al contenido principal".
- Un único `<h1>` por página y jerarquía de encabezados sin saltos; menús y navegaciones con nombre propio.
- Formularios con etiquetas asociadas y `autocomplete` en los datos personales. El inicio de sesión muestra mensajes de error propios junto al campo; contacto y registro usan los avisos del navegador.
- Objetivos táctiles de 44px en pantallas táctiles y soporte de `prefers-reduced-motion` (sin deslizamientos ni fundidos).
- Diseño adaptable probado de 320 a 1440px, sin desbordes horizontales.

Lo que **no** se ha probado: lectores de pantalla reales (NVDA, VoiceOver) ni dispositivos táctiles físicos.

## Conocido y pendiente

- **Portadas:** 8 de las 9 portadas del catálogo (y 3 de `index`) se cargan desde un servidor externo. Conviene guardarlas en `img/`.
- **Video del recorrido:** sin subtítulos ni descripción en texto; algunos textos de la sección de video y audio no coinciden con el contenido.
- **Catálogo:** "Reservar", "Pedir en sala", el botón de información, el botón "Buscar", el selector "Todos los campos" y los botones del banner ("Sugerir un título", "Donar libros") todavía no tienen función. Los contadores de las categorías (840, 320…) son cifras de ejemplo.
- **`registro.html`:** existe pero no está enlazada desde el sitio.

## Ramas de Git

- `main`: la versión de partida (Avance 2).
- `avanceClaude`: el rediseño visual, de accesibilidad y de estructura, hecho con Claude Code. Cada paso está en su propio commit (`git log --oneline`).
