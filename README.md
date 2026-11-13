# 🏟️ Arena Paraná Sport - Sistema Integrado de Reservas

Plataforma web personalizada de gestión de turnos, control de acceso y catálogo comercial para el complejo deportivo **Arena Paraná Sport**. 

El sistema permite a los jugadores consultar disponibilidad en tiempo real y agendar turnos de forma autónoma, mientras que el personal del complejo gestiona los ingresos mediante un panel de control rápido sincronizado con una base de datos automatizada en Google Sheets.

---

## 🚀 Arquitectura y Tecnologías

El proyecto sigue una arquitectura **Serverless** ligera, eliminando costos fijos de alojamiento web y bases de datos tradicionales.

*   **Frontend (Cliente & Recepción):** HTML5, CSS3 (Vanilla), JavaScript (ES6+). Alojado en **GitHub Pages** (o dominio personalizado `.site`).
*   **Backend (API):** **Google Apps Script** (`Code.gs`). Procesa las peticiones `GET` (disponibilidad) y `POST` (reservas/check-in).
*   **Base de Datos:** **Google Sheets**. Actúa como CMS y base de datos relacional por mes.
*   **Notificaciones:** API nativa de **WhatsApp** (Redirección con texto preformateado).

---

## 🎯 Características Principales

### 1. Motor de Reservas (Frontend)
*   **Catálogo Visual:** Tarjetas de disciplinas (Futsal, Básquet, Vóley) con descripciones e íconos.
*   **Disponibilidad en Tiempo Real:** Filtra turnos pasados del día actual y bloquea horarios ya ocupados.
*   **Reglas de Negocio Deportivas (Cross-Filtering):** 
    *   Si se elige **Futsal**, el sistema bloquea automáticamente las opciones de canchas parciales (Cancha 1 y 2) obligando a reservar la *Cancha Principal / Completa*.
    *   La reserva de una *Cancha Parcial* bloquea la disponibilidad de la *Cancha Completa* en ese mismo horario, y viceversa.
*   **Comprobante Inteligente:** Tras reservar, el formulario se limpia automáticamente (para evitar duplicados) y genera una tarjeta de confirmación con el código único `#APS-XXXX` y un botón para enviar los datos por WhatsApp.

### 2. Panel de Recepción (Check-in)
*   **Portal de Ingreso (`ingreso.html`):** Interfaz oculta optimizada para celulares y tablets en mostrador.
*   **Validación Express:** Input numérico con soporte para la tecla `Enter`.
*   **Estadísticas del Día:** Muestra contadores en vivo de turnos *Confirmados* y *Pendientes* del día actual.
*   **Agenda Cronológica:** Renderiza la lista de turnos del día ordenados por horario de inicio, indicando responsable, cancha y estado.
*   **Prevención de Fraudes:** Bloquea códigos cancelados, códigos de otros días o códigos que ya ingresaron previamente.

### 3. Automatización de Base de Datos (Backend)
*   **Generación Mensual Automática:** Si entra un turno de un mes nuevo (ej. Enero 2027), el script crea la pestaña automáticamente con cabeceras formateadas y paneles inmovilizados.
*   **Validación de Datos (Desplegables):** Las pestañas nuevas se generan con menús desplegables integrados (`DataValidation`) para Horarios, Canchas y Estados, garantizando que la carga manual de turnos fijos no tenga errores tipográficos.
*   **Protección Anti-Superposición (LockService):** Implementa `LockService.getScriptLock()` para evitar que dos usuarios reserven el mismo horario en el mismo milisegundo.

---

## 📂 Estructura del Proyecto

```text
arena-parana-sport/
├── index.html       # Landing page y formulario de reservas
├── ingreso.html     # Panel de control de acceso para la recepción
├── styles.css       # Hoja de estilos principal (variables CSS, UI/UX)
├── app.js           # Lógica del frontend (fetch, UI, validaciones)
├── Code.gs          # (Ubicado en Google Apps Script) Backend API
└── README.md        # Documentación del proyecto
```

---

## ⚙️ Guía de Instalación y Despliegue

### Paso 1: Configurar Google Sheets y Apps Script
1. Crear una nueva hoja de cálculo en Google Sheets (Idealmente desde la cuenta del cliente).
2. Ir a `Extensiones > Apps Script`.
3. Borrar el código por defecto y pegar el contenido completo de `Code.gs`.
4. Guardar (icono de disquete).
5. Ir a **Implementar > Nueva implementación**.
    *   Tipo: *Aplicación web*.
    *   Ejecutar como: *Yo*.
    *   Quién tiene acceso: *Cualquier persona*.
6. Autorizar los permisos de Google.
7. Copiar la **URL de la aplicación web** (Ej: `https://script.google.com/macros/s/.../exec`).

*(Nota: Para futuras actualizaciones del código `.gs`, usar siempre **Implementar > Administrar implementaciones > Editar (Lápiz) > Nueva versión** para mantener la misma URL).*

### Paso 2: Configurar el Frontend
1. Abrir `app.js` y buscar la constante `SCRIPT_URL`. Pegar allí la URL obtenida en el Paso 1.
2. Abrir `app.js` y buscar la variable `phoneNumber` (dentro de la función `generateReservation`). Actualizar al número de WhatsApp oficial del complejo.
3. Abrir `ingreso.html` y actualizar también la constante `SCRIPT_URL`.

### Paso 3: Despliegue en GitHub Pages
1. Subir los archivos (`index.html`, `ingreso.html`, `styles.css`, `app.js`) a un repositorio en GitHub.
2. Ir a `Settings > Pages`.
3. Seleccionar la rama `main` y guardar.
4. (Opcional) Configurar el dominio personalizado `.site` en la sección de *Custom domain* y ajustar los DNS en el proveedor de dominios.

---

## 🛠️ Mantenimiento y Operación Diaria

*   **Gestión de Turnos Manuales:** El personal de recepción debe usar los menús desplegables en Google Sheets para cargar turnos presenciales o telefónicos. Si la fecha, horario o cancha no coincide exactamente con el formato, el sistema no lo bloqueará en la web.
*   **Ausencias (No-Show):** Si un cliente reserva por la web (estado *Pendiente*) pero no envía el mensaje de WhatsApp tras un tiempo prudencial (ej. 15-30 minutos), el encargado debe cambiar el estado en Google Sheets a **Cancelado** para liberar inmediatamente el horario en la web.
*   **Actualización de Caché:** Al realizar cambios en `app.js` o `styles.css`, se recomienda actualizar el query string en `index.html` (ej. `<script src="app.js?v=23"></script>`) para forzar la actualización en los dispositivos móviles de los clientes frecuentes.

---

## 👨‍💻 Autor

Desarrollado por **Ignacio Avilés Peltzer**
*Soluciones Web y Automatización Comercial*
