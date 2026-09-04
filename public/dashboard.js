/**
 * ============================================================================
 * COCKPIT DE INTELIGENCIA Y ANÁLISIS DE DATOS: ENCUESTA ISC ACM ITCM 2026–2027
 * ============================================================================
 * Autor: Jesús Javier Hernández Olvera
 * Dashboard Ejecutivo Oficial para las 25 Preguntas Sintetizadas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const VALID_KEYS = ['acm2026', 'olvera2026', 'itcm2026'];
  const AUTH_KEY_STORAGE = 'acm_admin_authenticated_session';
  const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? ''
    : 'http://localhost:3000';

  const COLORS = {
    blue: '#1B396A',
    gold: '#B38E5D',
    blueLight: '#2563EB',
    navy: '#0F2137',
    green: '#10B981',
    red: '#EF4444',
    purple: '#8B5CF6',
    amber: '#F59E0B',
    cyan: '#06B6D4',
    paletteList: [
      '#1B396A', '#B38E5D', '#2563EB', '#10B981', 
      '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', 
      '#0F2137', '#64748B'
    ]
  };

  const chartInstances = {};
  let rawResponses = [];
  let currentFilter = 'todos';
  let currentModuleStep = 'all';
  let refreshTimer = null;

  // Catálogo Oficial de los reactivos del instrumento sintetizado (25 preguntas + subvariables)
  const CATALOGO_PREGUNTAS = [
  {
    "step": 1,
    "module": "Módulo 1: Sobre ti e Información General",
    "key": "numeroControl",
    "title": "1. 1. Número de Control (8 dígitos o C + 8 dígitos)",
    "type": "text",
    "options": []
  },
  {
    "step": 1,
    "module": "Módulo 1: Sobre ti e Información General",
    "key": "correo",
    "title": "2. 2. Correo Electrónico (institucional o personal)",
    "type": "email",
    "options": []
  },
  {
    "step": 1,
    "module": "Módulo 1: Sobre ti e Información General",
    "key": "semestre",
    "title": "3. 3. Semestre o situación académica actual",
    "type": "radio",
    "options": [
      "1.º a 3.º semestre",
      "4.º a 6.º semestre",
      "7.º a 9.º semestre",
      "Residencia profesional",
      "Egresado(a) en proceso de titulación"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Sobre ti e Información General",
    "key": "turno",
    "title": "4. 4. Turno predominante en el que estudias",
    "type": "radio",
    "options": [
      "Matutino",
      "Vespertino",
      "Mixto o variable",
      "Sin turno fijo / En línea"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Sobre ti e Información General",
    "key": "situacion_laboral",
    "title": "5. 5. Situación laboral o actividades fuera de clases",
    "type": "radio",
    "options": [
      "Trabajo o realizo prácticas en el área de tecnología / desarrollo",
      "He tenido trabajos o proyectos previos en tecnología, pero actualmente no",
      "Realizo proyectos personales o independientes de programación",
      "Me dedico exclusivamente a la carrera por ahora",
      "Prefiero no responder"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "rec_pc",
    "title": "6. 6. Acceso y condiciones de equipo de cómputo para programar",
    "type": "radio",
    "options": [
      "Cuento con laptop o computadora propia con buen rendimiento para programar",
      "Cuento con computadora propia pero con limitaciones de rendimiento o almacenamiento",
      "Dependo de equipos prestados o compartidos",
      "Enfrento frecuentes problemas de equipo o conectividad para realizar mis prácticas"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "satisfaccion_practica",
    "title": "7. 7. Oportunidades de práctica real en las materias de la carrera",
    "type": "radio",
    "options": [
      "1 - Casi ninguna oportunidad práctica (predominio teórico)",
      "2 - Pocas oportunidades de práctica aplicada",
      "3 - Oportunidades moderadas o intermedias",
      "4 - Buenas oportunidades prácticas en la mayoría de materias",
      "5 - Amplias oportunidades de desarrollo y proyectos prácticos",
      "No he tenido oportunidad suficiente de evaluarlo"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "materias_dificultad",
    "title": "8. 8. Áreas o asignaturas con mayor reto o dificultad en tu aprendizaje",
    "type": "checkbox",
    "options": [
      "Programación básica y Orientada a Objetos (Fundamentos, POO)",
      "Estructuras de Datos y Algoritmos",
      "Matemáticas y Lógica (Discretas, Cálculo, Álgebra)",
      "Redes, Conectividad y Telecomunicaciones",
      "Sistemas Operativos y Arquitectura de Computadoras",
      "Bases de Datos (Modelado, SQL, NoSQL)",
      "Ninguna en particular / Buen desempeño general"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "experiencias_proyectos",
    "title": "9. 9. Tipos de proyectos de software en los que has participado en la carrera",
    "type": "checkbox",
    "options": [
      "Proyectos individuales de fin de materia",
      "Proyectos en equipo con división de roles",
      "Proyectos con usuarios o clientes reales fuera del aula",
      "Proyectos donde tuve que leer o modificar código escrito por otra persona",
      "Proyectos con entregas continuas, control de versiones o revisiones formales",
      "Ninguna de las anteriores / Aún no he realizado proyectos de este tipo"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "eq_coordinacion",
    "title": "10. Coordinación efectiva y distribución equitativa de tareas",
    "type": "radio",
    "options": [
      "Nunca",
      "Rara vez / Una vez",
      "Algunas veces",
      "Frecuentemente",
      "No aplica"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "eq_codigo_ajeno",
    "title": "10. Integrar o entender módulos de código hechos por compañeros",
    "type": "radio",
    "options": [
      "Nunca",
      "Rara vez / Una vez",
      "Algunas veces",
      "Frecuentemente",
      "No aplica"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "eq_git_compartido",
    "title": "10. Uso de Git o GitHub compartido para fusionar trabajo en equipo",
    "type": "radio",
    "options": [
      "Nunca",
      "Rara vez / Una vez",
      "Algunas veces",
      "Frecuentemente",
      "No aplica"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "eq_revision_pares",
    "title": "10. Revisión entre compañeros (code review) antes de entregar",
    "type": "radio",
    "options": [
      "Nunca",
      "Rara vez / Una vez",
      "Algunas veces",
      "Frecuentemente",
      "No aplica"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Condiciones de Estudio y Experiencia en la Carrera",
    "key": "eq_conflictos",
    "title": "10. Resolución adecuada de desacuerdos técnicos o retrasos",
    "type": "radio",
    "options": [
      "Nunca",
      "Rara vez / Una vez",
      "Algunas veces",
      "Frecuentemente",
      "No aplica"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_programacion",
    "title": "11. Lenguajes de programación (Java, Python, C++, C#, JS, etc.)",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_git",
    "title": "11. Control de versiones con Git y GitHub (commits, ramas, PRs)",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_debugging",
    "title": "11. Depuración de errores (debugging) y lectura de logs",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_testing",
    "title": "11. Pruebas unitarias o aseguramiento de calidad (Testing/QA)",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_linux",
    "title": "11. Uso de terminal, línea de comandos y entornos Linux",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_db_apis",
    "title": "11. Conexión de bases de datos y consumo de APIs REST",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_docs",
    "title": "11. Documentación técnica y lectura de especificaciones oficiales",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "dom_aprender_tech",
    "title": "11. Aprender de forma autónoma una nueva librería o tecnología",
    "type": "radio",
    "options": [
      "No la conozco",
      "Casi no la he usado",
      "Tareas básicas guiadas",
      "Uso autónomo en proyectos",
      "Sin oportunidad"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "fuente_aprendizaje",
    "title": "12. 12. ¿De dónde proviene principalmente lo que sabes sobre herramientas técnicas?",
    "type": "radio",
    "options": [
      "Principalmente de las materias y clases de la carrera",
      "Talleres, asesorías o actividades organizadas en el campus / capítulos estudiantiles",
      "Aprendizaje autónomo por cuenta propia (documentación, videos, tutoriales)",
      "Intercambio de conocimientos con compañeros y amigos",
      "Cursos externos o plataformas de aprendizaje en línea",
      "Experiencia en trabajos, prácticas profesionales o proyectos freelance",
      "Aún no domino suficientes herramientas prácticas"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "habilidades_fuera_aula",
    "title": "13. 13. Habilidades técnicas que sentiste mayor necesidad de aprender fuera del aula",
    "type": "checkbox",
    "options": [
      "Lenguajes y frameworks demandados en la industria",
      "Control de versiones con Git y flujos colaborativos en GitHub",
      "Depuración de errores (debugging) y solución autónoma de fallos",
      "Pruebas automatizadas (testing) y calidad de código",
      "Terminal, entornos Linux y despliegue básico",
      "Conexión a bases de datos y desarrollo de APIs",
      "Lectura de documentación técnica e investigación en inglés",
      "Metodologías de trabajo profesional y arquitectura de software",
      "Ninguna en particular"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "ing_tecnico",
    "title": "14. 14. Nivel de dominio del inglés técnico aplicado a la computación",
    "type": "radio",
    "options": [
      "Leo y comprendo documentación técnica y errores sin dificultad",
      "Nivel básico / intermedio (me apoyo frecuentemente con traductor)",
      "Comprendo lectura y puedo redactar o comunicarme técnicamente en inglés",
      "Mi nivel de inglés técnico es muy limitado o nulo"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "conf_explicar_proyecto",
    "title": "15. Explicar técnicamente la arquitectura de un proyecto propio",
    "type": "radio",
    "options": [
      "Nada preparado",
      "Poco preparado",
      "Algo preparado",
      "Bien preparado",
      "Muy preparado"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "conf_codigo_existente",
    "title": "15. Integrarte a un proyecto existente y entender código ajeno",
    "type": "radio",
    "options": [
      "Nada preparado",
      "Poco preparado",
      "Algo preparado",
      "Bien preparado",
      "Muy preparado"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "conf_aprender_tech",
    "title": "15. Aprender una nueva tecnología requerida en 2 a 3 semanas",
    "type": "radio",
    "options": [
      "Nada preparado",
      "Poco preparado",
      "Algo preparado",
      "Bien preparado",
      "Muy preparado"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "conf_trabajo_equipo",
    "title": "15. Colaborar técnicamente en un equipo multidisciplinario",
    "type": "radio",
    "options": [
      "Nada preparado",
      "Poco preparado",
      "Algo preparado",
      "Bien preparado",
      "Muy preparado"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Habilidades Técnicas y Aprendizaje Fuera del Aula",
    "key": "conf_entrevista_tecnica",
    "title": "15. Resolver problemas o preguntas en una entrevista técnica",
    "type": "radio",
    "options": [
      "Nada preparado",
      "Poco preparado",
      "Algo preparado",
      "Bien preparado",
      "Muy preparado"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Preparación Profesional, IA y Proyección Tecnológica",
    "key": "preparacion_laboral_general",
    "title": "16. 16. ¿Qué tan preparado/a te sientes para integrarte al campo laboral en TI?",
    "type": "radio",
    "options": [
      "1 - Muy poco preparado/a",
      "2 - Con preparación básica pero muchas dudas prácticas",
      "3 - Nivel intermedio (con bases pero requiero mentoría)",
      "4 - Bien preparado/a para iniciar con éxito",
      "5 - Totalmente preparado/a y competitivo/a",
      "Aún es muy temprano en mi carrera para evaluarlo"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Preparación Profesional, IA y Proyección Tecnológica",
    "key": "experiencia_entrevistas",
    "title": "17. 17. Experiencia previa en procesos de selección o entrevistas técnicas",
    "type": "radio",
    "options": [
      "Sí, en procesos reales de trabajo, prácticas o becas",
      "Sí, en simulaciones académicas, torneos o hackathones",
      "Sí, tanto en procesos reales como en simulaciones",
      "Todavía no he tenido la experiencia",
      "No estoy familiarizado/a con cómo son ese tipo de evaluaciones"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Preparación Profesional, IA y Proyección Tecnológica",
    "key": "portafolio_github",
    "title": "18. 18. Estado actual de tu perfil de GitHub o portafolio de proyectos",
    "type": "radio",
    "options": [
      "Cuento con un perfil activo con proyectos documentados y actualizados",
      "Tengo cuenta de GitHub pero con pocos proyectos, desorganizados o desactualizados",
      "No tengo portafolio ni GitHub activo, pero me gustaría crearlo y aprender a mantenerlo",
      "No sé cómo empezar a construir un portafolio profesional de software"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Preparación Profesional, IA y Proyección Tecnológica",
    "key": "uso_ia",
    "title": "19. 19. Uso de herramientas de Inteligencia Artificial para programar",
    "type": "radio",
    "options": [
      "No las utilizo para programar o estudiar",
      "Principalmente para aclarar dudas teóricas o buscar ideas iniciales",
      "Genero código y siempre lo reviso, entiendo y pruebo antes de usarlo",
      "Las utilizo con mucha frecuencia apoyándome también en la documentación oficial",
      "A veces copio sugerencias directamente sin terminar de comprender todo su funcionamiento"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Preparación Profesional, IA y Proyección Tecnológica",
    "key": "desarrollo_software_comunitario",
    "title": "20. 20. Proyectos de software de ACM desarrollados para el ITCM",
    "type": "radio",
    "options": [
      "Es excelente y me encantaría participar como desarrollador/a o colaborador/a",
      "Me parece una gran iniciativa y la apoyaría aunque no participe directamente como programador/a",
      "Me resulta indiferente",
      "Preferiría que ACM se concentre únicamente en conferencias o cursos teóricos"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Talleres, Eventos y Participación en ACM ITCM",
    "key": "interes_talleres",
    "title": "21. 21. Temas prioritarios para talleres prácticos intensivos (Bootcamps)",
    "type": "checkbox",
    "options": [
      "Git y flujos de trabajo colaborativos en GitHub a nivel profesional",
      "Desarrollo Web Fullstack moderno (Frontend y Backend con Node/React/Python)",
      "Entornos Linux, terminal avanzada y Docker / DevOps básico",
      "Creación y consumo de APIs REST y bases de datos relacionales/NoSQL",
      "Pruebas automatizadas (Testing), Clean Code y Arquitectura de Software",
      "Fundamentos de Ciberseguridad y hacking ético",
      "Inteligencia Artificial aplicada y Machine Learning",
      "Preparación de CV técnico, portafolio y entrevistas laborales de programación"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Talleres, Eventos y Participación en ACM ITCM",
    "key": "formato_eventos_masivos",
    "title": "22. 22. Formato preferido para eventos tecnológicos masivos de Sistemas",
    "type": "radio",
    "options": [
      "Hackathón tecnológico de 24 a 36 horas con retos y premios",
      "Torneo o concurso de programación competitiva y algorítmica",
      "Congreso o simposio con conferencistas de la industria tech",
      "Ciclos continuos de charlas técnicas cortas (Tech Talks) y networking estudiantil"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Talleres, Eventos y Participación en ACM ITCM",
    "key": "disponibilidad_actividades",
    "title": "23. 23. Probabilidad de asistir a actividades extracurriculares de ACM",
    "type": "radio",
    "options": [
      "1 - Nada probable (complicaciones de horario, transporte o trabajo)",
      "2 - Poco probable",
      "3 - Probable si los horarios se adaptan a mi turno",
      "4 - Muy probable (tengo alto interés en participar)",
      "5 - Definitivamente asistiré y me involucraré"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Talleres, Eventos y Participación en ACM ITCM",
    "key": "voluntariado_comites",
    "title": "24. 24. Comités de trabajo de ACM ITCM en los que te gustaría colaborar",
    "type": "checkbox",
    "options": [
      "Comité de Desarrollo de Software (plataformas y sistemas web del capítulo)",
      "Comité de Logística y Organización de Eventos / Hackathones",
      "Comité Académico y de Talleres (asesorías técnicas e impartición de bootcamps)",
      "Comité de Difusión, Medios y Diseño Multimedia",
      "Prefiero participar únicamente como asistente a los eventos y actividades"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Talleres, Eventos y Participación en ACM ITCM",
    "key": "propuesta_cambio_unico",
    "title": "25. 25. Si pudieras cambiar o proponer una sola cosa en la carrera, ¿cuál sería? (Opcional)",
    "type": "textarea",
    "options": []
  }
];

  // Elementos DOM Principales
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const filterChips = document.querySelectorAll('#filterGroupSemestre .filter-chip');
  const explorerChips = document.querySelectorAll('#explorerModuleChips .filter-chip');
  const lastUpdateBadge = document.getElementById('lastUpdateBadge');
  const totalCountEl = document.getElementById('totalCount');
  const emptyStateGeneral = document.getElementById('emptyStateGeneral');
  const dashboardDataGrid = document.getElementById('dashboardDataGrid');
  const btnExportCsv = document.getElementById('btnExportCsv');

  // KPIs
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiTutorias = document.getElementById('kpiTutorias');
  const kpiTutoriasPct = document.getElementById('kpiTutoriasPct');
  const kpiGithub = document.getElementById('kpiGithub');
  const kpiVoluntarios = document.getElementById('kpiVoluntarios');
  const kpiVoluntariosSub = document.getElementById('kpiVoluntariosSub');
  const tabCountVoluntarios = document.getElementById('tabCountVoluntarios');
  const tabCountBuzon = document.getElementById('tabCountBuzon');

  // Explorador
  const preguntaSelector = document.getElementById('preguntaSelector');
  const explorerSearchInput = document.getElementById('explorerSearchInput');
  const quickReactivosNav = document.getElementById('quickReactivosNav');
  const itemExplorerTitle = document.getElementById('itemExplorerTitle');
  const itemExplorerBadge = document.getElementById('itemExplorerBadge');
  const itemExplorerType = document.getElementById('itemExplorerType');
  const itemExplorerCount = document.getElementById('itemExplorerCount');
  const itemExplorerModa = document.getElementById('itemExplorerModa');
  const itemFreqTableBody = document.getElementById('itemFreqTableBody');

  // Modal QR
  const btnShowQrEmpty = document.getElementById('btnShowQrEmpty');
  const btnShowQrNav = document.getElementById('btnShowQrNav');
  const qrModal = document.getElementById('qrModal');
  const btnCloseQrModal = document.getElementById('btnCloseQrModal');
  const qrImageDisplay = document.getElementById('qrImageDisplay');
  const qrUrlDisplay = document.getElementById('qrUrlDisplay');
  const btnDownloadQr = document.getElementById('btnDownloadQr');
  const btnShareQrWhatsApp = document.getElementById('btnShareQrWhatsApp');
  const btnCopyQrUrl = document.getElementById('btnCopyQrUrl');

  function setupQrModal() {
    const origin = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
      ? window.location.origin
      : 'http://localhost:3000';

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(origin)}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`Compañero(a) de Sistemas ITCM, te invito a contestar la Encuesta Oficial ACM 2026–2027: ${origin}`)}`;

    function openQr() {
      if (!qrModal) return;
      if (qrImageDisplay) qrImageDisplay.src = qrApiUrl;
      if (qrUrlDisplay) qrUrlDisplay.textContent = origin;
      if (btnShareQrWhatsApp) btnShareQrWhatsApp.href = waUrl;
      qrModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeQr() {
      if (!qrModal) return;
      qrModal.style.display = 'none';
      document.body.style.overflow = '';
    }

    if (btnShowQrEmpty) btnShowQrEmpty.addEventListener('click', openQr);
    if (btnShowQrNav) btnShowQrNav.addEventListener('click', openQr);
    if (btnCloseQrModal) btnCloseQrModal.addEventListener('click', closeQr);
    if (qrModal) {
      qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) closeQr();
      });
    }

    if (btnDownloadQr) {
      btnDownloadQr.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(qrApiUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'QR_Encuesta_ISC_ITCM.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        } catch (err) {
          window.open(qrApiUrl, '_blank');
        }
      });
    }

    if (btnCopyQrUrl) {
      btnCopyQrUrl.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(origin);
          alert('¡Enlace copiado al portapapeles!');
        } catch (err) {
          prompt('Copia el enlace:', origin);
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // NAVEGACIÓN POR PESTAÑAS
  // --------------------------------------------------------------------------
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // FILTRO GENERAL POR SEMESTRE
  // --------------------------------------------------------------------------
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      applyFiltersAndRender();
    });
  });

  // --------------------------------------------------------------------------
  // FILTRO DE MÓDULOS EN EXPLORADOR
  // --------------------------------------------------------------------------
  explorerChips.forEach(chip => {
    chip.addEventListener('click', () => {
      explorerChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentModuleStep = chip.dataset.moduleStep;
      populateQuestionSelector();
    });
  });

  if (explorerSearchInput) {
    explorerSearchInput.addEventListener('input', () => {
      populateQuestionSelector();
    });
  }

  if (preguntaSelector) {
    preguntaSelector.addEventListener('change', () => {
      renderSingleQuestionExplorer(preguntaSelector.value);
      updateQuickNavActive(preguntaSelector.value);
    });
  }

  // --------------------------------------------------------------------------
  // CARGA DE DATOS DESDE LA API
  // --------------------------------------------------------------------------
  async function loadData() {
    try {
      const storedKey = sessionStorage.getItem(AUTH_KEY_STORAGE) || '';
      const headers = storedKey ? { 'x-admin-key': storedKey } : {};

      const res = await fetch(`${API_BASE}/api/respuestas`, { headers });
      if (res.ok) {
        rawResponses = await res.json();
      } else {
        const statsRes = await fetch(`${API_BASE}/api/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          rawResponses = stats.ultimosRegistros || [];
        }
      }
    } catch (err) {
      console.warn('Error al cargar datos:', err);
    }

    updateLastSyncTime();
    applyFiltersAndRender();
  }

  function updateLastSyncTime() {
    if (lastUpdateBadge) {
      const now = new Date();
      lastUpdateBadge.textContent = `Actualizado: ${now.toLocaleTimeString()}`;
    }
  }

  // --------------------------------------------------------------------------
  // FILTRADO Y ACTUALIZACIÓN GENERAL
  // --------------------------------------------------------------------------
  function filterResponses(responses, filter) {
    if (filter === 'todos') return responses;
    return responses.filter(r => {
      const sem = String(r.semestre || '').toLowerCase();
      if (filter === '1-3') return sem.includes('1.') || sem.includes('2.') || sem.includes('3.');
      if (filter === '4-6') return sem.includes('4.') || sem.includes('5.') || sem.includes('6.');
      if (filter === '7-9') return sem.includes('7.') || sem.includes('8.') || sem.includes('9.');
      if (filter === 'residencia') return sem.includes('residencia') || sem.includes('egresado') || sem.includes('titulación');
      return true;
    });
  }

  function applyFiltersAndRender() {
    const filtered = filterResponses(rawResponses, currentFilter);
    const total = filtered.length;

    if (totalCountEl) totalCountEl.textContent = total;
    if (kpiTotal) kpiTotal.textContent = total;

    if (rawResponses.length === 0) {
      if (emptyStateGeneral) emptyStateGeneral.style.display = 'block';
      if (dashboardDataGrid) dashboardDataGrid.style.display = 'none';
    } else {
      if (emptyStateGeneral) emptyStateGeneral.style.display = 'none';
      if (dashboardDataGrid) dashboardDataGrid.style.display = 'block';
    }

    let sinGithub = 0;
    let interesSoftware = 0;
    const voluntariosList = [];
    const buzonList = [];

    filtered.forEach(r => {
      const git = String(r.portafolio_github || '').toLowerCase();
      if (git.includes('no tengo') || git.includes('pocos') || git.includes('no sé')) {
        sinGithub++;
      }

      const soft = String(r.desarrollo_software_comunitario || '').toLowerCase();
      if (soft.includes('excelente') || soft.includes('gran iniciativa')) {
        interesSoftware++;
      }

      const comites = r.voluntariado_comites;
      if (comites) {
        const arr = Array.isArray(comites) ? comites : [comites];
        const esVoluntario = arr.some(c => {
          const str = String(c).toLowerCase();
          return str.includes('comité') || (str.length > 5 && !str.includes('asistente') && !str.includes('no deseo'));
        });
        if (esVoluntario) {
          voluntariosList.push({
            numeroControl: r.numeroControl || '-',
            correo: r.correo || '-',
            semestre: r.semestre || '-',
            comites: arr,
            timestamp: r.timestamp
          });
        }
      }

      const prop = (r.propuesta_cambio_unico || '').trim();
      if (prop && prop.length > 3) {
        buzonList.push({
          texto: prop,
          semestre: r.semestre || 'No especificado',
          timestamp: r.timestamp
        });
      }
    });

    if (kpiTutorias) kpiTutorias.textContent = total > 0 ? `${Math.round((interesSoftware / total) * 100)}%` : '0%';
    if (kpiTutoriasPct) kpiTutoriasPct.textContent = total > 0 ? `${interesSoftware} de ${total} apoyan software local` : '0% apoyo a software';
    if (kpiGithub) kpiGithub.textContent = total > 0 ? `${Math.round((sinGithub / total) * 100)}%` : '0%';
    if (kpiVoluntarios) kpiVoluntarios.textContent = voluntariosList.length;
    if (kpiVoluntariosSub) kpiVoluntariosSub.textContent = `${voluntariosList.length} registrados`;
    if (tabCountVoluntarios) tabCountVoluntarios.textContent = voluntariosList.length;
    if (tabCountBuzon) tabCountBuzon.textContent = buzonList.length;

    // 6 Gráficas Ejecutivas
    renderCountsBar('chartMateriasCanvas', countField(filtered, 'materias_dificultad'), total, 6, COLORS.red);
    renderCountsDonut('chartPresenciaCanvas', countField(filtered, 'portafolio_github'));
    renderCountsBar('chartTalleresCanvas', countField(filtered, 'interes_talleres'), total, 6, COLORS.blue);
    renderCountsDonut('chartSoberaniaCanvas', countField(filtered, 'desarrollo_software_comunitario'));
    renderCountsBar('chartEventosCanvas', countField(filtered, 'formato_eventos_masivos'), total, 5, COLORS.green);
    renderCountsBar('chartRolesCanvas', countField(filtered, 'fuente_aprendizaje'), total, 6, COLORS.blueLight);

    // Cruces Multivariables
    renderCrossTab('chartCruceIACanvas', filtered, 'semestre', 'uso_ia');
    renderCrossTab('chartCruceTutoriasCanvas', filtered, 'semestre', 'materias_dificultad');
    renderCrossTab('chartCruceGithubCanvas', filtered, 'portafolio_github', 'preparacion_laboral_general');
    renderCrossTab('chartCruceClimaCanvas', filtered, 'fuente_aprendizaje', 'interes_talleres');

    // Explorador de Reactivos
    renderSingleQuestionExplorer(preguntaSelector ? preguntaSelector.value : 'semestre');

    // Voluntarios y Buzón
    renderVoluntariosTable(voluntariosList);
    renderBuzonGrid(buzonList);
  }

  // --------------------------------------------------------------------------
  // EXPLORADOR EXHAUSTIVO DE REACTIVOS
  // --------------------------------------------------------------------------
  function renderSingleQuestionExplorer(key) {
    if (!key) return;
    const qConfig = CATALOGO_PREGUNTAS.find(q => q.key === key) || {
      step: 1,
      module: 'General',
      key: key,
      title: key,
      type: 'text',
      options: []
    };

    if (itemExplorerTitle) itemExplorerTitle.textContent = qConfig.title;
    if (itemExplorerBadge) itemExplorerBadge.textContent = qConfig.module;
    if (itemExplorerType) {
      const typeMap = {
        'text': 'Campo de Texto',
        'textarea': 'Texto Abierto (Propuesta)',
        'radio': 'Opción Única',
        'checkbox': 'Selección Múltiple',
        'matrix': 'Matriz Evaluativa'
      };
      itemExplorerType.textContent = typeMap[qConfig.type] || 'Reactivo';
    }

    const filtered = filterResponses(rawResponses, currentFilter);
    const counts = countField(filtered, key);
    const totalResp = Object.values(counts).reduce((a, b) => a + b, 0);

    if (itemExplorerCount) itemExplorerCount.textContent = `Respuestas: ${totalResp}`;

    let moda = '-';
    let maxCount = 0;
    for (const [opt, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        moda = opt;
      }
    }
    if (itemExplorerModa) {
      itemExplorerModa.textContent = maxCount > 0 ? `Moda: ${moda.substring(0, 25)} (${maxCount})` : 'Moda: -';
    }

    if (itemFreqTableBody) {
      if (totalResp === 0) {
        itemFreqTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Sin respuestas registradas para este reactivo.</td></tr>';
      } else {
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        itemFreqTableBody.innerHTML = sorted.map(([opt, count]) => {
          const pct = ((count / totalResp) * 100).toFixed(1);
          return `
            <tr>
              <td style="font-weight: 500;">${escapeHtml(opt)}</td>
              <td style="text-align: right; font-weight: 700;">${count}</td>
              <td style="text-align: right; color: var(--tecnm-blue); font-weight: 700;">${pct}%</td>
              <td>
                <div class="table-progress-bar">
                  <div class="table-progress-fill" style="width: ${pct}%;"></div>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    renderExplorerChart('chartReactivoCanvas', counts, totalResp);
  }

  function populateQuestionSelector() {
    if (!preguntaSelector) return;
    const searchTerm = explorerSearchInput ? explorerSearchInput.value.trim().toLowerCase() : '';

    const filteredQuestions = CATALOGO_PREGUNTAS.filter(q => {
      const matchesModule = (currentModuleStep === 'all') || (String(q.step) === String(currentModuleStep));
      const matchesSearch = !searchTerm || 
        q.title.toLowerCase().includes(searchTerm) || 
        q.key.toLowerCase().includes(searchTerm) ||
        (q.options && q.options.some(o => o.toLowerCase().includes(searchTerm)));
      return matchesModule && matchesSearch;
    });

    const grouped = {};
    filteredQuestions.forEach(q => {
      if (!grouped[q.module]) grouped[q.module] = [];
      grouped[q.module].push(q);
    });

    if (Object.keys(grouped).length === 0) {
      preguntaSelector.innerHTML = '<option value="">No se encontraron reactivos</option>';
      if (quickReactivosNav) quickReactivosNav.innerHTML = '';
      return;
    }

    preguntaSelector.innerHTML = Object.entries(grouped).map(([modLabel, questions]) => {
      const opts = questions.map(q => `<option value="${q.key}">${escapeHtml(q.title)}</option>`).join('');
      return `<optgroup label="${escapeHtml(modLabel)}">${opts}</optgroup>`;
    }).join('');

    if (quickReactivosNav) {
      quickReactivosNav.innerHTML = filteredQuestions.map(q => {
        const matchNum = q.title.match(/^(\d+)/);
        const shortNum = matchNum ? `P${matchNum[1]}` : q.key.substring(0, 5);
        return `<button type="button" class="btn-quick-reactivo" data-key="${q.key}" title="${escapeHtml(q.title)}">${shortNum}</button>`;
      }).join('');

      quickReactivosNav.querySelectorAll('.btn-quick-reactivo').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-key');
          preguntaSelector.value = key;
          renderSingleQuestionExplorer(key);
          updateQuickNavActive(key);
        });
      });
    }

    const firstKey = filteredQuestions.length > 0 ? filteredQuestions[0].key : null;
    if (firstKey) {
      preguntaSelector.value = firstKey;
      renderSingleQuestionExplorer(firstKey);
      updateQuickNavActive(firstKey);
    }
  }

  function updateQuickNavActive(key) {
    if (!quickReactivosNav) return;
    quickReactivosNav.querySelectorAll('.btn-quick-reactivo').forEach(btn => {
      if (btn.getAttribute('data-key') === key) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // FUNCIONES DE CONTEO Y CHART.JS
  // --------------------------------------------------------------------------
  function countField(responses, key) {
    const counts = {};
    responses.forEach(r => {
      const val = r[key];
      if (val === undefined || val === null || val === '') return;
      if (Array.isArray(val)) {
        val.forEach(v => {
          const item = String(v).trim();
          if (item) counts[item] = (counts[item] || 0) + 1;
        });
      } else {
        const item = String(val).trim();
        if (item) counts[item] = (counts[item] || 0) + 1;
      }
    });
    return counts;
  }

  function getOrCreateChart(canvasId, type, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }
    chartInstances[canvasId] = new Chart(canvas, { type, data, options });
    return chartInstances[canvasId];
  }

  function renderCountsBar(canvasId, counts, total, limit = 6, barColor = COLORS.blue) {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
    const labels = sorted.map(s => s[0].length > 32 ? s[0].substring(0, 30) + '...' : s[0]);
    const values = sorted.map(s => s[1]);

    getOrCreateChart(canvasId, 'bar', {
      labels,
      datasets: [{
        data: values,
        backgroundColor: barColor,
        borderRadius: 6,
        maxBarThickness: 32
      }]
    }, {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} estudiantes (${total > 0 ? Math.round((ctx.raw / total) * 100) : 0}%)`
          }
        }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
        y: { grid: { display: false } }
      }
    });
  }

  function renderCountsDonut(canvasId, counts) {
    const entries = Object.entries(counts).slice(0, 5);
    const labels = entries.map(e => e[0].length > 25 ? e[0].substring(0, 23) + '...' : e[0]);
    const values = entries.map(e => e[1]);

    getOrCreateChart(canvasId, 'doughnut', {
      labels,
      datasets: [{
        data: values,
        backgroundColor: COLORS.paletteList.slice(0, entries.length),
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    });
  }

  function renderExplorerChart(canvasId, counts, total) {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const labels = sorted.map(s => s[0].length > 28 ? s[0].substring(0, 26) + '...' : s[0]);
    const values = sorted.map(s => s[1]);

    getOrCreateChart(canvasId, 'bar', {
      labels,
      datasets: [{
        data: values,
        backgroundColor: COLORS.blue,
        borderRadius: 6
      }]
    }, {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} respuestas (${total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0}%)`
          }
        }
      },
      scales: {
        x: { beginAtZero: true },
        y: { grid: { display: false } }
      }
    });
  }

  function renderCrossTab(canvasId, responses, keyX, keyY) {
    const matrix = {};
    const yLabelsSet = new Set();

    responses.forEach(r => {
      const valX = String(r[keyX] || 'Sin especificar').trim();
      const rawY = r[keyY];
      if (!rawY) return;
      const yArr = Array.isArray(rawY) ? rawY : [rawY];

      if (!matrix[valX]) matrix[valX] = {};
      yArr.forEach(y => {
        const strY = String(y).trim();
        if (strY) {
          yLabelsSet.add(strY);
          matrix[valX][strY] = (matrix[valX][strY] || 0) + 1;
        }
      });
    });

    const xLabels = Object.keys(matrix).slice(0, 5);
    const yLabels = Array.from(yLabelsSet).slice(0, 4);

    const datasets = yLabels.map((yLab, idx) => ({
      label: yLab.length > 25 ? yLab.substring(0, 23) + '...' : yLab,
      data: xLabels.map(xLab => matrix[xLab][yLab] || 0),
      backgroundColor: COLORS.paletteList[idx % COLORS.paletteList.length],
      borderRadius: 4
    }));

    getOrCreateChart(canvasId, 'bar', {
      labels: xLabels.map(x => x.length > 18 ? x.substring(0, 16) + '...' : x),
      datasets
    }, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
      },
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true, stacked: false }
      }
    });
  }

  // --------------------------------------------------------------------------
  // VOLUNTARIOS Y BUZÓN
  // --------------------------------------------------------------------------
  function renderVoluntariosTable(voluntarios) {
    const tbody = document.getElementById('voluntariosTableBody');
    if (!tbody) return;

    if (voluntarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No hay registros de voluntarios en este segmento.</td></tr>';
      return;
    }

    tbody.innerHTML = voluntarios.map(v => {
      const comitesStr = Array.isArray(v.comites) ? v.comites.join(', ') : v.comites;
      return `
        <tr>
          <td style="font-weight: 700; color: var(--tecnm-blue);">${escapeHtml(v.numeroControl)}</td>
          <td>${escapeHtml(v.correo)}</td>
          <td>${escapeHtml(v.semestre)}</td>
          <td><span class="badge-tag" style="background: rgba(27,57,106,0.1); color: var(--tecnm-blue); font-size: 0.75rem;">${escapeHtml(comitesStr)}</span></td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(v.timestamp || Date.now()).toLocaleDateString()}</td>
        </tr>
      `;
    }).join('');
  }

  function renderBuzonGrid(buzon) {
    const grid = document.getElementById('buzonCardsGrid');
    if (!grid) return;

    if (buzon.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 32px;">No hay propuestas registradas en este segmento.</div>';
      return;
    }

    grid.innerHTML = buzon.map(b => `
      <div class="buzon-card">
        <div class="buzon-header">
          <span class="badge-tag" style="background: var(--tecnm-blue); color: #FFF; font-size: 0.75rem;">${escapeHtml(b.semestre)}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(b.timestamp || Date.now()).toLocaleDateString()}</span>
        </div>
        <p class="buzon-text">"${escapeHtml(b.texto)}"</p>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // INICIALIZACIÓN
  // --------------------------------------------------------------------------
  setupQrModal();
  populateQuestionSelector();
  loadData();

  refreshTimer = setInterval(loadData, 30000);
});
