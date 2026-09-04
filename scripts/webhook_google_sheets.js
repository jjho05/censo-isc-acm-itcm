/**
 * ============================================================================
 * SCRIPT DE GOOGLE SHEETS PARA RECIBIR RESPUESTAS DEL CENSO ACM ITCM 2026–2027
 * ============================================================================
 * Sincronización en tiempo real: Encuesta Web -> Google Sheets -> Descarga Excel
 * ============================================================================
 * INSTRUCCIONES DE INSTALACIÓN PASO A PASO:
 * 
 * 1. Abre Google Drive (drive.google.com) y crea una "Hoja de cálculo de Google" nueva.
 *    Nómbrala: "Censo ISC ACM ITCM 2026-2027 (Respuestas Oficiales)".
 * 
 * 2. En el menú superior de la hoja, ve a:
 *    Extensiones > Apps Script
 * 
 * 3. Borra todo el código que aparezca en el editor y PEGA este archivo completo.
 * 
 * 4. Guarda con Ctrl+S (o Cmd+S) con el nombre del proyecto: "WebhookCensoACM".
 * 
 * 5. Haz clic en el botón azul superior "Implementar" > "Nueva implementación".
 *    - En el icono de engranaje (⚙️), selecciona: "Aplicación web".
 *    - Descripción: "Receptor Censo ISC 2026"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquiera" (IMPORTANTE: para que tu servidor o Vercel pueda enviar datos)
 * 
 * 6. Haz clic en "Implementar", autoriza los permisos de tu cuenta de Google
 *    (haz clic en "Configuración avanzada" > "Ir a WebhookCensoACM (no seguro)" > "Permitir").
 * 
 * 7. COPIA la URL generada que termina en "/exec" (esa es tu GOOGLE_SHEET_WEBHOOK_URL).
 * ============================================================================
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Encabezados oficiales con las 52 preguntas y matrices
    const headers = [
      "Marca Temporal", "Fecha Actualización", "ID Respuesta", "Nombre Completo (Opcional)", "Número de Control", "Correo Electrónico", "Teléfono / WhatsApp",
      "Edad", "Género", "Semestre", "Turno", "Situación Laboral", "Horas Trabajo Semanal",
      // Matriz P9
      "Recurso: PC Propia", "Recurso: Internet Estable", "Recurso: Espacio Estudio",
      "Tiempo Traslado Diario", "Cuidado Familiar / Tiempo", "Sistema Operativo Principal", "Horas Estudio Autónomo",
      // P14 a P18
      "Materias Mayor Dificultad", "Factores Dificultad Carrera", "Oportunidad Proyectos Reales",
      "Equipo: Coordinación", "Equipo: Carga Equitativa", "Equipo: Herramientas (Git/Jira)", "Fortalezas ITCM",
      // Matriz P19 Dominio Técnico
      "Dominio: Git & GitHub", "Dominio: Bases de Datos SQL/NoSQL", "Dominio: Desarrollo Web", "Dominio: Desarrollo Móvil",
      "Dominio: Cloud Computing", "Dominio: DevOps & Docker", "Dominio: Ciberseguridad", "Dominio: Inteligencia Artificial",
      // Matriz P20 Fuentes
      "Fuente: Lenguajes Modernos", "Fuente: Buenas Prácticas y Arquitectura", "Fuente: Despliegue y Nube",
      "Experiencia Laboral TI", "Portafolio Técnico / GitHub",
      "Inglés: Lectura Docs", "Inglés: Conversación / Entrevistas",
      "Entrevistas: Algoritmos LeetCode", "Entrevistas: CV Tech", "Entrevistas: Conductual / Técnica",
      "Necesidad Laboral Más Urgente",
      // Módulo 5: IA
      "Frecuencia Asistentes IA", "Usos Principales IA",
      "IA: Reviso Línea por Línea", "IA: Escribo Pruebas Locales", "IA: Copio y Pego Directo",
      // Módulo 6: Especialidades y Carrera
      "Opinión Especialidades ITCM", "Mayor Reto Residencia Profesional", "Participación InnovaTecNM / Hackathons", "Rol Profesional Aspirado",
      // Módulo 7: Infraestructura y Salud
      "Labs: Rendimiento PCs", "Labs: Red Cableada / Wi-Fi", "Labs: Software / IDEs", "Labs: Clima / Mobiliario",
      "Deficiencias Urgentes Departamento",
      "Salud: Fatiga Visual", "Salud: Dolor Muscular / Cuello", "Salud: Estrés / Ansiedad",
      "Actividades Integración y Convivencia",
      // Módulo 8: Talleres y Actividades ACM
      "Temas Talleres Más Demandados", "Formato Eventos Masivos", "Factores Condicionantes Asistencia", "Iniciativa Talento Femenino ACM-W",
      // Módulo 9: Mentorías y Voluntariado
      "Interés Programa Mentorías", "Interés Software Comunitario Campus", "Comités Voluntariado ACM Elegidos",
      // Módulo 10: Logística y Afiliación
      "Horario Conveniente Talleres", "Duración Óptima Talleres", "Canales Difusión Preferidos",
      "ACM Intl: Biblioteca Digital", "ACM Intl: Membresía y CV", "ACM Intl: Red Global", "ACM Intl: Becas y Concursos",
      "Disposición Cuota Sustentabilidad",
      // Módulo 11: Gestión y Buzón
      "Prioridad Próxima Mesa Directiva ACM", "Propuesta de Cambio Único en Sistemas", "Buzón Abierto / Comentarios Libres"
    ];

    // Si la hoja está vacía, insertar encabezados con formato institucional TecNM
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1B396A"); // Azul TecNM
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    function formatVal(v) {
      if (Array.isArray(v)) return v.join("; ");
      if (v === undefined || v === null) return "";
      return String(v);
    }

    const row = [
      data.timestamp || new Date().toISOString(),
      formatVal(data.fechaActualizacion),
      formatVal(data.id),
      formatVal(data.nombre),
      formatVal(data.numeroControl),
      formatVal(data.correo),
      formatVal(data.telefono),
      formatVal(data.edad),
      formatVal(data.genero),
      formatVal(data.semestre),
      formatVal(data.turno),
      formatVal(data.situacion_laboral),
      formatVal(data.horas_trabajo),
      // P9
      formatVal(data.rec_pc),
      formatVal(data.rec_internet),
      formatVal(data.rec_espacio),
      formatVal(data.tiempo_traslado),
      formatVal(data.cuidado_familia),
      formatVal(data.sistema_operativo),
      formatVal(data.horas_autonomas),
      // P14 a P18
      formatVal(data.materias_dificultad),
      formatVal(data.factores_dificultad),
      formatVal(data.oportunidades_proyectos),
      formatVal(data.eq_coordinacion),
      formatVal(data.eq_distribucion),
      formatVal(data.eq_herramientas),
      formatVal(data.fortalezas_itcm),
      // P19
      formatVal(data.dom_git),
      formatVal(data.dom_db),
      formatVal(data.dom_web),
      formatVal(data.dom_movil),
      formatVal(data.dom_cloud),
      formatVal(data.dom_devops),
      formatVal(data.dom_sec),
      formatVal(data.dom_ia),
      // P20
      formatVal(data.fnt_lenguajes),
      formatVal(data.fnt_arquitectura),
      formatVal(data.fnt_despliegue),
      formatVal(data.experiencia_laboral_ti),
      formatVal(data.portafolio_github),
      formatVal(data.ing_lectura),
      formatVal(data.ing_comunicacion),
      formatVal(data.rec_algoritmos),
      formatVal(data.rec_cv),
      formatVal(data.rec_entrevistas),
      formatVal(data.necesidad_laboral_urgente),
      // P26 a P28
      formatVal(data.frecuencia_ia),
      formatVal(data.usos_ia),
      formatVal(data.ia_inspeccion),
      formatVal(data.ia_pruebas),
      formatVal(data.ia_copia_directa),
      // P29 a P32
      formatVal(data.opinion_especialidad),
      formatVal(data.reto_residencia),
      formatVal(data.participacion_innovatecnm),
      formatVal(data.rol_aspirado),
      // P33 a P36
      formatVal(data.lab_rendimiento),
      formatVal(data.lab_red),
      formatVal(data.lab_software),
      formatVal(data.lab_ambiente),
      formatVal(data.deficiencias_urgentes),
      formatVal(data.salud_visual),
      formatVal(data.salud_postural),
      formatVal(data.salud_estres),
      formatVal(data.actividades_integracion),
      // P37 a P40
      formatVal(data.interes_talleres),
      formatVal(data.formato_eventos_masivos),
      formatVal(data.factores_asistencia),
      formatVal(data.iniciativa_acm_w),
      // P41 a P43
      formatVal(data.interes_mentoria),
      formatVal(data.desarrollo_software_comunitario),
      formatVal(data.voluntariado_comites),
      // P44 a P48
      formatVal(data.horario_conveniente),
      formatVal(data.duracion_talleres),
      formatVal(data.canales_comunicacion),
      formatVal(data.af_biblioteca),
      formatVal(data.af_credencial),
      formatVal(data.af_networking),
      formatVal(data.af_descuentos),
      formatVal(data.disposicion_sustentabilidad),
      // P49 a P51
      formatVal(data.prioridad_mesa_directiva),
      formatVal(data.propuesta_cambio_unico),
      formatVal(data.comentarios_finales)
    ];

    // Verificar si ya existe el número de control en la columna E (índice 4)
    const control = String(data.numeroControl || "").trim().toUpperCase();
    let rowIndex = -1;
    if (control.length >= 8) {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (String(allData[i][4]).trim().toUpperCase() === control) {
          rowIndex = i + 1;
          break;
        }
      }
    }

    if (rowIndex > 0) {
      // Actualizar fila existente
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      // Agregar nueva fila al final
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Fila registrada en Google Sheets" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
