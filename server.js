/**
 * ============================================================================
 * SERVIDOR NATIVO SOBERANO: ENCUESTA DE FORMACIÓN ISC ACM ITCM 2026–2027
 * ============================================================================
 * Autor: Jesús Javier Hernández Olvera (N.C. 23070477)
 * Arquitectura: Node.js Nativo (Zero Dependencies / 100% Portátil)
 * Endpoints:
 *   - GET  /                  -> Formulario web responsive para alumnos (25 preguntas)
 *   - GET  /dashboard         -> Panel de resultados en vivo para gestión y campaña
 *   - POST /api/submit        -> Recepción y guardado de respuestas (JSON + CSV)
 *   - GET  /api/stats         -> Métricas y KPIs agregados en tiempo real
 *   - GET  /api/respuestas    -> Dataset de respuestas (anonimizado en modo público)
 *   - GET  /api/export-csv    -> Descarga del dataset completo para Excel (con clave de admin)
 *   - GET  /api/voluntarios   -> Directorio de alumnos que desean integrarse a comités
 *   - GET  /api/sync-sheets   -> Endpoint manual para forzar sincronización con Google Sheets
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'datos');
const JSON_FILE = path.join(DATA_DIR, 'respuestas.json');
const CSV_FILE = path.join(DATA_DIR, 'respuestas.csv');

// Claves de administración autorizadas
const ADMIN_KEYS = new Set(['acm2026', 'olvera2026', 'itcm2026']);

// Asegurar existencia del directorio de datos y archivos base
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(JSON_FILE)) {
  fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Encabezados oficiales de las 25 preguntas sintetizadas
const CSV_HEADERS = [
  "timestamp",
  "fechaActualizacion",
  "id",
  "numeroControl",
  "correo",
  "semestre",
  "turno",
  "situacion_laboral",
  "rec_pc",
  "satisfaccion_practica",
  "materias_dificultad",
  "experiencias_proyectos",
  "eq_coordinacion",
  "eq_codigo_ajeno",
  "eq_git_compartido",
  "eq_revision_pares",
  "eq_conflictos",
  "dom_programacion",
  "dom_git",
  "dom_debugging",
  "dom_testing",
  "dom_linux",
  "dom_db_apis",
  "dom_docs",
  "dom_aprender_tech",
  "fuente_aprendizaje",
  "habilidades_fuera_aula",
  "ing_tecnico",
  "conf_explicar_proyecto",
  "conf_codigo_existente",
  "conf_aprender_tech",
  "conf_trabajo_equipo",
  "conf_entrevista_tecnica",
  "preparacion_laboral_general",
  "experiencia_entrevistas",
  "portafolio_github",
  "uso_ia",
  "desarrollo_software_comunitario",
  "interes_talleres",
  "formato_eventos_masivos",
  "disponibilidad_actividades",
  "voluntariado_comites",
  "propuesta_cambio_unico"
];

if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, '\ufeff' + CSV_HEADERS.map(h => `"${h}"`).join(',') + '\n', 'utf8');
}

// Tipos MIME para servir archivos estáticos
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8'
};

// Rate Limiting en memoria: Máximo 30 peticiones por minuto por IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

// Limpieza periódica del mapa de Rate Limit cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function esAdminAutorizado(req, parsedUrl) {
  const headerKey = req.headers['x-admin-key'];
  if (headerKey && ADMIN_KEYS.has(headerKey.trim())) return true;
  const queryKey = parsedUrl.searchParams.get('key');
  if (queryKey && ADMIN_KEYS.has(queryKey.trim())) return true;
  return false;
}

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
}

function leerRespuestas() {
  try {
    if (!fs.existsSync(JSON_FILE)) return [];
    const data = fs.readFileSync(JSON_FILE, 'utf8').trim();
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[!] Error leyendo respuestas.json:', err.message);
    return [];
  }
}

function escaparCSV(valor) {
  if (valor === undefined || valor === null) return '""';
  if (Array.isArray(valor)) {
    valor = valor.join('; ');
  }
  const str = String(valor).replace(/"/g, '""');
  return `"${str}"`;
}

function guardarRespuesta(nueva) {
  const respuestas = leerRespuestas();
  
  if (!nueva.id) {
    nueva.id = 'resp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  }

  // Deduplicación por número de control
  const ncUpper = nueva.numeroControl ? String(nueva.numeroControl).trim().toUpperCase() : '';
  const tieneControl = ncUpper.length >= 8 && ncUpper !== 'ANÓNIMO';
  const index = tieneControl ? respuestas.findIndex(r => String(r.numeroControl).trim().toUpperCase() === ncUpper) : -1;
  
  if (index >= 0) {
    respuestas[index] = { ...respuestas[index], ...nueva, fechaActualizacion: new Date().toISOString() };
  } else {
    nueva.timestamp = new Date().toISOString();
    respuestas.push(nueva);
  }
  
  // Escritura atómica en JSON
  const tempJson = JSON_FILE + '.tmp';
  fs.writeFileSync(tempJson, JSON.stringify(respuestas, null, 2), 'utf8');
  fs.renameSync(tempJson, JSON_FILE);
  
  // Regenerar CSV completo con escritura atómica
  const csvLines = [CSV_HEADERS.map(h => `"${h}"`).join(',')];
  respuestas.forEach(r => {
    const line = CSV_HEADERS.map(header => escaparCSV(r[header]));
    csvLines.push(line.join(','));
  });
  const tempCsv = CSV_FILE + '.tmp';
  fs.writeFileSync(tempCsv, '\ufeff' + csvLines.join('\n') + '\n', 'utf8');
  fs.renameSync(tempCsv, CSV_FILE);

  // Auto-backup cada 25 encuestas
  if (respuestas.length > 0 && respuestas.length % 25 === 0) {
    try {
      const backupPath = path.join(DATA_DIR, `respuestas_backup_${respuestas.length}.json`);
      fs.copyFileSync(JSON_FILE, backupPath);
      console.log(`[+] Auto-backup generado: ${backupPath}`);
    } catch (e) {
      console.error('Error generando auto-backup:', e.message);
    }
  }
  
  return { esActualizacion: index >= 0, total: respuestas.length };
}

function calcularEstadisticas(respuestas) {
  const total = respuestas.length;
  if (total === 0) {
    return { total: 0 };
  }

  // Diccionarios de conteo para cada variable
  const conteoSemestre = {};
  const conteoTurno = {};
  const conteoSituacionLaboral = {};
  const conteoRecPc = {};
  const conteoSatisfaccionPractica = {};
  const conteoMaterias = {};
  const conteoExperienciasProyectos = {};
  const conteoFuenteAprendizaje = {};
  const conteoHabilidadesFueraAula = {};
  const conteoIngTecnico = {};
  const conteoPreparacionLaboral = {};
  const conteoExperienciaEntrevistas = {};
  const conteoPortafolioGithub = {};
  const conteoUsoIA = {};
  const conteoDesarrolloSoftwareComunitario = {};
  const conteoInteresTalleres = {};
  const conteoFormatoEventosMasivos = {};
  const conteoDisponibilidadActividades = {};
  const conteoVoluntariadoComites = {};

  // Matrices
  const conteoDinamicasEquipo = {};
  const conteoDominioHerramientas = {};
  const conteoConfianzaSituaciones = {};

  const buzonAbierto = [];
  const directorioVoluntarios = [];

  function addCount(val, map) {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(v => {
        const item = String(v).trim();
        if (item) map[item] = (map[item] || 0) + 1;
      });
    } else {
      const item = String(val).trim();
      if (item) map[item] = (map[item] || 0) + 1;
    }
  }

  respuestas.forEach(r => {
    addCount(r.semestre, conteoSemestre);
    addCount(r.turno, conteoTurno);
    addCount(r.situacion_laboral, conteoSituacionLaboral);
    addCount(r.rec_pc, conteoRecPc);
    addCount(r.satisfaccion_practica, conteoSatisfaccionPractica);
    addCount(r.materias_dificultad, conteoMaterias);
    addCount(r.experiencias_proyectos, conteoExperienciasProyectos);
    addCount(r.fuente_aprendizaje, conteoFuenteAprendizaje);
    addCount(r.habilidades_fuera_aula, conteoHabilidadesFueraAula);
    addCount(r.ing_tecnico, conteoIngTecnico);
    addCount(r.preparacion_laboral_general, conteoPreparacionLaboral);
    addCount(r.experiencia_entrevistas, conteoExperienciaEntrevistas);
    addCount(r.portafolio_github, conteoPortafolioGithub);
    addCount(r.uso_ia, conteoUsoIA);
    addCount(r.desarrollo_software_comunitario, conteoDesarrolloSoftwareComunitario);
    addCount(r.interes_talleres, conteoInteresTalleres);
    addCount(r.formato_eventos_masivos, conteoFormatoEventosMasivos);
    addCount(r.disponibilidad_actividades, conteoDisponibilidadActividades);
    addCount(r.voluntariado_comites, conteoVoluntariadoComites);

    // Subcampos de matrices
    ['eq_coordinacion', 'eq_codigo_ajeno', 'eq_git_compartido', 'eq_revision_pares', 'eq_conflictos'].forEach(k => {
      if (r[k]) {
        if (!conteoDinamicasEquipo[k]) conteoDinamicasEquipo[k] = {};
        addCount(r[k], conteoDinamicasEquipo[k]);
      }
    });

    ['dom_programacion', 'dom_git', 'dom_debugging', 'dom_testing', 'dom_linux', 'dom_db_apis', 'dom_docs', 'dom_aprender_tech'].forEach(k => {
      if (r[k]) {
        if (!conteoDominioHerramientas[k]) conteoDominioHerramientas[k] = {};
        addCount(r[k], conteoDominioHerramientas[k]);
      }
    });

    ['conf_explicar_proyecto', 'conf_codigo_existente', 'conf_aprender_tech', 'conf_trabajo_equipo', 'conf_entrevista_tecnica'].forEach(k => {
      if (r[k]) {
        if (!conteoConfianzaSituaciones[k]) conteoConfianzaSituaciones[k] = {};
        addCount(r[k], conteoConfianzaSituaciones[k]);
      }
    });

    // Voluntariado
    const comitesVal = r.voluntariado_comites;
    if (comitesVal) {
      const arr = Array.isArray(comitesVal) ? comitesVal : [comitesVal];
      const esVoluntario = arr.some(c => {
        const str = String(c).toLowerCase();
        return str.includes("comité") || (str.length > 5 && !str.includes("asistente") && !str.includes("no deseo"));
      });

      if (esVoluntario) {
        directorioVoluntarios.push({
          numeroControl: r.numeroControl || '-',
          correo: r.correo || '-',
          semestre: r.semestre || '-',
          comites: arr,
          timestamp: r.timestamp
        });
      }
    }

    // Buzón de propuestas (Pregunta 25)
    const prop = (r.propuesta_cambio_unico || '').trim();
    if (prop && prop.length > 3) {
      buzonAbierto.push({
        texto: prop,
        semestre: r.semestre || 'Semestre no especificado',
        timestamp: r.timestamp
      });
    }
  });

  return {
    total,
    totalVoluntarios: directorioVoluntarios.length,
    conteoSemestre,
    conteoTurno,
    conteoSituacionLaboral,
    conteoRecPc,
    conteoSatisfaccionPractica,
    conteoMaterias,
    conteoExperienciasProyectos,
    conteoDinamicasEquipo,
    conteoDominioHerramientas,
    conteoFuenteAprendizaje,
    conteoHabilidadesFueraAula,
    conteoIngTecnico,
    conteoConfianzaSituaciones,
    conteoPreparacionLaboral,
    conteoExperienciaEntrevistas,
    conteoPortafolioGithub,
    conteoUsoIA,
    conteoDesarrolloSoftwareComunitario,
    conteoInteresTalleres,
    conteoFormatoEventosMasivos,
    conteoDisponibilidadActividades,
    conteoVoluntariadoComites,
    // Alias para retrocompatibilidad con gráficas existentes
    conteoSoberania: conteoDesarrolloSoftwareComunitario,
    conteoTalleres: conteoInteresTalleres,
    conteoEventos: conteoFormatoEventosMasivos,
    conteoGitHub: conteoPortafolioGithub,
    buzonAbierto: buzonAbierto.reverse(),
    directorioVoluntarios: directorioVoluntarios.reverse(),
    ultimosRegistros: respuestas.slice(-10).reverse().map(r => ({
      numeroControl: r.numeroControl,
      semestre: r.semestre,
      timestamp: r.timestamp
    }))
  };
}

// Servidor Principal
const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. ENDPOINTS DE LA API REST
  if (req.method === 'POST' && (pathname === '/api/submit' || pathname === '/api/respuestas' || pathname === '/api/encuesta')) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        success: false, 
        error: 'Has excedido el límite de envíos por minuto. Por favor espera un momento.' 
      }));
    }

    let body = '';
    let payloadExceeded = false;

    req.on('data', chunk => {
      if (payloadExceeded) return;
      body += chunk;
      if (body.length > 512 * 1024) {
        payloadExceeded = true;
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Petición demasiado grande (máximo 512 KB).' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (payloadExceeded) return;

      try {
        const payload = JSON.parse(body);
        
        let numeroControl = typeof payload.numeroControl === 'string' ? payload.numeroControl.trim().toUpperCase() : '';
        let correo = typeof payload.correo === 'string' ? payload.correo.trim().toLowerCase() : '';

        if (!numeroControl || !/^[C]?\d{8}$/i.test(numeroControl)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ 
            success: false, 
            error: 'El Número de Control es obligatorio y debe contener 8 dígitos numéricos (o la letra C + 8 dígitos en caso de cambio de carrera).' 
          }));
        }

        if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 120) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'El Correo Electrónico es obligatorio y debe tener un formato válido.' }));
        }

        const semestre = typeof payload.semestre === 'string' ? payload.semestre.trim() : '';
        const turno = typeof payload.turno === 'string' ? payload.turno.trim() : '';
        const situacion_laboral = typeof payload.situacion_laboral === 'string' ? payload.situacion_laboral.trim() : '';

        if (!semestre) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona tu semestre o situación académica actual.' }));
        }

        if (!turno) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona tu turno predominante.' }));
        }

        if (!situacion_laboral) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona tu situación laboral.' }));
        }

        payload.numeroControl = numeroControl;
        payload.correo = correo;

        const resultado = guardarRespuesta(payload);

        // Sincronización en tiempo real con Google Sheets si está configurado
        if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
          fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(err => console.error('Error sincronizando con Google Sheets:', err.message));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          success: true, 
          message: resultado.esActualizacion 
            ? 'Tus respuestas han sido actualizadas correctamente.' 
            : 'Tu registro ha sido completado con éxito. ¡Gracias por participar!',
          total: resultado.total
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Datos JSON mal formateados.' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/stats') {
    const respuestas = leerRespuestas();
    const stats = calcularEstadisticas(respuestas);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(stats));
  }

  if (req.method === 'GET' && pathname === '/api/export-csv') {
    if (!esAdminAutorizado(req, parsedUrl)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        success: false, 
        error: 'No autorizado. Se requiere clave de administración para descargar el padrón oficial del censo.' 
      }));
    }

    if (fs.existsSync(CSV_FILE)) {
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Censo_ISC_ITCM_2026.csv"'
      });
      return fs.createReadStream(CSV_FILE).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Archivo CSV no disponible.');
    }
  }

  if (req.method === 'GET' && pathname === '/api/respuestas') {
    const respuestas = leerRespuestas();
    const esAdmin = esAdminAutorizado(req, parsedUrl);

    if (esAdmin) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(respuestas));
    } else {
      // Anonimización estricta de PII para acceso público
      const anonimizadas = respuestas.map(r => {
        const copia = { ...r };
        delete copia.numeroControl;
        delete copia.correo;
        return copia;
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(anonimizadas));
    }
  }

  if (req.method === 'GET' && pathname === '/api/voluntarios') {
    if (!esAdminAutorizado(req, parsedUrl)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        success: false, 
        error: 'No autorizado. Se requiere clave de administración para consultar el directorio de voluntarios.' 
      }));
    }

    const respuestas = leerRespuestas();
    const voluntarios = respuestas.filter(r => {
      const comites = r.voluntariado_comites;
      if (!comites) return false;
      const arr = Array.isArray(comites) ? comites : [comites];
      return arr.some(c => {
        const str = String(c).toLowerCase();
        return str.includes("comité") || (str.length > 5 && !str.includes("asistente") && !str.includes("no deseo"));
      });
    }).map(r => ({
      numeroControl: r.numeroControl || '-',
      correo: r.correo || '-',
      semestre: r.semestre || '-',
      comites: r.voluntariado_comites,
      propuesta: r.propuesta_cambio_unico || '',
      timestamp: r.timestamp
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(voluntarios));
  }

  if (req.method === 'GET' && pathname === '/api/sync-sheets') {
    if (!esAdminAutorizado(req, parsedUrl)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'No autorizado' }));
    }
    sincronizarDesdeGoogleSheets().then(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, total: leerRespuestas().length }));
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    });
    return;
  }

  // 2. ENRUTAMIENTO Y SERVICIO DE ARCHIVOS ESTÁTICOS
  let sanitizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (sanitizedPath === '/' || sanitizedPath === '') {
    sanitizedPath = '/index.html';
  } else if (sanitizedPath === '/dashboard' || sanitizedPath === '/dashboard/') {
    sanitizedPath = '/dashboard.html';
  }

  const filePath = path.join(PUBLIC_DIR, sanitizedPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403: Acceso prohibido');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404: Página no encontrada');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

async function sincronizarDesdeGoogleSheets() {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    console.log('[*] Sincronizando respaldo desde Google Sheets...');
    const res = await fetch(webhookUrl, { redirect: 'follow' });
    if (!res.ok) return;
    const remoteData = await res.json();
    if (Array.isArray(remoteData) && remoteData.length > 0) {
      const localData = leerRespuestas();
      const map = new Map();
      localData.forEach(r => {
        const key = (r.numeroControl && r.numeroControl !== 'ANÓNIMO') ? String(r.numeroControl).toUpperCase() : r.id;
        if (key) map.set(key, r);
      });
      remoteData.forEach(r => {
        const key = (r.numeroControl && r.numeroControl !== 'ANÓNIMO') ? String(r.numeroControl).toUpperCase() : r.id;
        if (key && (!map.has(key) || !map.get(key).timestamp || (r.timestamp && r.timestamp > map.get(key).timestamp))) {
          map.set(key, r);
        }
      });
      const fused = Array.from(map.values());
      if (fused.length > localData.length) {
        fs.writeFileSync(JSON_FILE, JSON.stringify(fused, null, 2), 'utf8');
        const csvLines = [CSV_HEADERS.map(h => `"${h}"`).join(',')];
        fused.forEach(r => {
          const line = CSV_HEADERS.map(header => escaparCSV(r[header]));
          csvLines.push(line.join(','));
        });
        fs.writeFileSync(CSV_FILE, '\ufeff' + csvLines.join('\n') + '\n', 'utf8');
        console.log(`[+] Sincronización exitosa: ${fused.length} registros restaurados desde Google Sheets.`);
      }
    }
  } catch (err) {
    console.warn('[!] No se pudo sincronizar desde Google Sheets:', err.message);
  }
}

server.listen(PORT, () => {
  const localIP = obtenerIPLocal();
  console.log('\n' + '='.repeat(70));
  console.log('  🏛️  PLATAFORMA WEB: ENCUESTA DE FORMACIÓN ISC ACM ITCM 2026–2027');
  console.log('  🚀  Capítulo Estudiantil ACM — Instituto Tecnológico de Ciudad Madero');
  console.log('='.repeat(70));
  console.log(`  🟢 Servidor Local:      http://localhost:${PORT}`);
  console.log(`  📱 Acceso en Red/Wi-Fi: http://${localIP}:${PORT}`);
  console.log(`  📊 Dashboard en Vivo:   http://localhost:${PORT}/dashboard`);
  console.log('='.repeat(70));
  console.log('  💡 Asistente sintetizado de 25 preguntas (5 a 7 minutos)\n');

  sincronizarDesdeGoogleSheets();
});
