/**
 * ============================================================================
 * SERVIDOR NATIVO SOBERANO: CENSO ESTUDIANTIL ACM ITCM 2026-2027
 * ============================================================================
 * Autor: Jesús Javier Hernández Olvera (N.C. 23070477)
 * Arquitectura: Node.js Nativo (Zero Dependencies / 100% Portátil)
 * Endpoints:
 *   - GET  /                  -> Formulario web responsive para alumnos
 *   - GET  /dashboard         -> Panel de resultados en vivo para campaña
 *   - POST /api/submit        -> Recepción y guardado de respuestas (JSON + CSV)
 *   - GET  /api/stats         -> Métricas y KPIs agregados en tiempo real
 *   - GET  /api/export-csv    -> Descarga del dataset completo para Excel
 *   - GET  /api/voluntarios   -> Directorio de alumnos que desean integrarse
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

// Asegurar existencia del directorio de datos y archivos base
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(JSON_FILE)) {
  fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Inicializar encabezados de CSV si no existe
const CSV_HEADERS = [
  "timestamp",
  "fechaActualizacion",
  "id",
  "nombre",
  "numeroControl",
  "correo",
  "telefono",
  "edad",
  "genero",
  "semestre",
  "turno",
  "situacion_laboral",
  "horas_trabajo",
  "rec_pc",
  "rec_internet",
  "rec_espacio",
  "tiempo_traslado",
  "cuidado_familia",
  "sistema_operativo",
  "horas_autonomas",
  "materias_dificultad",
  "factores_dificultad",
  "oportunidades_proyectos",
  "eq_coordinacion",
  "eq_distribucion",
  "eq_herramientas",
  "fortalezas_itcm",
  "dom_git",
  "dom_db",
  "dom_web",
  "dom_movil",
  "dom_cloud",
  "dom_devops",
  "dom_sec",
  "dom_ia",
  "fnt_lenguajes",
  "fnt_arquitectura",
  "fnt_despliegue",
  "experiencia_laboral_ti",
  "portafolio_github",
  "ing_lectura",
  "ing_comunicacion",
  "rec_algoritmos",
  "rec_cv",
  "rec_entrevistas",
  "necesidad_laboral_urgente",
  "frecuencia_ia",
  "usos_ia",
  "ia_inspeccion",
  "ia_pruebas",
  "ia_copia_directa",
  "opinion_especialidad",
  "reto_residencia",
  "participacion_innovatecnm",
  "rol_aspirado",
  "lab_rendimiento",
  "lab_red",
  "lab_software",
  "lab_ambiente",
  "deficiencias_urgentes",
  "salud_visual",
  "salud_postural",
  "salud_estres",
  "actividades_integracion",
  "interes_talleres",
  "formato_eventos_masivos",
  "factores_asistencia",
  "iniciativa_acm_w",
  "interes_mentoria",
  "desarrollo_software_comunitario",
  "voluntariado_comites",
  "horario_conveniente",
  "duracion_talleres",
  "canales_comunicacion",
  "af_biblioteca",
  "af_credencial",
  "af_networking",
  "af_descuentos",
  "disposicion_sustentabilidad",
  "prioridad_mesa_directiva",
  "propuesta_cambio_unico",
  "comentarios_finales"
];

if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, '\ufeff' + CSV_HEADERS.map(h => `"${h}"`).join(',') + '\n', 'utf8');
}

// Tipos MIME para servir estáticos
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

// Claves autorizadas de administración para consultar PII y exportar padrón
const VALID_ADMIN_KEYS = ['acm2026', 'olvera2026', 'itcm2026'];

// Limitador de tasa en memoria (15 envíos por minuto por IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_SUBMITS_PER_WINDOW = 15;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, record);
    return true;
  }
  
  if (record.count >= MAX_SUBMITS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

function esAdminAutorizado(req, parsedUrl) {
  const headerKey = req.headers['x-admin-key'] || '';
  const authHeader = req.headers['authorization'] || '';
  const queryKey = parsedUrl.searchParams.get('key') || '';
  
  let bearerKey = '';
  if (authHeader.startsWith('Bearer ')) {
    bearerKey = authHeader.substring(7).trim();
  }

  const candidate = (headerKey || queryKey || bearerKey).trim();
  return VALID_ADMIN_KEYS.includes(candidate);
}

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function leerRespuestas() {
  try {
    const data = fs.readFileSync(JSON_FILE, 'utf8');
    return JSON.parse(data);
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

  // Buscar si ya existe por número de control solo si se proporcionó uno válido y no anónimo
  const ncUpper = nueva.numeroControl ? String(nueva.numeroControl).trim().toUpperCase() : '';
  const tieneControl = ncUpper.length >= 8 && ncUpper !== 'ANÓNIMO';
  const index = tieneControl ? respuestas.findIndex(r => String(r.numeroControl).trim().toUpperCase() === ncUpper) : -1;
  
  if (index >= 0) {
    // Actualizar registro existente
    respuestas[index] = { ...respuestas[index], ...nueva, fechaActualizacion: new Date().toISOString() };
  } else {
    // Insertar nuevo registro
    nueva.timestamp = new Date().toISOString();
    respuestas.push(nueva);
  }
  
  // Escritura atómica en JSON para evitar corrupción por apagón
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

  // Copia de seguridad periódica cada 25 encuestas
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

  // Diccionarios de agregación exhaustiva
  const conteoSemestre = {};
  const conteoTurno = {};
  const conteoSituacionLaboral = {};
  const conteoDisponibilidadLaptop = {};
  const conteoSO = {};
  const conteoMaterias = {};
  const conteoCausasReprobacion = {};
  const conteoRiesgoBaja = {};
  const conteoLenguajes = {};
  const conteoFrecuenciaIA = {};
  const conteoImpactoIA = {};
  const conteoUrgenciaTutorias = {};
  const conteoGitHub = {};
  const conteoLinkedIn = {};
  const conteoIngles = {};
  const conteoCertificaciones = {};
  const conteoConfianzaEntrevista = {};
  const conteoEspecialidad = {};
  const conteoPreocupacionResidencia = {};
  const conteoInnovaTecNM = {};
  const conteoRoles = {};
  const conteoEvaluacionLabs = {};
  const conteoDeficienciasLabs = {};
  const conteoSoberania = {};
  const conteoDisposicionDev = {};
  const conteoClimaEstudiantil = {};
  const conteoSindromeImpostor = {};
  const conteoActividadesHorasMuertas = {};
  const conteoFaltaEventosApatia = {};
  const conteoTalleres = {};
  const conteoEventos = {};
  const conteoSoftSkills = {};
  const conteoApoyoACMW = {};
  const conteoAlumniMentoring = {};
  const conteoErgonomiaLabs = {};
  const conteoProblemasSalud = {};
  const conteoConvivenciasEstudiantiles = {};
  const conteoHorarioTalleres = {};
  const conteoDuracionTalleres = {};
  const conteoCajaDeCristal = {};
  const conteoCanalesAvisos = {};
  const conteoPerfilPresidente = {};
  const conteoComites = {};

  const buzonAbierto = [];
  const directorioVoluntarios = [];

  let sumaTutorias = 0;
  let tutoriasAltaUrgencia = 0;
  let sumaEvaluacionLabs = 0;
  let countLabs = 0;

  function getField(r, ...keys) {
    for (const k of keys) {
      if (r[k] !== undefined && r[k] !== null && r[k] !== '') return r[k];
    }
    return null;
  }

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
    addCount(getField(r, 'semestre'), conteoSemestre);
    addCount(getField(r, 'turno'), conteoTurno);
    addCount(getField(r, 'situacion_laboral', 'situacionLaboral'), conteoSituacionLaboral);
    addCount(getField(r, 'rec_pc', 'disponibilidadLaptop'), conteoDisponibilidadLaptop);
    addCount(getField(r, 'sistema_operativo', 'sistemaOperativo'), conteoSO);
    addCount(getField(r, 'materias_dificultad', 'materiasDificiles'), conteoMaterias);
    addCount(getField(r, 'factores_dificultad', 'causasReprobacion'), conteoCausasReprobacion);
    addCount(getField(r, 'fnt_lenguajes', 'lenguajesDominados'), conteoLenguajes);
    addCount(getField(r, 'frecuencia_ia', 'frecuenciaIA'), conteoFrecuenciaIA);
    addCount(getField(r, 'ia_copia_directa', 'impactoIA'), conteoImpactoIA);
    addCount(getField(r, 'interes_mentoria', 'urgenciaTutorias'), conteoUrgenciaTutorias);
    addCount(getField(r, 'portafolio_github', 'githubEstado'), conteoGitHub);
    addCount(getField(r, 'rec_entrevistas', 'confianzaEntrevista'), conteoConfianzaEntrevista);
    addCount(getField(r, 'opinion_especialidad', 'especialidadInteres'), conteoEspecialidad);
    addCount(getField(r, 'reto_residencia', 'preocupacionResidencia'), conteoPreocupacionResidencia);
    addCount(getField(r, 'participacion_innovatecnm', 'innovaTecNM'), conteoInnovaTecNM);
    addCount(getField(r, 'rol_aspirado', 'rolesAspirados'), conteoRoles);
    addCount(getField(r, 'deficiencias_urgentes', 'deficienciasLabs'), conteoDeficienciasLabs);
    addCount(getField(r, 'desarrollo_software_comunitario', 'soberaniaTecnologica'), conteoSoberania);
    addCount(getField(r, 'interes_talleres', 'talleresMastery'), conteoTalleres);
    addCount(getField(r, 'formato_eventos_masivos', 'eventosMasivos'), conteoEventos);
    addCount(getField(r, 'iniciativa_acm_w', 'apoyoACMW'), conteoApoyoACMW);
    addCount(getField(r, 'salud_estres', 'sindromeImpostor'), conteoSindromeImpostor);
    addCount(getField(r, 'salud_postural', 'ergonomiaLabs'), conteoErgonomiaLabs);
    addCount(getField(r, 'salud_visual', 'problemasSalud'), conteoProblemasSalud);
    addCount(getField(r, 'actividades_integracion', 'convivenciasEstudiantiles'), conteoConvivenciasEstudiantiles);
    addCount(getField(r, 'horario_conveniente', 'horarioTalleres'), conteoHorarioTalleres);
    addCount(getField(r, 'duracion_talleres', 'duracionTalleres'), conteoDuracionTalleres);
    addCount(getField(r, 'canales_comunicacion', 'canalesAvisos'), conteoCanalesAvisos);
    addCount(getField(r, 'prioridad_mesa_directiva', 'perfilPresidente'), conteoPerfilPresidente);

    // Tutorías / Mentoría
    const mentoriaVal = getField(r, 'interes_mentoria', 'urgenciaTutorias');
    if (mentoriaVal) {
      const s = String(mentoriaVal).toLowerCase();
      if (s.includes('recibir mentoría') || s.includes('ambas modalidades') || s === '4' || s === '5') {
        tutoriasAltaUrgencia++;
      }
      const num = parseInt(mentoriaVal, 10);
      if (!isNaN(num)) sumaTutorias += num;
      else sumaTutorias += 4;
    }

    // Comités de voluntariado
    const comitesVal = getField(r, 'voluntariado_comites', 'comitesVoluntariado');
    if (comitesVal) {
      const arr = Array.isArray(comitesVal) ? comitesVal : [comitesVal];
      arr.forEach(c => {
        const str = String(c).trim();
        if (str && !str.toLowerCase().includes("no deseo") && !str.toLowerCase().includes("no me interesa")) {
          conteoComites[str] = (conteoComites[str] || 0) + 1;
        }
      });

      const esVoluntario = arr.some(c => {
        const str = String(c).toLowerCase();
        return str.includes("comité") || str.includes("equipo") || (str.length > 5 && !str.includes("no deseo") && !str.includes("no me interesa") && !str.includes("únicamente como asistente") && !str.includes("solo asistente"));
      });

      if (esVoluntario) {
        directorioVoluntarios.push({
          nombre: r.nombre || 'Estudiante Voluntario',
          numeroControl: r.numeroControl || '-',
          correo: r.correo || '-',
          telefono: r.telefono || '',
          semestre: r.semestre || '-',
          comites: arr,
          timestamp: r.timestamp
        });
      }
    }

    // Buzón abierto (comentarios finales y propuestas)
    const coment = (r.comentarios_finales || '').trim();
    const prop = (r.propuesta_cambio_unico || '').trim();
    const legBuzon = (r.buzonAbierto || '').trim();

    if (coment && coment.length > 3) {
      buzonAbierto.push({
        texto: coment,
        semestre: r.semestre || 'Semestre no especificado',
        timestamp: r.timestamp
      });
    }
    if (prop && prop.length > 3 && prop !== coment) {
      buzonAbierto.push({
        texto: `Propuesta de cambio: ${prop}`,
        semestre: r.semestre || 'Semestre no especificado',
        timestamp: r.timestamp
      });
    }
    if (!coment && !prop && legBuzon && legBuzon.length > 3) {
      buzonAbierto.push({
        texto: legBuzon,
        semestre: r.semestre || 'Semestre no especificado',
        timestamp: r.timestamp
      });
    }
  });

  return {
    total,
    promedioUrgenciaTutorias: (sumaTutorias / total).toFixed(2),
    pctAltaUrgenciaTutorias: ((tutoriasAltaUrgencia / total) * 100).toFixed(1),
    promedioEvaluacionLabs: countLabs > 0 ? (sumaEvaluacionLabs / countLabs).toFixed(2) : '0.0',
    totalVoluntarios: directorioVoluntarios.length,
    conteoSemestre,
    conteoTurno,
    conteoSituacionLaboral,
    conteoDisponibilidadLaptop,
    conteoSO,
    conteoMaterias,
    conteoCausasReprobacion,
    conteoRiesgoBaja,
    conteoLenguajes,
    conteoFrecuenciaIA,
    conteoImpactoIA,
    conteoUrgenciaTutorias,
    conteoGitHub,
    conteoLinkedIn,
    conteoIngles,
    conteoCertificaciones,
    conteoConfianzaEntrevista,
    conteoEspecialidad,
    conteoPreocupacionResidencia,
    conteoInnovaTecNM,
    conteoRoles,
    conteoEvaluacionLabs,
    conteoDeficienciasLabs,
    conteoSoberania,
    conteoDisposicionDev,
    conteoClimaEstudiantil,
    conteoSindromeImpostor,
    conteoActividadesHorasMuertas,
    conteoFaltaEventosApatia,
    conteoTalleres,
    conteoEventos,
    conteoSoftSkills,
    conteoApoyoACMW,
    conteoAlumniMentoring,
    conteoErgonomiaLabs,
    conteoProblemasSalud,
    conteoConvivenciasEstudiantiles,
    conteoHorarioTalleres,
    conteoDuracionTalleres,
    conteoCajaDeCristal,
    conteoCanalesAvisos,
    conteoPerfilPresidente,
    conteoComites,
    buzonAbierto: buzonAbierto.reverse(),
    directorioVoluntarios: directorioVoluntarios.reverse(),
    ultimosRegistros: respuestas.slice(-10).reverse().map(r => ({
      nombre: r.nombre,
      numeroControl: r.numeroControl,
      semestre: r.semestre,
      timestamp: r.timestamp
    }))
  };
}

// Servidor Principal
const server = http.createServer((req, res) => {
  // Inyección de Cabeceras de Seguridad HTTP Globales
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. ENDPOINTS DE LA API REST
  if (req.method === 'POST' && (pathname === '/api/submit' || pathname === '/api/respuestas' || pathname === '/api/encuesta')) {
    // Protección Rate Limiting por IP
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

    // Protección contra DoS: Límite de 512 KB por payload
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
        
        // Sanitización de datos de contacto (100% opcionales para garantizar anonimato)
        let nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : '';
        let numeroControl = typeof payload.numeroControl === 'string' ? payload.numeroControl.trim().toUpperCase() : '';
        let correo = typeof payload.correo === 'string' ? payload.correo.trim().toLowerCase() : '';
        let telefono = typeof payload.telefono === 'string' ? payload.telefono.trim().replace(/\D/g, '') : '';
        if (telefono.length === 12 && telefono.startsWith('52')) {
          telefono = telefono.slice(2);
        }
        const buzonAbierto = typeof payload.buzonAbierto === 'string' ? payload.buzonAbierto.trim() : '';

        // Si se proporcionan datos de contacto, validamos que su formato sea correcto
        if (nombre && nombre.length > 120) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'El Nombre Completo no debe exceder 120 caracteres.' }));
        }

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

        if (telefono && !/^\d{10}$/.test(telefono)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'El Teléfono Celular debe contener exactamente 10 dígitos numéricos para WhatsApp.' }));
        }

        // Validación de datos académicos esenciales para rigor metodológico
        const semestre = typeof payload.semestre === 'string' ? payload.semestre.trim() : '';
        const turno = typeof payload.turno === 'string' ? payload.turno.trim() : '';
        const situacion_laboral = typeof payload.situacion_laboral === 'string' ? payload.situacion_laboral.trim() : '';

        if (!semestre) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona en qué semestre te encuentras inscrito.' }));
        }

        if (!turno) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona el turno principal en el que estudias.' }));
        }

        if (!situacion_laboral) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Por favor selecciona tu situación laboral actual.' }));
        }

        if (buzonAbierto && buzonAbierto.length > 2500) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'El texto del buzón no debe exceder 2,500 caracteres.' }));
        }

        payload.nombre = nombre || '';
        payload.numeroControl = numeroControl;
        payload.correo = correo;
        payload.telefono = telefono || '';

        const resultado = guardarRespuesta(payload);

        // Sincronización opcional en tiempo real con Google Sheets
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
      // Entrega dataset completo con datos de contacto (modo administrativo)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(respuestas));
    } else {
      // Protección de Privacidad: Anonimización estricta de PII para acceso público
      const anonimizadas = respuestas.map(r => {
        const copia = { ...r };
        delete copia.nombre;
        delete copia.numeroControl;
        delete copia.correo;
        delete copia.telefono;
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
      const comites = r.voluntariado_comites || r.comitesVoluntariado;
      return Array.isArray(comites) && comites.some(c => 
        !c.toLowerCase().includes("no me interesa") && 
        !c.toLowerCase().includes("no deseo") &&
        !c.toLowerCase().includes("solo prefiero")
      );
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(voluntarios));
  }

  // 2. ENRUTAMIENTO DE PÁGINAS PRINCIPALES
  let filePath = '';
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else if (pathname === '/dashboard' || pathname === '/dashboard.html') {
    filePath = path.join(PUBLIC_DIR, 'dashboard.html');
  } else {
    filePath = path.join(PUBLIC_DIR, pathname);
  }

  // Seguridad: prevenir path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Acceso denegado');
  }

  // Servir archivo estático
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

server.listen(PORT, () => {
  const localIP = obtenerIPLocal();
  console.log('\n' + '='.repeat(70));
  console.log('  🏛️  PLATAFORMA WEB: CENSO ESTUDIANTIL ISC ITCM 2026-2027');
  console.log('  🚀  Capítulo Estudiantil ACM — Instituto Tecnológico de Ciudad Madero');
  console.log('='.repeat(70));
  console.log(`  🟢 Servidor Local:    http://localhost:${PORT}`);
  console.log(`  📱 Acceso en Red/Wi-Fi: http://${localIP}:${PORT}`);
  console.log(`  📊 Dashboard en Vivo: http://localhost:${PORT}/dashboard`);
  console.log('='.repeat(70));
  console.log('  💡 Comparte el enlace de red o genera un código QR para salones.\n');
});
