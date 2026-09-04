/**
 * ============================================================================
 * SCRIPT DE GOOGLE SHEETS: ENCUESTA DE FORMACIÓN ISC ACM ITCM 2026–2027
 * ============================================================================
 * Sincronización en tiempo real: Encuesta Web (25 Preguntas) -> Google Sheets -> Descarga Excel
 * ============================================================================
 * INSTRUCCIONES DE INSTALACIÓN:
 * 
 * 1. Abre Google Drive (drive.google.com) y crea una "Hoja de cálculo de Google".
 *    Nómbrala: "Encuesta ISC ACM ITCM 2026-2027 (Respuestas Oficiales)".
 * 
 * 2. En el menú superior, ve a: Extensiones > Apps Script.
 * 
 * 3. Borra todo el código que aparezca en el editor y PEGA este archivo completo.
 * 
 * 4. Guarda con Ctrl+S (o Cmd+S) con el nombre: "WebhookEncuestaACM".
 * 
 * 5. Haz clic en "Implementar" > "Nueva implementación".
 *    - Tipo: "Aplicación web".
 *    - Descripción: "Receptor Encuesta ISC 2026 (25 Preguntas)"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquiera"
 * 
 * 6. Haz clic en "Implementar", autoriza permisos.
 * 
 * 7. COPIA la URL generada (/exec) y ponla en tus variables de entorno en Render:
 *    GOOGLE_SHEET_WEBHOOK_URL = https://script.google.com/macros/s/.../exec
 * ============================================================================
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Encabezados oficiales de las 25 preguntas sintetizadas
    const headers = [
      "Marca Temporal", "Fecha Actualización", "ID Respuesta",
      "P1. Número de Control", "P2. Correo Electrónico",
      "P3. Semestre", "P4. Turno", "P5. Situación Laboral",
      "P6. Equipo de Cómputo", "P7. Oportunidad Práctica Real",
      "P8. Materias Dificultad", "P9. Experiencia en Proyectos",
      // P10 Dinámicas de equipo
      "P10. Eq: Coordinación", "P10. Eq: Código Ajeno", "P10. Eq: Git Compartido", "P10. Eq: Revisión Pares", "P10. Eq: Conflictos",
      // P11 Dominio herramientas
      "P11. Dom: Lenguajes", "P11. Dom: Git & GitHub", "P11. Dom: Debugging", "P11. Dom: Testing QA",
      "P11. Dom: Linux Terminal", "P11. Dom: Bases de Datos APIs", "P11. Dom: Documentación", "P11. Dom: Autoaprendizaje Tech",
      // P12 a P14
      "P12. Fuente de Aprendizaje", "P13. Habilidades Fuera del Aula", "P14. Inglés Técnico",
      // P15 Confianza profesional
      "P15. Conf: Explicar Proyecto", "P15. Conf: Código Existente", "P15. Conf: Aprender Tech Rápido", "P15. Conf: Trabajo en Equipo", "P15. Conf: Entrevista Técnica",
      // P16 a P20
      "P16. Preparación Laboral General", "P17. Experiencia en Entrevistas", "P18. Portafolio GitHub", "P19. Uso de IA", "P20. Software Comunitario ACM",
      // P21 a P25
      "P21. Talleres Demandados", "P22. Formato Eventos Masivos", "P23. Probabilidad Asistencia", "P24. Voluntariado Comités", "P25. Propuesta de Cambio en Sistemas",
      "JSON_DATA"
    ];

    // Formato de cabeceras institucional TecNM
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1B396A");
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
      formatVal(data.numeroControl),
      formatVal(data.correo),
      formatVal(data.semestre),
      formatVal(data.turno),
      formatVal(data.situacion_laboral),
      formatVal(data.rec_pc),
      formatVal(data.satisfaccion_practica),
      formatVal(data.materias_dificultad),
      formatVal(data.experiencias_proyectos),
      // P10
      formatVal(data.eq_coordinacion),
      formatVal(data.eq_codigo_ajeno),
      formatVal(data.eq_git_compartido),
      formatVal(data.eq_revision_pares),
      formatVal(data.eq_conflictos),
      // P11
      formatVal(data.dom_programacion),
      formatVal(data.dom_git),
      formatVal(data.dom_debugging),
      formatVal(data.dom_testing),
      formatVal(data.dom_linux),
      formatVal(data.dom_db_apis),
      formatVal(data.dom_docs),
      formatVal(data.dom_aprender_tech),
      // P12 a P14
      formatVal(data.fuente_aprendizaje),
      formatVal(data.habilidades_fuera_aula),
      formatVal(data.ing_tecnico),
      // P15
      formatVal(data.conf_explicar_proyecto),
      formatVal(data.conf_codigo_existente),
      formatVal(data.conf_aprender_tech),
      formatVal(data.conf_trabajo_equipo),
      formatVal(data.conf_entrevista_tecnica),
      // P16 a P20
      formatVal(data.preparacion_laboral_general),
      formatVal(data.experiencia_entrevistas),
      formatVal(data.portafolio_github),
      formatVal(data.uso_ia),
      formatVal(data.desarrollo_software_comunitario),
      // P21 a P25
      formatVal(data.interes_talleres),
      formatVal(data.formato_eventos_masivos),
      formatVal(data.disponibilidad_actividades),
      formatVal(data.voluntariado_comites),
      formatVal(data.propuesta_cambio_unico),
      JSON.stringify(data)
    ];

    // Verificar si ya existe el número de control en la columna D (índice 3 en 0-indexed)
    const control = String(data.numeroControl || "").trim().toUpperCase();
    let rowIndex = -1;
    if (control.length >= 8) {
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (String(allData[i][3]).trim().toUpperCase() === control) {
          rowIndex = i + 1;
          break;
        }
      }
    }

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Fila registrada en Google Sheets" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint GET: Devuelve todas las respuestas en formato JSON puro para restaurar
 * el servidor en caso de reinicio de contenedor o despliegue.
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const allData = sheet.getDataRange().getValues();
    if (allData.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const headers = allData[0];
    let jsonIdx = headers.indexOf("JSON_DATA");
    if (jsonIdx === -1) {
      jsonIdx = headers.length - 1;
    }
    const list = [];
    for (let i = 1; i < allData.length; i++) {
      const cellVal = allData[i][jsonIdx];
      if (cellVal && typeof cellVal === "string" && cellVal.startsWith("{")) {
        try {
          list.push(JSON.parse(cellVal));
        } catch (jsonErr) {}
      }
    }
    return ContentService.createTextOutput(JSON.stringify(list))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
