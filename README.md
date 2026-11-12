# 🏟️ Arena Paraná Sport — Plataforma Web y Gestión de Turnos

Plataforma web oficial y sistema automatizado de reservas para el complejo deportivo **Arena Paraná Sport** (Juan Morath 10, Esq. Almafuerte, Paraná, Entre Ríos).

El proyecto está diseñado bajo una arquitectura **100% serverless y sin costos fijos de infraestructura**, combinando un frontend estático de alto rendimiento con **Google Apps Script** y **Google Sheets** como base de datos automatizada, e integración directa con **WhatsApp** e **Instagram**.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid, Glassmorphism) y JavaScript Vanilla (ES6+).
* **Alojamiento:** GitHub Pages con soporte para dominio personalizado y certificado SSL.
* **Backend / API:** Google Apps Script (Web App desplegada como endpoint `/exec`).
* **Base de Datos:** Google Sheets con automatización de pestañas mensuales y ordenamiento cronológico.
* **Integraciones:** WhatsApp API (`api.whatsapp.com/send`), Instagram (`@arenaparanasport`) y Google Maps Embed.

---

## 📂 Estructura del Proyecto

```text
/
├── index.html                                            # Estructura principal, SEO, Open Graph y formularios
├── styles.css                                            # Estilos globales, variables de marca y diseño responsive
├── app.js                                                # Lógica de UI, renderizado dinámico, reservas y fetch API
├── 813021210_18113448151858751_1309644951589697854_n.jpg # Logo oficial y favicon
├── igexport-Dd3uJvZRFdY.mp4                              # Video recorrido: Vestuarios y sanitarios
├── igexport-Dd9oF_IStvF.mp4                              # Video recorrido: Cancha principal y tribunas
└── README.md                                             # Documentación técnica del proyecto
```

---

## ⚙️ Arquitectura y Flujo de Datos

El sistema evita la necesidad de un servidor tradicional mediante el siguiente flujo:

1. **Captura en Frontend (`app.js`):** El usuario completa el formulario de reserva (disciplina, cancha, modalidad, fecha, bloque horario de 1 hora y nombre del responsable).
2. **Generación de ID Único:** Se genera un código de referencia aleatorio con formato `#APS-XXXX` (ej. `#APS-4821`) para vincular el mensaje de chat con el registro en la base de datos.
3. **Envío Asíncrono a Google Sheets:** Mediante `fetch()`, se envía un payload JSON al endpoint de Google Apps Script.
4. **Redirección a WhatsApp:** En paralelo, se abre una pestaña hacia la API de WhatsApp con un mensaje prearmado que contiene el código `#APS-XXXX` y todos los detalles del turno.
5. **Procesamiento en Backend (`doPost`):** Google Apps Script recibe el JSON, detecta el mes del turno, crea la pestaña mensual si no existe, inserta la fila y reordena toda la hoja cronológicamente.

---

## 💻 Guía del Frontend (`index.html`, `styles.css`, `app.js`)

### ⚠️ Regla Crítica: Control de Caché (Cache Busting)
Dado que los navegadores móviles (especialmente dentro de Instagram/WhatsApp) cachean agresivamente los archivos estáticos, **`index.html` utiliza parámetros de versión en las importaciones**:

```html
<link rel="stylesheet" href="styles.css?v=24">
<script src="app.js?v=16"></script>
```
> **Importante:** Cada vez que modifiques `styles.css` o `app.js`, **incrementá el número de versión** (`?v=25`, `?v=17`, etc.) en `index.html` para garantizar que todos los usuarios vean los cambios de inmediato.

### Funciones Principales en `app.js`

* `renderSports()`: Renderiza dinámicamente las tarjetas de disciplinas (`Futsal`, `Básquet`, `Vóley`) a partir del array `sportsData`. *(Nota: Los precios están intencionalmente omitidos en estas tarjetas para centralizar las tarifas en su propia sección).*
* `selectSportFromCard(sportName)` / `selectModality(modalityName)`: Autocompletan los `<select>` del formulario y hacen scroll suave hasta `#reservas`.
* `generateReservation(event)`: Valida campos, genera `#APS-XXXX`, dispara el `POST` hacia `scriptURL` y abre WhatsApp.
* `initMobileMenu()`: Controla el menú hamburguesa en viewports menores a `768px`, cerrándolo automáticamente al seleccionar un enlace o tocar fuera del header.
* `initScrollReveal()` & `initScrollSpy()`: Manejan las animaciones de aparición (`IntersectionObserver`) y el resaltado activo de la barra de navegación.

### Variables de Configuración Rápida en `app.js`
Si necesitás cambiar el destino de las reservas o el número de contacto, editá estas constantes dentro de `generateReservation()`:
* `scriptURL`: URL del Web App de Google Apps Script (`/exec`).
* `phoneNumber`: Número oficial de WhatsApp en formato internacional sin `+` (ej. `'5493434717233'`).

*(Recordá actualizar también el atributo `href` y `data-whatsapp-number` del botón flotante `.whatsapp-float` en `index.html`).*

---

## 🗄️ Backend: Google Apps Script (`Code.gs`)

El script está vinculado directamente como **script contenedor** dentro de la planilla de Google Sheets (*Extensiones > Apps Script*), por lo que utiliza `SpreadsheetApp.getActiveSpreadsheet()` sin depender de IDs externos.

### Código Fuente de Producción (Respaldo)

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // 1. Determinar pestaña según mes y año del turno
    var meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    var fechaTurnoObj = new Date();
    var nombrePestana = 'Turnos';

    if (data.date && data.date.indexOf('-') !== -1) {
      var partes = data.date.split('-'); // [YYYY, MM, DD]
      var anio = parseInt(partes[0], 10);
      var mesIndex = parseInt(partes[1], 10) - 1;
      var dia = parseInt(partes[2], 10);
      
      fechaTurnoObj = new Date(anio, mesIndex, dia);
      nombrePestana = meses[mesIndex] + ' ' + anio; // Ej: "Noviembre 2026"
    }

    // 2. Obtener o crear pestaña mensual con formato corporativo
    var sheet = ss.getSheetByName(nombrePestana);
    if (!sheet) {
      sheet = ss.insertSheet(nombrePestana);
      
      var headers = [
        'Fecha de Registro',
        'Código',
        'Fecha del Turno',
        'Horario',
        'Cancha',
        'Disciplina',
        'Modalidad',
        'Responsable',
        'Estado'
      ];
      sheet.appendRow(headers);
      
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#16161c')
                 .setFontColor('#ccff00')
                 .setFontWeight('bold')
                 .setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // 3. Insertar registro
    sheet.appendRow([
      new Date(),
      data.refCode || '-',
      fechaTurnoObj,
      data.time || '-',
      data.court || '-',
      data.sport || '-',
      data.modality || '-',
      data.name || 'Sin nombre',
      'Pendiente'
    ]);

    // 4. Formatear y ordenar cronológicamente (Fecha del Turno -> Horario)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat('dd/MM/yyyy HH:mm');
      sheet.getRange(2, 3, lastRow - 1, 1).setNumberFormat('dd/MM/yyyy');
      sheet.getRange(2, 1, lastRow - 1, 9).setHorizontalAlignment('center');
      
      sheet.getRange(2, 1, lastRow - 1, 9).sort([
        {column: 3, ascending: true},
        {column: 4, ascending: true}
      ]);
    }

    sheet.autoResizeColumns(1, 9);

    return ContentService.createTextOutput("OK");
  } catch(err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}
```

### Notas Técnicas sobre CORS y Despliegue
1. **Por qué se usa `mode: 'no-cors'` y `text/plain`:** Google Apps Script realiza redirecciones `302` en respuestas `POST` que provocan bloqueos CORS en navegadores si se envía `application/json`. Al enviar el cuerpo serializado como `text/plain;charset=utf-8` con `mode: 'no-cors'`, el navegador ejecuta la petición sin *preflight* y `e.postData.contents` recibe el JSON intacto.
2. **Cómo actualizar el Apps Script sin romper la URL:** Si se edita el script en el futuro, ir a **Implementar > Gestionar implementaciones**, hacer clic en el ícono de **Editar (lápiz)** y seleccionar **Nueva versión** en el desplegable. Esto actualiza el código manteniendo exactamente la misma URL `/exec`.
3. **Permisos:** La aplicación web debe estar configurada como *Ejecutar como: Yo (propietario de la planilla)* y *Quién tiene acceso: Cualquier persona*.

---

## 🔧 Tareas Frecuentes de Mantenimiento

* **Actualizar tarifas:** Modificar los montos visibles en la sección `#precios` y los `<option>` de `#res-modality` dentro de `index.html`, además de los parámetros de `selectModality(...)`.
* **Actualizar vista previa en redes (Open Graph):** Verificar que la meta etiqueta `<meta property="og:image" content="...">` en el `<head>` de `index.html` apunte a la URL absoluta (`https://...`) del dominio activo.
* **Sincronización de nombres de deportes:** Los `value` de `<select id="res-sport">` en `index.html` (`Futsal`, `Básquet`, `Vóley`) deben coincidir exactamente con la propiedad `name` de los objetos en `sportsData` dentro de `app.js`.

---

## 👨‍💻 Créditos

* **Diseño, Arquitectura y Desarrollo:** Ignacio Avilés Peltzer
* **Cliente:** Arena Paraná Sport — Paraná, Entre Ríos, Argentina.
