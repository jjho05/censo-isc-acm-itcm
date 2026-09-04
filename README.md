# Censo y Diagnóstico Estudiantil ISC 2026–2027
### Capítulo Estudiantil ACM • Instituto Tecnológico de Ciudad Madero (TecNM)

Plataforma web interactiva para el levantamiento censal y diagnóstico académico, técnico y de infraestructura de la carrera de **Ingeniería en Sistemas Computacionales (ITCM)** para el periodo de gestión **2026–2027**.

---

## 🏛️ Características Principales

- **Instrumento Científico en 11 Módulos (52 Reactivos / 78 Variables)**: Diagnóstico integral sin sesgos, diseñado para recabar datos sobre trayectoria, infraestructura, competencias de software, inteligencia artificial, materias críticas y propuestas.
- **Evaluación Multidimensional Responsiva**:
  - Vista de tabla (`.matrix-table`) para pantallas de escritorio y tablets.
  - Conversión táctil en tarjetas con píldoras interactivas (`.matrix-pill-opt`) para dispositivos móviles.
- **Protección Estricta de Privacidad (PII)**:
  - Número de control y correo solicitados únicamente para control de padrón y deduplicación.
  - Endpoints públicos anonimizados (`/api/stats` y `/api/respuestas`).
  - Padrón completo accesible únicamente mediante clave de administración (`x-admin-key`).
- **Autoguardado Automático (Borrador Local)**: Guarda el progreso del estudiante en `localStorage` en tiempo real para evitar pérdida de datos si se cierra el navegador.
- **Cockpit Ejecutivo de Inteligencia (`/dashboard`)**:
  - Métricas y KPIs en tiempo real con Chart.js.
  - Explorador reactivo por reactivo para las 78 variables.
  - Banco de reclutamiento de comités y buzón abierto de propuestas.
- **Exportación Directa a Excel**: Descarga de dataset en `.csv` con formato UTF-8 BOM listo para abrir en Microsoft Excel sin problemas de acentos.
- **Sincronización Opcional con Google Sheets**: Envío simultáneo mediante Webhook de Google Apps Script.

---

## 🚀 Despliegue Rápido en la Nube (Render.com)

1. Conecta este repositorio en [Render.com](https://render.com) como **Web Service** gratuito.
2. Configura:
   - **Environment:** `Node`
   - **Build Command:** *(dejar vacío o `npm install`)*
   - **Start Command:** `node server.js`
3. ¡Listo! Render te entregará una URL HTTPS pública (ej. `https://censo-isc-acm-itcm.onrender.com`).

---

## 💻 Ejecución Local

```bash
# Iniciar el servidor localmente
node server.js
```

- **Encuesta para estudiantes:** `http://localhost:3000`
- **Dashboard Ejecutivo:** `http://localhost:3000/dashboard`
- **Descarga Excel:** `http://localhost:3000/api/export-csv?key=acm2026`

---

## 📁 Estructura del Proyecto

```text
censo-isc-acm-itcm/
├── api/                  # Serverless functions para Vercel
│   ├── submit.js
│   └── stats.js
├── datos/                # Almacenamiento local atómico
│   ├── respuestas.json   # Base de datos en JSON
│   └── respuestas.csv    # Exportable para Excel
├── docs/                 # Documentación metodológica en texto plano
├── public/               # Frontend interactivo
│   ├── index.html        # Formulario Wizard de 11 pasos
│   ├── dashboard.html    # Cockpit de analítica ejecutiva
│   ├── app.js            # Lógica de cliente y autoguardado
│   ├── dashboard.js      # Lógica de gráficas con Chart.js
│   ├── styles.css        # Sistema de diseño TecNM / ACM
│   └── catalogo_completo_preguntas.json
├── scripts/              # Webhooks para Google Sheets y utilidades
├── server.js             # Servidor nativo Node.js (Zero Dependencies)
└── vercel.json           # Configuración para despliegue en Vercel
```

---

## 🔐 Acceso Administrativo al Dashboard

- **Claves de acceso preconfiguradas:** `acm2026`, `olvera2026`, `itcm2026`
- **Descarga de Padrón:** Requiere clave de administración en la URL (`?key=acm2026`) o vía cabecera `x-admin-key`.
