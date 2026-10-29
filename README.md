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
| `libros.html` | Catálogo en estantería de portadas: búsqueda, categorías, filtros, orden, paginación y vista en cuadrícula o lista. Las tarjetas salen de `datos/libros.js` |
| `servicios.html` | Servicios, salas y jardín, cronograma semanal (tabla) |
| `contacto.html` | Formulario de contacto, canales de atención, tabla de plazos y preguntas frecuentes |
| `login.html` | Iniciar sesión y crear cuenta (se abre en "Crear cuenta" con `login.html#crear-cuenta`). Las cuentas son reales dentro del navegador, ver "Cuentas y roles" |
| `admin.html` | Panel del administrador: cuentas registradas y gestión de libros (agregar, editar, quitar). Solo entra el rol admin |
| `registro.html` | Solicitud completa de carnet vecinal (con DNI y dirección). Hoy ninguna página enlaza a ella |
| `actividades.html`, `catalogo.html` | Páginas de paso que redirigen a `servicios.html` y `libros.html` |

## Estructura

```
biblioteca_comunitaria/
├── index.html, libros.html, servicios.html, contacto.html,
│   login.html, admin.html, registro.html, actividades.html, catalogo.html
├── auth.js           Cuentas, sesión y roles (se guardan en el navegador)
├── biblioteca.js     Libros: dibuja el catálogo y guarda los cambios del admin
├── datos/libros.js   Los libros del catálogo (el archivo que se publica)
├── styles.css        Hoja de estilos única (índice de 34 secciones al inicio)
├── DESIGN.md         Sistema de diseño: colores, tipografía, formas y componentes
├── img/              Imágenes del sitio
└── multimedia/       Video del recorrido y audio de música relajante
```

## Decisiones de diseño y de código

- **Dirección de arte:** "biblioteca de barrio con jardín": pergamino, verde bosque, salvia y ámbar. Títulos en Fredoka y texto en Plus Jakarta Sans. El detalle está en `DESIGN.md`.
- **Variables CSS:** todos los colores, espacios, radios, sombras y curvas de movimiento salen de las variables de la sección 1 de `styles.css`. Se cambian en un solo lugar.
- **Encabezado y pie repetidos:** están copiados en cada página, **idénticos** (solo cambia el enlace activo del menú). Es deliberado: cargarlos con JavaScript no funciona al abrir los archivos con doble clic, y el HTML se ve completo en el código fuente.
- **Estantería de portadas:** cada libro muestra su portada entera (proporción 2:3), título, autor y disponibilidad; la descripción y la valoración están en la ventana de detalles. Todo el libro es un solo objetivo (el título abre los detalles). 4 columnas en escritorio y 2 en celular.
- **Carrusel del inicio:** los 7 libros más leídos giran en un arco suave: el del centro va al frente y nítido, los de los lados quedan atrás, más pequeños, girados y desenfocados. En escritorio avanza solo cada 3 segundos y se detiene al pasar el cursor, enfocar con el teclado o salir de la pantalla; sus botones (pausa y flechas) no se ven, pero aparecen al llegar a ellos con la tecla Tab. En el celular no avanza solo: tiene las dos flechas y se desliza con el dedo. Con "reducir movimiento" activado en el sistema tampoco se mueve solo, y la página lo explica junto a un botón para activarlo. El libro del frente es un poco más grande y proyecta una sombra sobre los de atrás. Al pulsar un libro, `libros.html#libro-<id>` abre el catálogo en ese libro y lo marca unos segundos.
- **Título con hojas y flores:** "Los libros más leídos del barrio" va en el verde de la página, con dos ramas a los lados y una enredadera debajo, dibujadas en SVG con los verdes y el ámbar de la paleta. Las hojas, las flores y las chispas se mecen despacio de lado a lado; con "reducir movimiento" quedan quietas. En el celular solo queda la enredadera.
- **Ritmo de espacios:** dos medidas fijas (`--ritmo-seccion`, entre todas las secciones y hasta el pie, y `--espacio-titulo`, entre un título y su contenido) mandan en todas las páginas. En el carrusel, el hueco entre el título y el libro del frente y el hueco entre su nombre y el botón del catálogo salen de la misma variable (`--aire`), y los libros de los lados quedan a la misma distancia de cada borde.
- **Menos cajas:** la bienvenida, las normas, los servicios y las preguntas frecuentes van directamente sobre la página, con una línea superior como único adorno; solo lo que se puede pulsar o contiene un formulario tiene caja. No hay etiquetas en mayúsculas sobre los títulos ni cifras de relleno.
- **Escala:** los tamaños de letra salen de una escala corta (12 valores, ninguno bajo 12px), los radios de 6 a 36px y el color de texto ámbar (`#8a5320`) pasa el contraste AA.
- **Textos:** mayúscula solo al inicio de la frase, verbos en los botones ("Reservar", "Donar libros") y mensajes que dicen qué pasó y qué hacer.
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

## Libros: agregar y quitar (solo el administrador)

Los libros ya no están escritos en `libros.html`: viven en `datos/libros.js` y el catálogo los dibuja al cargar.

1. Entra con la cuenta de administrador y abre **Panel admin → Libros del catálogo**.
2. **Agregar:** completa el formulario (título, autor, categorías, descripción, disponibilidad, portada). La portada es una imagen que copiaste antes a la carpeta `img/` (se escribe `img/mi-libro.jpg`) o un enlace `https://`. Debajo del campo se ve una vista previa.
3. **Editar** y **Quitar** están en cada fila. Quitar pide confirmación. **Restaurar libros originales** deshace todo lo hecho en ese navegador.
4. Los cambios se ven al instante **en ese navegador**. Para que los vea todo el mundo: pulsa **Descargar libros actualizados**, reemplaza `datos/libros.js` con el archivo descargado (`libros.js`) y súbelo al repositorio.

Los 4 libros "más leídos" de `index.html` salen de los mismos datos (los que tienen más lectores), así que si el admin quita uno, el inicio muestra el siguiente. Un libro nuevo empieza con 0 lectores y por eso aparece en el catálogo, no en el inicio.

Un usuario normal no ve estos botones, y las funciones de `biblioteca.js` rechazan cualquier cambio si la sesión no es de administrador. Igual que las cuentas, es una simulación: sin servidor no hay seguridad real.

## Donar libros

El botón **Donar Libros** del catálogo abre una ventana:

1. **Sin sesión:** pide iniciar sesión o crear cuenta (así se sabe quién dona).
2. **Usuario con sesión:** llena título, autor, estado del libro y un comentario opcional. La solicitud queda "Pendiente" y el usuario ve en esa misma ventana si fue **aceptada** o **rechazada** (con el motivo).
3. **Administrador:** en `admin.html`, sección **Donaciones recibidas**. **Aceptar** abre el formulario de libros con título y autor ya escritos; al guardar el libro, la donación queda aceptada. **Rechazar** pide un motivo opcional.

Solo el admin puede ver todas las donaciones y resolverlas. Se guardan en el navegador de quien las envía (`localStorage`), así que el admin solo ve las enviadas desde su mismo navegador; con servidor esto se resolvería. "Sugerir un título" sigue siendo un enlace al formulario de contacto.

## Accesibilidad

- Contraste de texto AA medido; foco visible (anillo sólido de 3px); enlace "Saltar al contenido principal".
- Un único `<h1>` por página y jerarquía de encabezados sin saltos; menús y navegaciones con nombre propio.
- Formularios con etiquetas asociadas y `autocomplete` en los datos personales. El inicio de sesión muestra mensajes de error propios junto al campo; contacto y registro usan los avisos del navegador.
- Objetivos táctiles de 44px en pantallas táctiles y soporte de `prefers-reduced-motion` (sin deslizamientos ni fundidos).
- Diseño adaptable probado de 320 a 1440px, sin desbordes horizontales.

Lo que **no** se ha probado: lectores de pantalla reales (NVDA, VoiceOver) ni dispositivos táctiles físicos.

## Conocido y pendiente

- **Portadas:** las 9 están en `img/` (Open Library y catálogos de librerías). Son imágenes de baja resolución (unos 330 px de ancho): bastan para la pantalla, pero se verían suaves si se amplían mucho.
- **Video del recorrido:** sin subtítulos ni descripción en texto; algunos textos de la sección de video y audio no coinciden con el contenido.
- **Catálogo:** el botón "Buscar", el selector "Todos los campos" y "Sugerir un título" todavía no tienen función propia. Los contadores de las categorías (840, 320…) son cifras de ejemplo.
- **`registro.html`:** existe pero no está enlazada desde el sitio.

## Ramas de Git

- `main`: la versión de partida (Avance 2).
- `features`: el rediseño visual, de accesibilidad y de estructura, hecho con Claude Code. Cada paso está en su propio commit (`git log --oneline`).
