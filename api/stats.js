/**
 * ============================================================================
 * VERCEL SERVERLESS FUNCTION: /api/stats
 * ============================================================================
 * Sirve las estadísticas y métricas exhaustivas para el Dashboard ejecutivo.
 * Si está en Vercel, consulta a Google Sheets (doGet).
 * Si está en local, lee de respuestas.json.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10'); // Caché fresca de 5 segundos

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const googleWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  // 1. Si existe la URL de Google Sheets, consultar en tiempo real a Google Sheets
  if (googleWebhookUrl) {
    try {
      const response = await fetch(googleWebhookUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const stats = await response.json();
      return res.status(200).json(stats);
    } catch (err) {
      console.error('Error consultando estadísticas de Google Sheets:', err);
    }
  }

  // 2. Fallback local leyendo datos/respuestas.json
  try {
    const jsonPath = path.join(process.cwd(), 'datos', 'respuestas.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const respuestas = JSON.parse(raw || '[]');
      
      const total = respuestas.length;
      if (total === 0) return res.status(200).json({ total: 0 });

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
        addCount(r.situacionLaboral, conteoSituacionLaboral);
        addCount(r.disponibilidadLaptop, conteoDisponibilidadLaptop);
        addCount(r.sistemaOperativo, conteoSO);
        addCount(r.materiasDificiles, conteoMaterias);
        addCount(r.causasReprobacion, conteoCausasReprobacion);
        addCount(r.riesgoBaja, conteoRiesgoBaja);
        addCount(r.lenguajesDominados, conteoLenguajes);
        addCount(r.frecuenciaIA, conteoFrecuenciaIA);
        addCount(r.impactoIA, conteoImpactoIA);
        addCount(r.urgenciaTutorias, conteoUrgenciaTutorias);
        addCount(r.githubEstado, conteoGitHub);
        addCount(r.linkedinEstado, conteoLinkedIn);
        addCount(r.inglesTecnico, conteoIngles);
        addCount(r.certificaciones, conteoCertificaciones);
        addCount(r.confianzaEntrevista, conteoConfianzaEntrevista);
        addCount(r.especialidadInteres, conteoEspecialidad);
        addCount(r.preocupacionResidencia, conteoPreocupacionResidencia);
        addCount(r.innovaTecNM, conteoInnovaTecNM);
        addCount(r.rolesAspirados, conteoRoles);
        addCount(r.evaluacionLabs, conteoEvaluacionLabs);
        addCount(r.deficienciasLabs, conteoDeficienciasLabs);
        addCount(r.soberaniaTecnologica, conteoSoberania);
        addCount(r.disposicionDev, conteoDisposicionDev);
        addCount(r.climaEstudiantil, conteoClimaEstudiantil);
        addCount(r.sindromeImpostor, conteoSindromeImpostor);
        addCount(r.actividadesHorasMuertas, conteoActividadesHorasMuertas);
        addCount(r.faltaEventosApatia, conteoFaltaEventosApatia);
        addCount(r.talleresMastery, conteoTalleres);
        addCount(r.eventosMasivos, conteoEventos);
        addCount(r.softSkills, conteoSoftSkills);
        addCount(r.apoyoACMW, conteoApoyoACMW);
        addCount(r.alumniMentoring, conteoAlumniMentoring);
        addCount(r.ergonomiaLabs, conteoErgonomiaLabs);
        addCount(r.problemasSalud, conteoProblemasSalud);
        addCount(r.convivenciasEstudiantiles, conteoConvivenciasEstudiantiles);
        addCount(r.horarioTalleres, conteoHorarioTalleres);
        addCount(r.duracionTalleres, conteoDuracionTalleres);
        addCount(r.cajaDeCristal, conteoCajaDeCristal);
        addCount(r.canalesAvisos, conteoCanalesAvisos);
        addCount(r.perfilPresidente, conteoPerfilPresidente);

        const tutVal = parseInt(r.urgenciaTutorias, 10);
        if (!isNaN(tutVal)) {
          sumaTutorias += tutVal;
          if (tutVal >= 4) tutoriasAltaUrgencia++;
        }

        const labVal = parseInt(r.evaluacionLabs, 10);
        if (!isNaN(labVal)) {
          sumaEvaluacionLabs += labVal;
          countLabs++;
        }

        if (Array.isArray(r.comitesVoluntariado)) {
          r.comitesVoluntariado.forEach(c => {
            if (!c.toLowerCase().includes("no me interesa")) {
              conteoComites[c] = (conteoComites[c] || 0) + 1;
            }
          });

          const esVoluntario = r.comitesVoluntariado.some(c => 
            !c.toLowerCase().includes("no me interesa") && !c.toLowerCase().includes("solo asistente")
          );

          if (esVoluntario) {
            directorioVoluntarios.push({
              nombre: r.nombre,
              numeroControl: r.numeroControl,
              correo: r.correo,
              telefono: r.telefono,
              semestre: r.semestre,
              comites: r.comitesVoluntariado,
              timestamp: r.timestamp
            });
          }
        }

        if (r.buzonAbierto && r.buzonAbierto.trim().length > 3) {
          buzonAbierto.push({
            texto: r.buzonAbierto.trim(),
            semestre: r.semestre || 'Semestre no especificado',
            timestamp: r.timestamp
          });
        }
      });

      return res.status(200).json({
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
      });
    }
  } catch (e) {
    console.error('Error calculando estadísticas locales en api/stats:', e);
  }

  return res.status(200).json({ total: 0 });
}
