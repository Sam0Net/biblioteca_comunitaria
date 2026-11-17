# Documentación de Proyecto Web: Biblioteca Comunitaria "Leer nos une"

Documento técnico y funcional elaborado para el curso Taller de Programación Web (Ciclo 5).

---

## 1. Etapa de análisis

### Introducción al proyecto
La Biblioteca Comunitaria "Leer nos une" es una iniciativa vecinal situada en el Sector San José, junto a la sede de la SUNAT. El proyecto consiste en un portal web desarrollado para poner a disposición de los vecinos el catálogo bibliográfico de la biblioteca, simplificar los trámites de préstamo a domicilio y lectura presencial, emitir carnets vecinales digitales, gestionar donaciones de libros y difundir las actividades culturales organizadas en el local.

La aplicación funciona directamente en el navegador del usuario utilizando tecnologías web estándar (HTML5, CSS3 y JavaScript), por lo que no depende de frameworks externos pesados ni de un servidor de bases de datos para su operación básica.

### Objetivos del proyecto

#### Objetivo general
Construir un sitio web accesible, adaptable a dispositivos móviles e interactivo con HTML5, CSS3 y JavaScript que centralice el catálogo bibliográfico y los servicios comunitarios de la biblioteca.

#### Objetivos específicos
* Implementar un catálogo interactivo con búsqueda en tiempo real, filtros por categoría, disponibilidad y formato, opciones de ordenamiento, paginación y cambio de vista entre cuadrícula y lista.
* Integrar un sistema de autenticación del lado del cliente con control de roles (visitante, vecino lector y administrador) mediante las APIs `localStorage` y `sessionStorage`.
* Desarrollar un panel administrativo para gestionar el inventario de libros mediante operaciones de creación, edición, eliminación y descarga de datos, además de atender donaciones vecinales, despachar préstamos y revisar cuentas de usuarios.
* Aplicar pautas de accesibilidad web, incluyendo contraste de color nivel AA segun WCAG, navegación por teclado, atributos ARIA y adaptación a preferencias del sistema operativo.

### Alcance del proyecto

#### Funcionalidades incluidas
* Maquetación multipágina adaptable a pantallas desde 320 px hasta 1440 px de ancho.
* Catálogo dinámico cargado desde el archivo `datos/libros.js`.
* Carrusel tridimensional con los libros más consultados en la página de inicio.
* Sistema de reservas para préstamo a domicilio y solicitudes de lectura en sala.
* Registro de donaciones de libros con seguimiento de su estado de aprobación.
* Emisión automática de carnet digital vecinal con identificador único.
* Formulario de contacto vecinal con validación de campos y avisos en pantalla.
* Reproductores multimedia nativos para video y audio institucional.
* Panel administrativo con métricas resumidas y tablas de gestión.

#### Funcionalidades no incluidas
* Servidor de aplicaciones o backend dedicado en Node.js, Python o Java.
* Base de datos centralizada conectada por red para sincronizar cambios entre diferentes computadoras.
* Cifrado criptográfico de contraseñas en almacenamiento persistente.
* Envío de correos electrónicos reales o notificaciones por servicios de mensajería externa.

### Identificación de usuarios

* **Visitante sin sesión:** Persona que consulta información general sobre la biblioteca, explora el catálogo, revisa horarios de atención y envía mensajes mediante el formulario de contacto. Puede registrarse para obtener su carnet de lector.
* **Vecino lector (usuario registrado):** Usuario con cuenta activa y carnet asignado (código con formato `VEC-2026-XXXXX`). Puede reservar hasta tres libros para préstamo a domicilio durante 14 días, pedir ejemplares para lectura en sala y registrar propuestas de donación.
* **Administrador:** Cuenta con permisos especiales (`admin@leernosune.org`) que accede a `admin.html`. Puede modificar el inventario de libros, descargar la versión actualizada de `datos/libros.js`, aprobar o rechazar donaciones, marcar pedidos como atendidos y dar de baja usuarios.

### Requisitos funcionales

* **RF01. Registro y autenticación de usuarios:** El sistema debe registrar nuevos vecinos con nombre, correo electrónico y contraseña, asignando un código de carnet y permitiendo iniciar o cerrar sesión en cualquier momento.
* **RF02. Búsqueda y filtrado de obras:** El catálogo debe buscar libros por texto (título, autor o descripción) sin distinguir tildes o mayúsculas, filtrar por categoría, disponibilidad y formato, y ordenar alfabéticamente o por valoración.
* **RF03. Paginación y visualización del catálogo:** El catálogo debe mostrar un máximo de 12 libros por página y permitir alternar entre vista en cuadrícula y vista en lista.
* **RF04. Solicitud de reservas y lectura en sala:** Un usuario con sesión iniciada debe poder reservar libros disponibles o pedir lectura presencial, con la posibilidad de cancelar la solicitud desde la misma tarjeta.
* **RF05. Registro y seguimiento de donaciones:** El usuario debe poder enviar una ficha de donación indicando título, autor y estado del ejemplar, visualizando posteriormente si su entrega fue aceptada o rechazada.
* **RF06. Gestión de inventario bibliográfico:** El administrador debe poder registrar libros nuevos, editar copias o datos de títulos existentes, eliminar obras y restaurar la colección original.
* **RF07. Exportación del catálogo:** El administrador debe poder descargar el archivo `libros.js` con los datos actualizados para integrarlos al código fuente del sitio.
* **RF08. Atención de donaciones y pedidos:** El administrador debe poder aceptar o rechazar solicitudes de donación (indicando motivo si es rechazada) y marcar como despachadas las reservas activas.
* **RF09. Envío de consultas de contacto:** El portal debe recibir mensajes vecinales desde `contacto.html`, validando los campos obligatorios antes de simular el envío.

### Requisitos no funcionales

* **Compatibilidad y responsividad:** La interfaz debe ajustarse sin desbordamientos horizontales desde dispositivos móviles pequeños (320 px) hasta monitores de escritorio (1440 px), manteniendo compatibilidad con Google Chrome, Mozilla Firefox, Microsoft Edge y Safari.
* **Accesibilidad web:** Las combinaciones de color deben respetar una relación de contraste mínima de 4.5:1 para texto normal (nivel AA de WCAG 2.1). Todos los controles interactivos deben medir al menos 44 px por 44 px, admitir navegación completa por teclado e incluir estilos visibles de enfoque.
* **Rendimiento:** El sitio debe cargar de forma inmediata sin dependencias pesadas. Los scripts deben usar el atributo `defer` y las imágenes fuera de la primera pantalla deben utilizar `loading="lazy"`.
* **Persistencia local:** Los datos modificados por el usuario o administrador deben conservarse en el navegador mediante `localStorage` y `sessionStorage`, resistiendo recargas de página.

### Análisis de referencia

Durante la fase de análisis se revisaron dos modelos de referencia:

1. **Open Library (Internet Archive):** Se tomó como referencia la presentación de portadas en proporción vertical 2:3, la inclusión de fichas descriptivas emergentes con datos editoriales y el uso de etiquetas de estado para indicar si un libro se encuentra disponible para préstamo inmediato.
2. **Portales de redes de bibliotecas públicas municipales:** Se analizó el modelo de carnet vecinal gratuito con código de lector, la regla de préstamo domiciliario por dos semanas renovables, la diferenciación entre salas de silencio y salas infantiles, y la publicación clara de normas de convivencia comunitaria.

---

## 2. Etapa de diseño

### Mapa del sitio (Site Map)

La estructura de páginas del proyecto se organiza de la siguiente manera:

```text
index.html (Página de inicio)
└── pages/
    ├── libros.html (Catálogo de libros)
    │   ├── Modal: Detalle de obra (#dialogoLibro)
    │   └── Modal: Formulario y seguimiento de donaciones (#dialogoDonar)
    ├── servicios.html (Salas de lectura, talleres y horarios semanales)
    ├── contacto.html (Canales de atención, formulario y preguntas frecuentes)
    ├── login.html (Acceso al sistema y creación de cuenta vecinal)
    │   └── admin.html (Panel de control exclusivo para el rol administrador)
    ├── registro.html (Solicitud extendida de carnet vecinal digital)
    ├── catalogo.html (Redirección hacia libros.html)
    └── actividades.html (Redirección hacia servicios.html)
```

### Wireframes de las páginas principales

La distribución de los bloques en cada pantalla sigue una estructura clara y uniforme:

* **Estructura base compartida:** Cabecera superior fija con logotipo a la izquierda, cuatro enlaces de navegación (`Inicio`, `Libros`, `Servicios`, `Contacto`), botón de acceso o carnet a la derecha y menú hamburguesa en pantallas menores a 860 px. Pie de página en cuatro columnas con datos institucionales, accesos directos, horarios y aviso legal.
* **Página de inicio (`index.html`):** Bloque principal con título, descripción y botones de acción junto a una fotografía enmarcada; carrusel tridimensional interactivo con siete obras destacadas; tres tarjetas de actividades del mes; zona multimedia con reproductor de video explicativo y audio relajante; sección de normas de convivencia y llamada a la acción para tramitar el carnet.
* **Catálogo (`libros.html`):** Encabezado explicativo con barra de búsqueda y desplegable de filtros rápidos; barra horizontal con botones de categorías y contadores numéricos; barra de herramientas con contador de coincidencias, selector de orden y botones para alternar entre cuadrícula y lista; rejilla de tarjetas de libros; banner informativo para donaciones y controles de paginación inferior.
* **Servicios (`servicios.html`):** Rejilla asimétrica compuesta por cuatro tarjetas de servicios comunitarios a la izquierda y una tarjeta vertical ilustrada a la derecha; tabla comparativa con horarios, aforos y normas por cada sala.
* **Contacto (`contacto.html`):** Distribución en dos columnas con formulario estructurado en campos agrupados a la izquierda y tarjetas con canales directos (WhatsApp, correo, atención presencial) a la derecha; tabla de tiempos de respuesta y sección con cuatro preguntas frecuentes.
* **Acceso y panel administrativo (`login.html` y `admin.html`):** `login.html` utiliza una tarjeta dividida en dos paneles donde se alternan los formularios de inicio de sesión y registro. `admin.html` presenta cuatro tarjetas con indicadores de gestión en la parte superior, seguidas de secciones con formularios de alta y edición, tablas con filtros de búsqueda y botones para restaurar o descargar la colección de libros.

### Diseño de interfaces (UI Design)

#### Paleta de colores
La identidad gráfica está inspirada en la atmósfera de una biblioteca de barrio rodeada de jardines:

* **Superficies y fondos:** Color pergamino claro (`#fef9f0`) para el fondo general, blanco puro (`#ffffff`) para el fondo de las tarjetas y tonos arena suaves (`#f4efe6`, `#ece8df`) para barras y divisores.
* **Verdes botánicos:** Verde bosque profundo (`#1a4d3b`) para la cabecera, botones principales y títulos destacados; verde oscuro (`#123b2d`) para estados al pasar el cursor; verde salvia claro (`#e8f3ee`, `#d4e6dd`) para fondos de iconos y etiquetas activas.
* **Acentos cálidos:** Tono ocre accesible (`#8a5320`) que cumple el contraste para texto e iconos secundarios, ámbar decorativo (`#c48849`) y tono melocotón suave (`#ffdcbe`) para áreas de llamada a la acción.
* **Colores de estado:** Verde hoja (`#2b6e4e`) para ejemplares disponibles, ocre tostado (`#92400e`) para libros prestados y azul pizarra (`#2f5c78`) para títulos en sala o novedades.

#### Tipografía
* **Títulos y marca:** Se utiliza la fuente `Fredoka` en pesos 400 a 700, aportando un estilo cercano y legible.
* **Cuerpo de texto y tablas:** Se emplea `Plus Jakarta Sans` en pesos 400 a 700 para párrafos, campos de formulario y datos tabulares.
* **Códigos y carnets:** Fuente monoespaciada estándar del sistema operativo para mostrar los códigos de usuario (`VEC-2026-XXXXX`).

#### Componentes visuales
Los botones tienen esquinas redondeadas completas tipo píldora, con una ligera reducción de escala al hacer clic para dar respuesta táctil. Las tarjetas tienen bordes delgados de un pixel con tono verde semitransparente, radios de curvatura consistentes y sombras suaves que aumentan ligeramente al pasar el cursor.

### Diagramas de flujo de navegación

El desplazamiento de los usuarios según su estado de sesión sigue estas rutas:

```text
Visitante sin cuenta
  │
  ├──> index.html (Navega información, carrusel y multimedia)
  ├──> libros.html (Consulta catálogo, busca y abre detalles)
  │      └── Intenta reservar o donar ──> Aviso en pantalla ──> login.html
  ├──> servicios.html / contacto.html (Revisa horarios o envía dudas)
  └──> login.html#crear-cuenta ──> Registro ──> Sesión iniciada como Vecino Lector

Vecino Lector (Sesión de usuario iniciada)
  │
  ├──> libros.html ──> Reserva libros (máximo 3) o solicita lectura en sala
  ├──> libros.html ──> Envía formulario de donación y consulta su estado
  └──> Encabezado ──> Visualiza su código de carnet y opción de cerrar sesión

Administrador (Cuenta admin@leernosune.org)
  │
  └──> login.html ──> Autenticación admin ──> Redirección automática a admin.html
         │
         ├──> Modifica, agrega o elimina libros del catálogo
         ├──> Descarga archivo libros.js actualizado para el repositorio
         ├──> Acepta o rechaza solicitudes de donación con motivo
         ├──> Despacha reservas y pedidos de sala pendientes
         └──> Revisa y gestiona las cuentas de lectores registrados
```

### Arquitectura de carpetas y archivos

El proyecto mantiene una estructura modular y organizada en archivos especializados:

```text
biblioteca_comunitaria/
├── index.html          Página de inicio y presentación de la biblioteca
├── css/
│   └── styles.css      Hoja de estilos global estructurada en 37 bloques temáticos
├── js/
│   ├── auth.js         Módulo de autenticación, control de roles y menú móvil
│   └── biblioteca.js   Módulo del catálogo, reservas, donaciones y carrusel
├── pages/
│   ├── libros.html     Catálogo bibliográfico interactivo con filtros y modales
│   ├── servicios.html  Información sobre salas, horarios semanales y aforos
│   ├── contacto.html   Formulario de atención vecinal, canales y preguntas frecuentes
│   ├── login.html      Formulario unificado de acceso y registro de lectores
│   ├── admin.html      Panel de administración y control operativo
│   ├── registro.html   Formulario detallado para trámite de carnet vecinal
│   ├── catalogo.html   Redirección hacia libros.html
│   └── actividades.html Redirección hacia servicios.html
├── datos/
│   └── libros.js       Catálogo inicial en JavaScript (window.LIBROS_ORIGINALES)
├── img/                Fotografías de portadas e ilustraciones botánicas
├── multimedia/
│   ├── recorrido_biblioteca.mp4   Video institucional de los ambientes
│   └── musica_relajante.mp3       Pista de audio ambiental para lectura
├── README.md           Documentación técnica de inicio rápido
├── DESIGN.md           Guía de tokens visuales y decisiones de diseño
└── DOCUMENTACION.md    Informe formal del proyecto (este documento)
```

### Identificación de componentes web reutilizables

* **Encabezado institucional (`.encabezado`):** Barra de navegación común con detección automática de la página activa mediante la ruta actual, conmutación entre botones de acceso o carnet según la sesión y menú desplegable para dispositivos móviles.
* **Tarjeta de libro (`.tarjeta-libro`):** Bloque generado por la función `Biblioteca.crearTarjeta()` que incluye imagen con proporción 2:3, etiqueta de disponibilidad, título enlazado a la ficha completa, autor, valoración, botón de reserva directa y solapa deslizable con resumen en vista de escritorio.
* **Carrusel tridimensional (`.carrusel-libros`):** Contenedor con perspectiva visual calculada matemáticamente en JavaScript para rotar las portadas de los libros más leídos con soporte para teclado, gestos táctiles y detención automática al perder visibilidad.
* **Ventanas modales accesibles (`<dialog>`):** Ventanas emergentes nativas del navegador para la ficha bibliográfica detallada (`#dialogoLibro`) y para el formulario de donaciones comunitarias (`#dialogoDonar`).
* **Tablas de datos adaptables:** Tablas con desplazamiento lateral en pantallas públicas (`.contenedor-tabla-responsiva`) y tablas con transformación a fichas verticales apiladas mediante CSS en el panel administrativo (`.tabla-apilable`).
* **Credencial digital (`.tarjeta-carnet-credencial`):** Componente visual que reproduce la estética de una tarjeta física con logotipo, nombre del vecino, código único autogenerado y fecha de emisión.

---

## 3. Etapa de desarrollo

### Manual técnico de desarrollo

#### Estructura general de documentos HTML
Cada página web fue escrita en HTML5 semántico utilizando etiquetas con significado estructural explícito (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`, `<fieldset>`, `<figure>`, `<picture>`). 

Las páginas cumplen con las siguientes normas:
1. Declaración correcta de doctype e idioma general `lang="es"`.
2. Encabezado `<head>` con metadatos de codificación UTF-8, escala de visualización móvil `viewport` y título descriptivo por página.
3. Un único encabezado `<h1>` por documento, manteniendo una secuencia lógica de niveles jerárquicos (`<h2>`, `<h3>`, `<h4>`) sin saltos de nivel.
4. Enlace inicial oculto `.saltar-enlace` que permite a usuarios con lectores de pantalla o navegación por teclado saltar directamente al contenido principal.
5. Inclusión de favicon SVG mediante URL de datos embebida (`data:image/svg+xml`) para evitar solicitudes 404 en el servidor.
6. Etiquetas `<label>` explícitamente enlazadas a sus respectivos campos de entrada mediante atributos `for` e `id`.

#### Estilos implementados en CSS
Todos los estilos del proyecto están centralizados en `styles.css`, organizado en 37 secciones temáticas. El archivo utiliza variables personalizadas en `:root` para gestionar tokens de diseño:

* **Colores y superficies:** Variables para fondo general, blanco de tarjetas, verde bosque, ocre y colores de estado.
* **Espaciado y ritmo vertical:** Propiedades como `--ritmo-seccion` y `--espacio-titulo` para mantener distancias proporcionadas entre secciones.
* **Tipografía fluida:** Tamaños de texto calculados con `clamp()` para reducir o ampliar los títulos gradualmente entre dispositivos pequeños y pantallas de escritorio sin saltos bruscos.
* **Mallas y distribución:** Uso combinado de CSS Grid para galerías, catálogos y pies de página, y Flexbox para barras de herramientas, botones y alineaciones internas.
* **Diseño adaptable:** Puntos de quiebre definidos mediante `@media` en 480 px, 560 px, 640 px, 768 px, 860 px, 960 px y 1024 px.
* **Adaptación a preferencias del usuario:** Reglas específicas con `@media (prefers-reduced-motion: reduce)` para anular animaciones y transiciones complejas en favor de usuarios sensibles al movimiento, y `@media (prefers-contrast: more)` para reforzar bordes y contrastes.

#### Funcionalidades implementadas en JavaScript

La lógica del proyecto se divide en dos módulos principales encapsulados en funciones autoejecutables (IIFE) para evitar colisiones de nombres globales:

##### Módulo de autenticación (`auth.js`)
Expone el objeto global `window.Auth` y administra las siguientes tareas:
* Inicialización de una cuenta de administrador fija (`admin@leernosune.org` con clave `Admin2025!`) y recuperación del listado de usuarios desde `localStorage` bajo la clave `bibliotecaUsuarios`.
* Registro de nuevos usuarios validando duplicidad de correo, longitud mínima de clave y generación del código de carnet vecinal.
* Gestión de sesión activa mediante `sessionStorage` (clave `bibliotecaSesion`), asegurando que al cerrar el navegador o la pestaña se conserve la privacidad de la cuenta.
* Actualización dinámica del encabezado en cualquier página: muestra el botón de ingreso cuando no hay sesión, y muestra el nombre del vecino, carnet y enlace de cierre cuando el usuario está conectado. Para el administrador, agrega un enlace directo a `admin.html`.
* Control de apertura, cierre y foco del menú de navegación móvil.

##### Módulo del catálogo y operaciones (`biblioteca.js`)
Expone el objeto global `window.Biblioteca` y controla:
* Sincronización del catálogo de libros con `localStorage` (clave `bibliotecaLibros`). Calcula un hash numérico sobre los datos originales de `datos/libros.js` para detectar si el catálogo base cambió y actualizar el almacenamiento local sin perder ediciones previas.
* Operaciones de alta, edición y baja física de libros, restringidas mediante comprobación de `Auth.esAdmin()`.
* Generación del archivo descargable `libros.js` con el catálogo actualizado formateado en código JavaScript válido.
* Gestión de pedidos de libros (reservas a domicilio y lectura presencial) almacenados en `localStorage` (clave `bibliotecaPedidos`), asociando cada solicitud al correo del usuario y actualizando las copias disponibles.
* Registro de propuestas de donación vecinal (clave `bibliotecaDonaciones`), permitiendo al administrador marcarlas como aceptadas o rechazadas con un comentario explicativo.
* Cálculo de métricas para el panel de control: total de títulos, ejemplares disponibles, préstamos activos y donaciones pendientes.
* Creación y renderizado de tarjetas de catálogo y animación física del carrusel tridimensional.

##### Scripts específicos por página
* **`libros.html`:** Normalización de texto sin acentos mediante `String.prototype.normalize("NFD")` para búsquedas tolerantes a tildes, ordenamiento alfabético mediante `Intl.Collator`, cálculo de páginas (12 elementos por vista), apertura de fichas mediante anclas URL (`#libro-<id>`) y gestión de diálogos modales.
* **`login.html`:** Animación de transición visual entre los paneles de acceso y registro calculando coordenadas con `getBoundingClientRect` (técnica FLIP), conmutador de visibilidad de contraseñas y mensajes de error accesibles asociados con `aria-describedby`.
* **`admin.html`:** Carga de datos en formularios al pulsar editar, confirmación antes de eliminar registros, filtros de búsqueda en tablas administrativas y exportación de archivos mediante enlaces temporales con `URL.createObjectURL`.
* **`contacto.html` y `registro.html`:** Validación en tiempo real de campos, simulación de tiempo de respuesta de red con `setTimeout`, bloqueo temporal del botón de envío para evitar pulsaciones dobles y despliegue de mensajes con `role="alert"`.

### Comentarios en el código

El código fuente contiene documentación técnica en puntos estratégicos:
* Encabezados descriptivos al inicio de `auth.js`, `biblioteca.js`, `datos/libros.js` y `styles.css`, detallando su responsabilidad y dependencias.
* Comentarios explicativos sobre el funcionamiento de algoritmos específicos, como la técnica FLIP en las transiciones de `login.html`, la función hash del catálogo o la sincronización del carrusel con `IntersectionObserver`.
* Índice numérico al inicio de `styles.css` con la lista de sus 37 secciones para facilitar la búsqueda de selectores en el inspector de desarrollo.

### Registro de versiones

La evolución del proyecto se resume en dos versiones principales:

* **Versión 1.0 (Maqueta inicial y estructura estática):**
  * Creación de la estructura multipágina en HTML5 y hojas de estilo iniciales.
  * Definición de la identidad gráfica botánica (colores verde bosque y pergamino).
  * Inclusión de tablas estáticas con horarios de salas y canales de contacto.
  * Integración de reproductores multimedia para video institucional y audio ambiental.
  * Formularios básicos con validación mediante atributos HTML.
* **Versión 2.0 (Lógica en el cliente, accesibilidad y panel de gestión):**
  * Reorganización de estilos en `styles.css` con variables CSS y compatibilidad WCAG AA.
  * Separación del catálogo a `datos/libros.js` y desarrollo del módulo `biblioteca.js`.
  * Incorporación del carrusel tridimensional interactivo con soporte táctil y teclado.
  * Creación del motor de búsqueda sin tildes, filtros por facetas, ordenamiento y paginación en `libros.html`.
  * Desarrollo del módulo `auth.js` con roles de usuario y administrador, persistencia en almacenamiento web y emisión de carnets digitales.
  * Construcción de `admin.html` con panel de métricas, formularios de inventario, exportación de datos y gestión de donaciones y préstamos.
  * Implementación de tablas responsivas que se transforman en fichas apiladas en pantallas pequeñas.

### Módulos y librerías utilizadas

El proyecto evita dependencias externas en tiempo de ejecución para garantizar velocidad de carga y funcionamiento autónomo. Las herramientas utilizadas son:

* **Google Fonts (`Fredoka` y `Plus Jakarta Sans`):** Tipografías descargadas desde la red de distribución de Google mediante enlaces en el encabezado de cada página.
* **Google Material Symbols Outlined:** Colección de iconos vectoriales en formato de fuente web para señalar acciones, formatos y estados.
* **APIs nativas de la plataforma web:**
  * Web Storage API (`localStorage` y `sessionStorage`) para persistencia local.
  * Elemento nativo `<dialog>` con los métodos `showModal()` y `close()` para ventanas emergentes con bloqueo de foco.
  * `IntersectionObserver` para suspender el movimiento automático del carrusel cuando no es visible en pantalla.
  * `Intl.Collator` para ordenamiento de cadenas de texto respetando las reglas del idioma español.

---

## 4. Etapa de pruebas

### Plan de pruebas

Se diseñó una matriz de casos de prueba para verificar las funcionalidades centrales del sistema:

| ID | Escenario de prueba | Pasos ejecutados | Resultado esperado |
| :--- | :--- | :--- | :--- |
| **CP-01** | Registro de nuevo vecino lector | Abrir `login.html#crear-cuenta`, ingresar nombre, correo nuevo y contraseña mayor a 8 caracteres, y enviar el formulario. | El usuario se guarda en `localStorage`, se inicia sesión en `sessionStorage`, el sistema redirige a `index.html` y el encabezado muestra el carnet asignado. |
| **CP-02** | Control de acceso administrativo | Iniciar sesión con `admin@leernosune.org` y `Admin2025!`. Luego intentar ingresar a `admin.html` desde una pestaña de incógnito sin sesión. | Con credenciales válidas permite gestionar el panel. Sin permisos o sin sesión, bloquea los controles y muestra el mensaje de acceso no autorizado. |
| **CP-03** | Búsqueda, filtrado y paginación | En `libros.html`, escribir términos de búsqueda, marcar una categoría y un formato, y navegar a la página siguiente. | La lista actualiza los resultados al instante, el contador numérico refleja los aciertos y el botón para limpiar filtros restablece la vista completa. |
| **CP-04** | Reserva y lectura en sala | Con sesión de usuario abierta en `libros.html`, hacer clic en "Reservar" o "Pedir en sala" en un libro disponible, y luego volver a hacer clic. | La primera pulsación marca el botón como activo, reduce una copia disponible y guarda el pedido. La segunda pulsación cancela la solicitud y devuelve el ejemplar. |
| **CP-05** | Tramitación de donaciones | Desde `libros.html`, completar el diálogo de donaciones. Luego ingresar a `admin.html` y aceptar la donación. | La solicitud queda registrada como pendiente para el usuario y, tras la aprobación del administrador, pasa al estado de aceptada. |
| **CP-06** | Modificación de inventario y exportación | En `admin.html`, agregar un libro con portada válida, modificar sus datos y pulsar "Descargar libros actualizados". | El nuevo título aparece inmediatamente en `libros.html` y el navegador descarga el archivo `libros.js` listo para reemplazar el catálogo base. |
| **CP-07** | Validación del formulario de contacto | En `contacto.html`, enviar el formulario con campos vacíos; luego completarlos correctamente y enviar. | Muestra advertencias en los campos faltantes. Al completar los datos, simula el envío y despliega un mensaje accesible de confirmación. |

### Resultados de pruebas y correcciones realizadas

Durante la fase de verificación se detectaron y corrigieron los siguientes comportamientos:

1. **Aislamiento de almacenamiento web al abrir páginas con protocolo de archivo:** Al abrir los archivos HTML directamente con doble clic en el explorador de archivos (`file:///`), algunos navegadores aíslan el almacenamiento por cada archivo individual, impidiendo compartir la sesión entre `login.html` y las demás páginas.
   * *Solución:* Se documentó el uso de un servidor HTTP local básico y se agregaron bloques de protección `try / catch` alrededor de cada llamada a `localStorage` y `sessionStorage` para prevenir interrupciones en la ejecución.
2. **Desbordamiento lateral de tablas en teléfonos móviles:** Las tablas con múltiples columnas en `servicios.html`, `contacto.html` y `admin.html` superaban el ancho de pantalla en teléfonos de 320 px a 480 px.
   * *Solución:* En las páginas públicas se envolvieron las tablas dentro de contenedores con desplazamiento horizontal (`overflow-x: auto`), y en el panel administrativo se implementó una regla CSS (`.tabla-apilable`) que convierte cada fila en una tarjeta vertical individual utilizando los atributos `data-etiqueta` para mostrar los encabezados.
3. **Saltos visuales al alternar formularios en la página de acceso:** Al cambiar entre el formulario de inicio de sesión y el de registro, la tarjeta cambiaba de tamaño bruscamente.
   * *Solución:* Se calculó la posición previa y posterior de los elementos mediante la técnica FLIP con `getBoundingClientRect()`, aplicando una animación suave que acompaña la reorganización de los paneles.
4. **Ancho desproporcionado del botón en la tarjeta de servicios en móvil:** En resoluciones pequeñas, una regla general forzaba a todos los botones principales al 100% de ancho, lo que hacía que el botón de la tarjeta lateral sobresaliera de su contenedor por sus márgenes.
   * *Solución:* Se añadió la regla específica `.tarjeta-ilustracion-servicios .boton-heroe-primario { width: auto; }` para mantener el botón dentro de los márgenes de su tarjeta.

### Pruebas de compatibilidad

* **Navegadores evaluados:** Se verificó el funcionamiento en las versiones recientes de Google Chrome, Mozilla Firefox y Microsoft Edge en sistemas Linux y Windows. En todos ellos se comprobó el correcto renderizado de CSS Grid, el uso del selector `:has()`, la apertura de modales `<dialog>` y la persistencia de datos.
* **Resoluciones y dispositivos:** Mediante las herramientas de desarrollo se comprobaron anchos de pantalla de 320 px (móviles compactos), 375 px y 412 px (teléfonos comunes), 768 px y 820 px (tabletas) y de 1024 px a 1440 px (pantallas de escritorio), verificando la ausencia de barras de desplazamiento horizontal no deseadas y áreas táctiles cómodas de al menos 44 px.

### Checklist de validaciones

* [x] **HTML validado:** Marcado semántico conforme al estándar HTML5 del W3C, inclusión de textos alternativos descriptivos en etiquetas `<img>`, encabezados ordenados y ausencia de atributos de presentación en línea.
* [x] **CSS validado:** Sintaxis sin errores conforme a las especificaciones de CSS3, contraste de color verificado bajo estándares WCAG AA (mínimo 4.5:1 para texto normal) y reglas para modos de reducción de movimiento y alto contraste.
* [x] **Scripts de JavaScript funcionando:** Consola del navegador limpia de advertencias o errores sin capturar, modularización mediante funciones autoejecutables y comprobación de existencia de elementos en el DOM antes de manipularlos.

---

## 5. Etapa de implementación y documentación final

### Guía de despliegue

El proyecto no requiere bases de datos externas ni pasos de compilación con Node.js, lo que simplifica su puesta en marcha.

#### Despliegue en entorno local
Para probar la aplicación en una computadora personal y asegurar que el almacenamiento de sesión se comparta entre todas las páginas, se recomienda ejecutar un servidor web local:

1. Abrir una terminal o consola de comandos en la carpeta raíz `biblioteca_comunitaria/`.
2. Iniciar un servidor web con cualquiera de estas opciones:
   * **Con Python 3:**
     ```bash
     python3 -m http.server 8000
     ```
   * **Con Node.js (npx):**
     ```bash
     npx serve .
     ```
3. Abrir el navegador e ingresar a la dirección `http://localhost:8000`.

#### Despliegue en servidores web o plataformas estáticas
La aplicación puede alojarse en servicios gratuitos como GitHub Pages, Netlify o Vercel, o en servidores tradicionales con Apache o Nginx:

1. Mantener la estructura de carpetas intacta, verificando que los archivos `index.html`, `styles.css`, `auth.js`, `biblioteca.js`, la carpeta `datos/` y los directorios de imágenes y multimedia se encuentren en la raíz pública.
2. Comprobar que el servidor web entregue los archivos con codificación UTF-8.
3. Asegurar que los dispositivos de los usuarios dispongan de acceso a internet para descargar las fuentes y los iconos vectoriales de Google Fonts.

### Manual de usuario

#### Navegación general
Utilice la barra superior para recorrer las distintas secciones del portal. En teléfonos móviles, toque el icono de tres líneas en la esquina superior derecha para desplegar los enlaces de navegación.

#### Obtención de carnet vecinal e inicio de sesión
1. En la parte superior derecha de cualquier página, haga clic en **"Sacar mi carnet"** (o ingrese a `login.html#crear-cuenta`).
2. Ingrese su nombre y apellidos, un correo electrónico válido y una contraseña de al menos 8 caracteres.
3. Al pulsar **"Crear cuenta"**, el sistema le asignará un código de carnet vecinal con formato `VEC-2026-XXXXX` y mantendrá su sesión activa.
4. Para visitas futuras, seleccione la pestaña **"Iniciar sesión"** e ingrese su correo y contraseña registrados.

#### Consulta y reserva de libros
1. Diríjase a la sección **"Libros"** (`libros.html`).
2. Escriba en el buscador el título, autor o tema de su interés. Puede usar los botones de categorías (como Novela, Infantil, Historia o Poesía) y el menú desplegable **"Filtros"** para acotar por libros impresos o digitales.
3. Haga clic sobre el título de un libro para abrir la ventana con su sinopsis completa y número de copias.
4. Si tiene su sesión iniciada, pulse el botón **"Reservar"** para solicitar el préstamo a domicilio por dos semanas, o **"Pedir en sala"** para lectura en el local. Si cambia de opinión, pulse el botón nuevamente para cancelar la solicitud.

#### Donación de ejemplares
1. En el catálogo (`libros.html`), haga clic en el botón **"Donar libros"**.
2. Complete el formulario indicando el título, autor, año aproximado y estado de conservación del libro (nuevo, bueno o regular).
3. Envíe el formulario. En esa misma ventana podrá consultar si su donación se encuentra en revisión, o si ya fue aceptada por el personal de la biblioteca.

---

### Documentación administrativa

El panel administrativo está reservado para el personal encargado de la biblioteca.

#### Acceso al panel
1. Ingrese a `login.html` con las credenciales de administración predeterminadas:
   * **Correo:** `admin@leernosune.org`
   * **Contraseña:** `Admin2025!`
2. Tras autenticarse, el sistema lo dirigirá a `admin.html` y habilitará el botón **"Panel admin"** en el menú de navegación superior.

#### Gestión del catálogo de libros
* **Agregar un libro:** Complete el formulario situado en la sección *"Libros del catálogo"*, indicando título, autor, categorías, copias disponibles, formatos y la ruta de la imagen de portada (por ejemplo `img/mi-libro.jpg` o una dirección web externa). Pulse **"Guardar en catálogo"**.
* **Modificar un libro:** En la tabla de libros, busque la obra correspondiente y haga clic en **"Editar"**. El formulario se llenará con los datos del libro para que pueda corregir los textos o ajustar el número de copias.
* **Eliminar un libro:** Pulse el botón **"Quitar"** en la fila del libro. El sistema solicitará confirmación antes de retirar el registro.
* **Restaurar catálogo inicial:** Si desea descartar todos los cambios locales y volver a la lista original, haga clic en el botón **"Restaurar libros originales"**.
* **Guardar cambios de forma permanente:** Debido a que las modificaciones se guardan inicialmente en el almacenamiento local del navegador, haga clic en el botón **"Descargar libros actualizados"**. Esto generará un archivo llamado `libros.js`. Reemplace con este archivo el que se encuentra dentro de la carpeta `datos/` del proyecto para que las modificaciones queden registradas de manera definitiva en el código del sitio.

#### Revisión de donaciones recibidas
En la sección de donaciones del panel administrativo, el encargado puede revisar cada entrega propuesta por los vecinos:
* **Aceptar donación:** Al hacer clic en **"Aceptar"**, los datos del libro se copian automáticamente al formulario de libros para facilitar su incorporación al catálogo.
* **Rechazar donación:** Al pulsar **"Rechazar"**, se solicita un motivo breve (por ejemplo: "ejemplar deteriorado" o "título repetido"), el cual quedará visible para el vecino cuando consulte el estado de su trámite.

#### Control de préstamos y usuarios
* **Despacho de pedidos:** En la tabla de pedidos activos, el administrador puede revisar qué vecino solicitó cada obra y presionar **"Marcar despachado"** cuando el libro haya sido entregado.
* **Gestión de lectores:** Permite consultar los carnets activos, registrar nuevos usuarios manualmente o dar de baja cuentas que hayan cometido faltas a las normas de convivencia.

---

### Conclusiones del proyecto

#### Aprendizajes técnicos
Se logró construir una aplicación web completa y funcional sin necesidad de recurrir a librerías o frameworks externos. Se aplicó HTML5 semántico para estructurar la información, CSS3 con variables nativas y técnicas de maquetación con Grid y Flexbox para lograr un diseño adaptable a cualquier pantalla, y JavaScript modular para coordinar la interactividad, el catálogo y las sesiones de usuario.

#### Dificultades encontradas y soluciones
El principal desafío consistió en simular un sistema completo de roles, reservas, inventario y donaciones funcionando íntegramente en el navegador sin una base de datos conectada a un servidor. Esto se solucionó mediante el diseño estructurado de claves en `localStorage` y `sessionStorage`, incorporando una función hash que detecta si los datos del archivo base cambiaron para mantener sincronizado el catálogo. Asimismo, el diseño responsivo de tablas complejas en pantallas móviles se resolvió transformando las filas en fichas verticales individuales con estilos puros de CSS.

#### Mejoras futuras recomendadas
1. **Integración con backend y base de datos:** Conectar la aplicación a una API REST desarrollada en Java con Spring Boot y una base de datos PostgreSQL para compartir el inventario y las reservas en tiempo real entre múltiples dispositivos.
2. **Seguridad en la autenticación:** Implementar autenticación basada en tokens web (JWT) con contraseñas cifradas en servidor mediante algoritmos como bcrypt.
3. **Accesibilidad multimedia:** Incorporar archivos de subtítulos (`.vtt`) y transcripciones completas en texto para el video del recorrido institucional.
4. **Notificaciones automatizadas:** Agregar recordatorios automáticos de devolución mediante correo electrónico dos días antes del vencimiento del préstamo.

---

## Anexos

### Anexo A. Estructura de datos de un libro (`datos/libros.js`)

Cada ejemplar del catálogo se representa como un objeto de JavaScript con la siguiente estructura:

```javascript
{
  id: "cien-anos-de-soledad",
  titulo: "Cien años de soledad",
  autor: "Gabriel García Márquez",
  genero: "Novela / Realismo Mágico",
  icono: "menu_book",
  categorias: ["novela"],
  formatos: ["impreso", "ilustrado"],
  estado: "disponible", // disponible | sala | novedad | prestamo
  copias: 3,
  nota: 4.9,
  lectores: 48,
  descripcion: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo de Macondo. Edición ilustrada conmemorativa.",
  portada: "img/cien-anos-soledad.jpg"
}
```

### Anexo B. Claves de almacenamiento web utilizadas

| Clave | Almacenamiento | Contenido y propósito |
| :--- | :--- | :--- |
| `bibliotecaLibros` | `localStorage` | Arreglo de libros con modificaciones locales y valor de control hash del catálogo base. |
| `bibliotecaUsuarios` | `localStorage` | Listado de vecinos registrados con sus nombres, correos, claves y códigos de carnet. |
| `bibliotecaDonaciones` | `localStorage` | Historial de solicitudes de donación enviadas por los vecinos con su estado actual y motivo. |
| `bibliotecaPedidos` | `localStorage` | Registro de reservas a domicilio y pedidos en sala agrupados por correo de usuario. |
| `bibliotecaSesion` | `sessionStorage` | Datos del usuario actualmente conectado en la pestaña activa del navegador. |

### Anexo C. Cuentas de demostración del sistema

* **Cuenta de Administrador:**
  * Correo: `admin@leernosune.org`
  * Contraseña: `Admin2025!`
  * Rol: Acceso total al panel de administración (`admin.html`).
* **Cuenta de Vecino Lector (Ejemplo de registro):**
  * Carnet generado: `VEC-2026-XXXXX`
  * Rol: Usuario estándar con permisos de reserva, lectura en sala y donaciones.
