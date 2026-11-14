# 🏟️ Sistema Integrado de Reservas

Plataforma web personalizada de gestión de turnos, control de acceso, cancelación autónoma y catálogo comercial para el complejo deportivo **Arena Paraná Sport**.

El sistema permite a los jugadores consultar disponibilidad en tiempo real, agendar turnos de forma autónoma y cancelar reservas con un solo código, mientras que el personal del complejo gestiona los ingresos mediante un panel de control rápido sincronizado con una base de datos automatizada en Google Sheets.

## 🚀 Arquitectura y Tecnologías

El proyecto sigue una arquitectura **Serverless** ligera, eliminando costos fijos de alojamiento web y bases de datos tradicionales.

* **Frontend (Cliente, Recepción & Cancelación):** HTML5, CSS3 (Vanilla), JavaScript (ES6+). Alojado en **GitHub Pages** (o dominio personalizado `.site`).

* **Backend (API):** **Google Apps Script** (`Code.gs`). Procesa las peticiones `GET` (disponibilidad y resumen diario) y `POST` (reservas, check-in y cancelaciones autónomas).

* **Base de Datos:** **Google Sheets**. Actúa como CMS y base de datos relacional por mes.

* **Notificaciones:** API nativa de **WhatsApp** (Redirección con texto preformateado).

## 🎯 Características Principales

### 1. Motor de Reservas (Frontend)

* **Catálogo Visual:** Tarjetas de disciplinas (Futsal, Básquet, Vóley) con descripciones e íconos.

* **Disponibilidad en Tiempo Real:** Filtra turnos pasados del día actual y bloquea horarios ya ocupados.

* **Reglas de Negocio Deportivas (Cross-Filtering):**

  * Si se elige **Futsal**, el sistema bloquea automáticamente las opciones de canchas parciales (Cancha 1 y 2) obligando a reservar la *Cancha Principal / Completa*.

  * La reserva de una *Cancha Parcial* bloquea la disponibilidad de la *Cancha Completa* en ese mismo horario, y viceversa.

* **Comprobante Inteligente:** Tras reservar, el formulario se limpia automáticamente (para evitar duplicados) y genera una tarjeta de confirmación con el código único `#APS-XXXX` y un botón para enviar los datos por WhatsApp.

### 2. Portal de Cancelación Autónoma (`cancelar.html`)

* **Autogestión del Cliente:** Permite a los usuarios liberar su cancha ingresando únicamente su código de reserva (ej. `#APS-4821`).

* **Validación de Estado:** El sistema verifica que el turno exista, no esté ya cancelado y no haya sido utilizado (*Confirmado*), actualizando el estado en la planilla de forma inmediata y re-habilitando el horario en la web.

### 3. Panel de Recepción y Control de Acceso (`ingreso.html`)

* **Portal de Ingreso en Mostrador:** Interfaz optimizada para dispositivos móviles y tablets en puerta.

* **Validación Express:** Input numérico con soporte para la tecla `Enter`.

* **Estadísticas del Día:** Muestra contadores en vivo de turnos *Confirmados* y *Pendientes* del día actual.

* **Agenda Cronológica:** Renderiza y ordena automáticamente por horario la lista de turnos del día, indicando responsable, cancha y estado.

* **Prevención de Fraudes:** Bloquea códigos cancelados, códigos de fechas ajenas o códigos que ya ingresaron previamente.

### 4. Automatización de Base de Datos (Backend)

* **Generación Mensual Automática:** Si entra un turno de un mes nuevo (ej. Enero 2027), el script crea la pestaña automáticamente con cabeceras formateadas y paneles inmovilizados.

* **Validación de Datos (Desplegables):** Las pestañas nuevas se generan con menús desplegables integrados (`DataValidation`) para Horarios, Canchas y Estados, garantizando que la carga manual de turnos fijos no tenga errores tipográficos.

* **Protección Anti-Superposición (LockService):** Implementa `LockService.getScriptLock()` para evitar que dos usuarios reserven el mismo horario en el mismo milisegundo.

## 📂 Estructura del Proyecto

```
arena-parana-sport/
├── index.html       # Landing page, formulario de reservas y acceso a cancelación
├── ingreso.html     # Panel de control de acceso y agenda en tiempo real para recepción
├── cancelar.html    # Portal web para la autogestión de cancelación de turnos
├── styles.css       # Hoja de estilos principal (variables CSS, UI/UX)
├── Code.gs          # Backend API (Google Apps Script: reservas, check-in, cancelación)
└── README.md        # Documentación del proyecto
```

## ⚙️ Guía de Instalación y Despliegue

### Paso 1: Configurar Google Sheets y Apps Script

1. Crear una nueva hoja de cálculo en Google Sheets (Idealmente desde la cuenta del cliente).

2. Ir a `Extensiones > Apps Script`.

3. Borrar el código por defecto y pegar el contenido completo de `Code.gs`.

4. Guardar (icono de disquete).

5. Ir a **Implementar > Nueva implementación**.

   * Tipo: *Aplicación web*.

   * Ejecutar como: *Yo*.

   * Quién tiene acceso: *Cualquier persona*.

6. Autorizar los permisos de Google.

7. Copiar la **URL de la aplicación web** (Ej: `https://script.google.com/macros/s/.../exec`).

*(Nota: Para futuras actualizaciones del código `.gs`, usar siempre **Implementar > Administrar implementaciones > Editar (Lápiz) > Nueva versión** para mantener la misma URL).*

### Paso 2: Configurar el Frontend

1. Abrir `app.js` (o `index.html`) y `cancelar.html` para asegurar que las constantes `SCRIPT_URL` apunten a la URL de Google Apps Script.

2. Verificar el número de WhatsApp oficial del complejo en la lógica de generación de reservas.

### Paso 3: Despliegue en GitHub Pages

1. Subir los archivos (`index.html`, `ingreso.html`, `cancelar.html`, `styles.css`, `app.js`) a un repositorio en GitHub.

2. Ir a `Settings > Pages`.

3. Seleccionar la rama `main` y guardar.

4. (Opcional) Configurar el dominio personalizado `.site` en la sección de *Custom domain*.

## 🛠️ Mantenimiento y Operación Diaria

* **Gestión de Turnos Manuales:** El personal de recepción debe usar los menús desplegables en Google Sheets para cargar turnos presenciales o telefónicos.

* **Liberación de Horarios:** Gracias al portal de cancelación autónoma, los usuarios liberan sus turnos por código. Si el complejo debe cancelar manualmente, basta con cambiar el estado en Google Sheets a **Cancelado** para que el horario vuelva a estar disponible en la web.

* **Actualización de Caché:** Al realizar cambios en scripts o estilos, actualizar los query strings de versión en `index.html` (ej. `<script src="app.js?v=23"></script>`).

## 👨‍💻 Autor

Desarrollado por **Ignacio Avilés Peltzer**  
*Soluciones Web y Automatización Comercial*
