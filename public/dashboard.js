/**
 * ============================================================================
 * COCKPIT DE INTELIGENCIA Y ANÁLISIS DE DATOS ACM ITCM 2026-2027
 * ============================================================================
 * Autor: Jesús Javier Hernández Olvera
 * Capacidades:
 *  - Auditoría Estadística Formal sin datos simulados
 *  - Explorador Exhaustivo de los 53 Reactivos en 11 Módulos
 *  - Fórmulas de Frecuencias Absolutas y Porcentajes de Distribución
 *  - Cruces Multivariables y Banco de Voluntarios
 *  - Sin emojis: Interfaz ejecutiva e institucional sobria
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración de Seguridad
  const VALID_KEYS = ['acm2026', 'olvera2026', 'itcm2026'];
  const AUTH_KEY_STORAGE = 'acm_admin_authenticated_session';
  const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? ''
    : 'http://localhost:3000';

  // Paleta de Colores Institucional TecNM para Chart.js
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

  // Instancias activas de Chart.js
  const chartInstances = {};

  // Estado en Memoria
  let rawResponses = [];
  let currentFilter = 'todos';
  let currentModuleStep = 'all';
  let refreshTimer = null;

  // Catálogo Oficial Completo de los 53 Reactivos del Censo
  const CATALOGO_PREGUNTAS = [
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "numeroControl",
    "title": "1. Número de control (8 dígitos o C + 8 dígitos)",
    "type": "text",
    "options": []
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "correo",
    "title": "2. Correo electrónico (institucional o personal)",
    "type": "email",
    "options": []
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "telefono",
    "title": "Teléfono de WhatsApp (Opcional)",
    "type": "tel",
    "options": []
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "edad",
    "title": "3. Edad",
    "type": "select",
    "options": [
      "17 años o menos",
      "18 años",
      "19 años",
      "20 años",
      "21 años",
      "22 años",
      "23 años",
      "24 años",
      "25 años o más",
      "Prefiero no responder"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "genero",
    "title": "4. Género",
    "type": "radio",
    "options": [
      "Femenino",
      "Masculino",
      "No binario",
      "Prefiero no responder",
      "Otro"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "semestre",
    "title": "5. Semestre actual",
    "type": "select",
    "options": [
      "1° semestre",
      "2° semestre",
      "3° semestre",
      "4° semestre",
      "5° semestre",
      "6° semestre",
      "7° semestre",
      "8° semestre",
      "9° semestre",
      "10° semestre o superior",
      "Egresado reciente"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "turno",
    "title": "6. Turno principal en el que cursas tus materias",
    "type": "radio",
    "options": [
      "Matutino",
      "Vespertino",
      "Mixto (materias en ambos turnos)"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "situacion_laboral",
    "title": "7. ¿Actualmente trabajas?",
    "type": "radio",
    "options": [
      "No trabajo actualmente",
      "Trabajo en algo no relacionado con tecnología a tiempo parcial",
      "Trabajo en algo no relacionado con tecnología a tiempo completo",
      "Trabajo en tecnología / software a tiempo parcial",
      "Trabajo en tecnología / software a tiempo completo o freelance formal",
      "Realizo prácticas profesionales / Estadía laboral"
    ]
  },
  {
    "step": 1,
    "module": "Módulo 1: Registro y Contexto Personal",
    "key": "horas_trabajo",
    "title": "8. Si trabajas, ¿cuántas horas aproximadas dedicas al trabajo por semana?",
    "type": "select",
    "options": [
      "No aplica / No trabajo",
      "Menos de 10 horas semanales",
      "10 a 20 horas semanales",
      "21 a 30 horas semanales",
      "31 a 40 horas semanales",
      "Más de 40 horas semanales"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "rec_pc",
    "title": "9. Disponibilidad y calidad de tus recursos de estudio y desarrollo - Computadora propia con capacidad para programar y compilar",
    "type": "radio",
    "options": [
      "Siempre / Excelente",
      "Casi siempre / Buena",
      "A veces / Regular",
      "Rara vez / Deficiente",
      "Nunca / No dispongo"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "rec_internet",
    "title": "9. Disponibilidad y calidad de tus recursos de estudio y desarrollo - Conexión a internet estable en tu domicilio de estudio",
    "type": "radio",
    "options": [
      "Siempre / Excelente",
      "Casi siempre / Buena",
      "A veces / Regular",
      "Rara vez / Deficiente",
      "Nunca / No dispongo"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "rec_espacio",
    "title": "9. Disponibilidad y calidad de tus recursos de estudio y desarrollo - Espacio físico adecuado, iluminado y libre de distracciones para estudiar",
    "type": "radio",
    "options": [
      "Siempre / Excelente",
      "Casi siempre / Buena",
      "A veces / Regular",
      "Rara vez / Deficiente",
      "Nunca / No dispongo"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "tiempo_traslado",
    "title": "10. Tiempo aproximado de traslado diario de ida y vuelta al ITCM",
    "type": "radio",
    "options": [
      "Menos de 30 minutos",
      "Entre 30 y 60 minutos",
      "Entre 1 y 2 horas",
      "Más de 2 horas al día"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "cuidado_familia",
    "title": "11. ¿Tienes responsabilidades familiares o de cuidado que limiten tu tiempo extracurricular?",
    "type": "radio",
    "options": [
      "Sí, de manera significativa (afecta ampliamente mi disponibilidad)",
      "Sí, de manera moderada",
      "No / Mínimo impacto en mi tiempo libre"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "sistema_operativo",
    "title": "12. Sistema operativo principal que utilizas para desarrollar y estudiar",
    "type": "radio",
    "options": [
      "Windows",
      "GNU/Linux (Ubuntu, Fedora, Arch, etc.)",
      "macOS",
      "Entorno dual (Windows + Linux)",
      "No cuento con equipo propio / Dependo de equipos de la institución",
      "Otro"
    ]
  },
  {
    "step": 2,
    "module": "Módulo 2: Trayectoria Académica y Condiciones de Estudio",
    "key": "horas_autonomas",
    "title": "13. Horas aproximadas a la semana que dedicas al estudio autónomo y programación fuera de clases",
    "type": "radio",
    "options": [
      "Menos de 3 horas semanales",
      "Entre 3 y 6 horas semanales",
      "Entre 7 y 12 horas semanales",
      "Más de 12 horas semanales"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "materias_dificultad",
    "title": "14. ¿Cuáles áreas curriculares han presentado mayor dificultad o rezago en tu avance?",
    "type": "checkbox",
    "options": [
      "Programación básica y Fundamentos de POO",
      "Estructuras de Datos y Algoritmos avanzados",
      "Matemáticas discretas, Cálculo y Física",
      "Arquitectura de computadoras y Sistemas Operativos",
      "Bases de Datos (modelado, consultas complejas, administración)",
      "Redes y Conectividad (enrutamiento, configuración física/lógica)",
      "Ingeniería de Software y Gestión de Proyectos",
      "Ninguna en particular / Mi avance ha sido regular"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "factores_dificultad",
    "title": "15. Factores principales que consideras dificultan tu aprendizaje en la carrera",
    "type": "checkbox",
    "options": [
      "Desfase o desactualización en temarios respecto a la industria moderna",
      "Metodologías de enseñanza excesivamente teóricas o poco prácticas",
      "Falta de laboratorios funcionales o equipo suficiente en clases",
      "Falta de tiempo personal por trabajo, familia o traslados largos",
      "Deficiencias o falta de bases previas en lógica matemática y razonamiento",
      "Falta de acompañamiento o asesorías extracurriculares oportunas",
      "Ninguno / Considero que el proceso de aprendizaje es fluido",
      "Otro"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "oportunidades_proyectos",
    "title": "16. ¿Consideras que la carrera te brinda suficientes oportunidades de desarrollo de proyectos reales?",
    "type": "radio",
    "options": [
      "Totalmente suficientes",
      "Suficientes",
      "Apenas suficientes / Muy limitadas",
      "Insuficientes",
      "Totalmente insuficientes / Nulas"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "eq_coordinacion",
    "title": "17. Experiencia y dinámica de trabajo colaborativo en equipo - Coordinación y comunicación entre integrantes del equipo",
    "type": "radio",
    "options": [
      "Excelente",
      "Buena",
      "Regular",
      "Deficiente",
      "Muy deficiente"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "eq_distribucion",
    "title": "17. Experiencia y dinámica de trabajo colaborativo en equipo - Distribución equitativa de carga y esfuerzo técnico",
    "type": "radio",
    "options": [
      "Excelente",
      "Buena",
      "Regular",
      "Deficiente",
      "Muy deficiente"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "eq_herramientas",
    "title": "17. Experiencia y dinámica de trabajo colaborativo en equipo - Uso de herramientas formales de colaboración (Git, GitHub, Trello, Jira)",
    "type": "radio",
    "options": [
      "Excelente",
      "Buena",
      "Regular",
      "Deficiente",
      "Muy deficiente"
    ]
  },
  {
    "step": 3,
    "module": "Módulo 3: Experiencia en la Carrera y Aprendizaje",
    "key": "fortalezas_itcm",
    "title": "18. Principales fortalezas que reconoces en la formación que ofrece el ITCM",
    "type": "textarea",
    "options": []
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_git",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Control de versiones (Git / GitHub / GitLab)",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_db",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Bases de Datos SQL (PostgreSQL, MySQL) y NoSQL",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_web",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Desarrollo Web (Frontend: React/Vue/HTML/CSS, Backend: Node/Python/Java)",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_movil",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Desarrollo Móvil (Flutter, React Native, Android nativo)",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_cloud",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Computación en la Nube (AWS, GCP, Azure)",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_devops",
    "title": "19. Nivel percibido de dominio en tecnologías clave - DevOps, Contenedores y CI/CD (Docker, Linux Server)",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_sec",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Ciberseguridad y Principios de Desarrollo Seguro",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "dom_ia",
    "title": "19. Nivel percibido de dominio en tecnologías clave - Inteligencia Artificial y Machine Learning Aplicado",
    "type": "radio",
    "options": [
      "Ninguno / Desconocido",
      "Básico / Académico elemental",
      "Intermedio / Proyectos funcionales",
      "Avanzado / Nivel producción laboral"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "fnt_lenguajes",
    "title": "20. Principal fuente donde has adquirido tus conocimientos técnicos prácticos - Lenguajes y frameworks de programación modernos",
    "type": "radio",
    "options": [
      "Clases escolares obligatorias",
      "Cursos externos / Bootcamps / Certificaciones",
      "Autoaprendizaje autodidacta (YouTube, documentación, libros)",
      "Experiencia laboral formal o proyectos freelance personales"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "fnt_arquitectura",
    "title": "20. Principal fuente donde has adquirido tus conocimientos técnicos prácticos - Buenas prácticas de arquitectura, patrones y código limpio",
    "type": "radio",
    "options": [
      "Clases escolares obligatorias",
      "Cursos externos / Bootcamps / Certificaciones",
      "Autoaprendizaje autodidacta (YouTube, documentación, libros)",
      "Experiencia laboral formal o proyectos freelance personales"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "fnt_despliegue",
    "title": "20. Principal fuente donde has adquirido tus conocimientos técnicos prácticos - Herramientas de despliegue, servidores y nube",
    "type": "radio",
    "options": [
      "Clases escolares obligatorias",
      "Cursos externos / Bootcamps / Certificaciones",
      "Autoaprendizaje autodidacta (YouTube, documentación, libros)",
      "Experiencia laboral formal o proyectos freelance personales"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "experiencia_laboral_ti",
    "title": "21. ¿Has tenido experiencia laboral o profesional en el área de TI?",
    "type": "radio",
    "options": [
      "Sí, cuento con empleo formal activo o previo en TI",
      "Sí, mediante proyectos freelance o desarrollo por encargo",
      "Sí, a través de servicio social o prácticas en áreas de TI",
      "No, aún no cuento con experiencia en el sector"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "portafolio_github",
    "title": "22. ¿Tienes actualmente un portafolio técnico activo o repositorio público con proyectos?",
    "type": "radio",
    "options": [
      "Sí, estructurado y actualizado con proyectos personales o de equipo",
      "Sí, pero tiene pocos proyectos o requiere orden y documentación",
      "No, pero tengo interés prioritario en construirlo",
      "No tengo y requiero orientación para empezar desde cero"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "ing_lectura",
    "title": "23. Dominio del idioma inglés para el ámbito profesional de TI - Lectura y comprensión fluida de documentación técnica oficial",
    "type": "radio",
    "options": [
      "Avanzado / Fluido",
      "Intermedio / Funcional",
      "Básico / Con apoyo de traductor",
      "Nulo / Muy limitado"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "ing_comunicacion",
    "title": "23. Dominio del idioma inglés para el ámbito profesional de TI - Comunicación verbal / Capacidad de sostener entrevistas de trabajo",
    "type": "radio",
    "options": [
      "Avanzado / Fluido",
      "Intermedio / Funcional",
      "Básico / Con apoyo de traductor",
      "Nulo / Muy limitado"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "rec_algoritmos",
    "title": "24. Preparación para procesos de selección y reclutamiento técnico - Resolución de retos de código y algoritmos en vivo (LeetCode, HackerRank)",
    "type": "radio",
    "options": [
      "Muy preparado / Con práctica",
      "Moderadamente preparado",
      "Poco preparado / Inseguro",
      "Nada preparado / Desconozco la dinámica"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "rec_cv",
    "title": "24. Preparación para procesos de selección y reclutamiento técnico - Elaboración de CV de alto impacto con métricas y estándares de la industria",
    "type": "radio",
    "options": [
      "Muy preparado / Con práctica",
      "Moderadamente preparado",
      "Poco preparado / Inseguro",
      "Nada preparado / Desconozco la dinámica"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "rec_entrevistas",
    "title": "24. Preparación para procesos de selección y reclutamiento técnico - Entrevistas técnicas de arquitectura y conductuales (STAR method)",
    "type": "radio",
    "options": [
      "Muy preparado / Con práctica",
      "Moderadamente preparado",
      "Poco preparado / Inseguro",
      "Nada preparado / Desconozco la dinámica"
    ]
  },
  {
    "step": 4,
    "module": "Módulo 4: Competencias Técnicas y Preparación Laboral",
    "key": "necesidad_laboral_urgente",
    "title": "25. ¿Cuál consideras que es la necesidad más urgente en tu preparación para ingresar al mercado laboral?",
    "type": "textarea",
    "options": []
  },
  {
    "step": 5,
    "module": "Módulo 5: Inteligencia Artificial en la Formación Académica",
    "key": "frecuencia_ia",
    "title": "26. ¿Con qué frecuencia utilizas herramientas de Inteligencia Artificial en tus estudios y código?",
    "type": "radio",
    "options": [
      "A diario / Prácticamente en cada sesión de trabajo",
      "Varias veces por semana",
      "Ocasionalmente / Pocas veces al mes",
      "Rara vez o nunca"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Inteligencia Artificial en la Formación Académica",
    "key": "usos_ia",
    "title": "27. Principales propósitos con los que utilizas asistentes de Inteligencia Artificial",
    "type": "checkbox",
    "options": [
      "Explicación didáctica y comprensión de conceptos teóricos o matemáticos",
      "Detección y solución de errores de sintaxis o bugs (debugging)",
      "Generación directa de fragmentos o funciones completas de código",
      "Optimización, limpieza y refactorización de código propio",
      "Redacción de reportes, documentación técnica y síntesis",
      "No utilizo herramientas de IA"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Inteligencia Artificial en la Formación Académica",
    "key": "ia_inspeccion",
    "title": "28. Prácticas de verificación y pensamiento crítico al emplear IA - Leo y analizo minuciosamente cada línea antes de integrarla a mi proyecto",
    "type": "radio",
    "options": [
      "Siempre",
      "Casi siempre",
      "A veces",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Inteligencia Artificial en la Formación Académica",
    "key": "ia_pruebas",
    "title": "28. Prácticas de verificación y pensamiento crítico al emplear IA - Escribo pruebas locales o verifico casos borde para confirmar que funciona",
    "type": "radio",
    "options": [
      "Siempre",
      "Casi siempre",
      "A veces",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 5,
    "module": "Módulo 5: Inteligencia Artificial en la Formación Académica",
    "key": "ia_copia_directa",
    "title": "28. Prácticas de verificación y pensamiento crítico al emplear IA - Copio y pego la respuesta directamente sin verificar si compila a la primera",
    "type": "radio",
    "options": [
      "Siempre",
      "Casi siempre",
      "A veces",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 6,
    "module": "Módulo 6: Especialidades, Residencia Profesional e Innovación",
    "key": "opinion_especialidad",
    "title": "29. ¿Qué opinas sobre la oferta actual de materias de especialidad en Sistemas del ITCM?",
    "type": "radio",
    "options": [
      "Muy actualizada y estrechamente alineada con la demanda del mercado",
      "Moderadamente actualizada, pero requiere renovar contenidos clave",
      "Desactualizada frente a los estándares tecnológicos contemporáneos",
      "Aún no conozco a profundidad la oferta de especialidades"
    ]
  },
  {
    "step": 6,
    "module": "Módulo 6: Especialidades, Residencia Profesional e Innovación",
    "key": "reto_residencia",
    "title": "30. ¿Cuál consideras que es el mayor reto al buscar residencia profesional?",
    "type": "radio",
    "options": [
      "Escasez de empresas locales de desarrollo de software en la zona conurbada",
      "Requisitos técnicos elevados que exceden lo enseñado en las aulas",
      "Nivel de inglés técnico requerido para vacantes remotas o trasnacionales",
      "Falta de convenios institucionales activos con empresas tecnológicas",
      "Procesos de selección largos y complejos",
      "Aún no curso los semestres de residencia / No lo he contemplado"
    ]
  },
  {
    "step": 6,
    "module": "Módulo 6: Especialidades, Residencia Profesional e Innovación",
    "key": "participacion_innovatecnm",
    "title": "31. ¿Conoces o has participado en eventos como InnovaTecNM o Hackathones?",
    "type": "radio",
    "options": [
      "He participado activamente en uno o más eventos",
      "Los conozco, pero no he participado por falta de equipo o tiempo",
      "Los conozco, pero no me siento con la preparación técnica suficiente para competir",
      "No los conozco / No se difunden con claridad en la comunidad"
    ]
  },
  {
    "step": 6,
    "module": "Módulo 6: Especialidades, Residencia Profesional e Innovación",
    "key": "rol_aspirado",
    "title": "32. ¿Qué rol profesional aspiras desempeñar prioritariamente al graduarte?",
    "type": "radio",
    "options": [
      "Desarrollador de Software / Full Stack / Frontend / Backend",
      "Ingeniero de Datos / Analista de Datos / Data Scientist",
      "Especialista en Cloud Computing & DevOps",
      "Especialista en Ciberseguridad / Seguridad Ofensiva o Defensiva",
      "Administrador de Infraestructura de Redes y Telecomunicaciones",
      "Project Manager TI / Product Owner / Scrum Master",
      "Emprendedor / Fundador de startup tecnológica propia",
      "Investigador / Posgrado académico",
      "Otro / Aún explorando opciones"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "lab_rendimiento",
    "title": "33. Evaluación de la infraestructura de los laboratorios del Departamento de Sistemas - Capacidad y velocidad de cómputo en equipos de laboratorios",
    "type": "radio",
    "options": [
      "Excelente",
      "Bueno",
      "Regular",
      "Deficiente",
      "No utilizo los laboratorios"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "lab_red",
    "title": "33. Evaluación de la infraestructura de los laboratorios del Departamento de Sistemas - Estabilidad y velocidad de red cableada y Wi-Fi en laboratorios",
    "type": "radio",
    "options": [
      "Excelente",
      "Bueno",
      "Regular",
      "Deficiente",
      "No utilizo los laboratorios"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "lab_software",
    "title": "33. Evaluación de la infraestructura de los laboratorios del Departamento de Sistemas - Disponibilidad de entornos de desarrollo, IDEs y licencias actualizadas",
    "type": "radio",
    "options": [
      "Excelente",
      "Bueno",
      "Regular",
      "Deficiente",
      "No utilizo los laboratorios"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "lab_ambiente",
    "title": "33. Evaluación de la infraestructura de los laboratorios del Departamento de Sistemas - Climatización (AC), ergonomía de sillas, iluminación y limpieza",
    "type": "radio",
    "options": [
      "Excelente",
      "Bueno",
      "Regular",
      "Deficiente",
      "No utilizo los laboratorios"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "deficiencias_urgentes",
    "title": "34. Deficiencias físicas o materiales que consideras prioritario atender en el departamento",
    "type": "checkbox",
    "options": [
      "Instalación de contactos eléctricos accesibles para laptops en aulas comunes",
      "Ampliación de ancho de banda y cobertura de Wi-Fi institucional",
      "Mantenimiento correctivo urgente a sistemas de aire acondicionado",
      "Actualización de hardware en computadoras de laboratorios especializados",
      "Habilitación de cubículos o áreas tranquilas para trabajo colaborativo y estudio",
      "Ninguna / Las condiciones actuales me parecen adecuadas"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "salud_visual",
    "title": "35. Molestias de salud asociadas a las jornadas intensivas de estudio y programación - Fatiga visual, ardor ocular o dolor de cabeza por pantallas",
    "type": "radio",
    "options": [
      "Frecuentemente",
      "Ocasionalmente",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "salud_postural",
    "title": "35. Molestias de salud asociadas a las jornadas intensivas de estudio y programación - Dolores musculares en cuello, espalda o muñecas (túnel carpiano)",
    "type": "radio",
    "options": [
      "Frecuentemente",
      "Ocasionalmente",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "salud_estres",
    "title": "35. Molestias de salud asociadas a las jornadas intensivas de estudio y programación - Estrés agudo, sobrecarga mental o trastornos del sueño por entregas",
    "type": "radio",
    "options": [
      "Frecuentemente",
      "Ocasionalmente",
      "Rara vez",
      "Nunca"
    ]
  },
  {
    "step": 7,
    "module": "Módulo 7: Infraestructura, Condiciones Físicas y Bienestar",
    "key": "actividades_integracion",
    "title": "36. ¿Consideras oportuno organizar actividades de convivencia, recreación y pausas activas?",
    "type": "radio",
    "options": [
      "Totalmente de acuerdo",
      "De acuerdo",
      "Indiferente / Neutral",
      "En desacuerdo",
      "Totalmente en desacuerdo"
    ]
  },
  {
    "step": 8,
    "module": "Módulo 8: Talleres, Eventos y Actividades Técnicas ACM",
    "key": "interes_talleres",
    "title": "37. Temas en los que tendrías mayor interés para talleres prácticos extracurriculares (Elige hasta 3)",
    "type": "checkbox",
    "options": [
      "Git & GitHub: Flujos profesionales en equipo y Open Source",
      "Desarrollo Web Moderno (React, Next.js, Node.js, TypeScript)",
      "Arquitecturas Cloud y DevOps (AWS, Docker, CI/CD pipelines)",
      "Ciberseguridad Práctica, Pentesting defensivo y Hardening",
      "Inteligencia Artificial y Machine Learning aplicado con Python",
      "Estructuras de Datos y resolución de algoritmos para LeetCode",
      "Bases de Datos Avanzadas y optimización de consultas SQL/NoSQL",
      "Desarrollo Móvil Multiplataforma (Flutter / React Native)",
      "Preparación de CV Tech, LinkedIn y simulación de entrevistas"
    ]
  },
  {
    "step": 8,
    "module": "Módulo 8: Talleres, Eventos y Actividades Técnicas ACM",
    "key": "formato_eventos_masivos",
    "title": "38. Formato de eventos académicos y tecnológicos masivos que prefieres ver organizados",
    "type": "radio",
    "options": [
      "Hackathón presencial de 24 a 36 horas continuas con retos empresariales y premios",
      "Congreso o Simposio con conferencistas de la industria tech nacional e internacional",
      "Torneos de Programación Competitiva y retos algorítmicos por equipos",
      "Feria de Software y Emprendimiento Estudiantil abierta al sector productivo",
      "Charlas técnicas breves y periódicas (Tech Talks quincenales / mensuales)"
    ]
  },
  {
    "step": 8,
    "module": "Módulo 8: Talleres, Eventos y Actividades Técnicas ACM",
    "key": "factores_asistencia",
    "title": "39. Factores determinantes que condicionan tu asistencia a talleres extracurriculares",
    "type": "checkbox",
    "options": [
      "Horario compatible que no se traslape con mis materias curriculares",
      "Enfoque 100% práctico con construcción de un proyecto funcional para portafolio",
      "Entrega de constancia de acreditación o valor curricular formal",
      "Costo gratuito o cuota mínima de recuperación totalmente accesible",
      "Instructores con experiencia comprobable en la industria o proyectos reales",
      "Modalidad flexible (presencial con opción a grabación para repaso asíncrono)"
    ]
  },
  {
    "step": 8,
    "module": "Módulo 8: Talleres, Eventos y Actividades Técnicas ACM",
    "key": "iniciativa_acm_w",
    "title": "40. Interés en apoyar o participar en iniciativas de talento femenino en tecnología (ACM-W)",
    "type": "radio",
    "options": [
      "Muy alto interés / Deseo participar activamente",
      "Moderado interés / Asistiría a las conferencias y eventos",
      "Neutral / Me es indistinto",
      "No considero que sea prioritario"
    ]
  },
  {
    "step": 9,
    "module": "Módulo 9: Mentorías, Desarrollo de Software Comunitario y Voluntariado",
    "key": "interes_mentoria",
    "title": "41. ¿Estarías interesado en un programa formal de mentorías entre estudiantes y egresados?",
    "type": "radio",
    "options": [
      "Sí, me gustaría recibir mentoría de estudiantes avanzados o egresados en la industria",
      "Sí, me gustaría ser mentor de estudiantes de semestres iniciales en temas que domino",
      "Me interesaría en ambas modalidades (recibir orientación y también orientar a otros)",
      "No por el momento debido a limitaciones de tiempo",
      "No me interesa"
    ]
  },
  {
    "step": 9,
    "module": "Módulo 9: Mentorías, Desarrollo de Software Comunitario y Voluntariado",
    "key": "desarrollo_software_comunitario",
    "title": "42. ¿Te interesaría colaborar en el desarrollo de software real de código abierto para el campus?",
    "type": "radio",
    "options": [
      "Sí, con alto entusiasmo / Quiero programar en proyectos colectivos reales",
      "Sí, siempre que los horarios y entregas sean razonables y coordinadas",
      "Tal vez más adelante cuando adquiera mayor dominio en programación",
      "No es de mi interés participar en desarrollo extracurricular"
    ]
  },
  {
    "step": 9,
    "module": "Módulo 9: Mentorías, Desarrollo de Software Comunitario y Voluntariado",
    "key": "voluntariado_comites",
    "title": "43. ¿Te gustaría sumarte como colaborador voluntario al Capítulo Estudiantil ACM (2026–2027)?",
    "type": "checkbox",
    "options": [
      "Comité Técnico y Académico (impartición de talleres, preparación de retos)",
      "Comité de Logística y Operaciones (organización de hackathones y eventos)",
      "Comité de Medios, Diseño y Comunicación (redes sociales, fotografía, diseño gráfico)",
      "Equipo de Desarrollo de Software (construcción de plataformas web y sistemas)",
      "Comité de Vinculación y Patrocinios (contacto con empresas y egresados)",
      "Prefiero participar únicamente como asistente a los eventos",
      "No deseo integrarme a comités de voluntariado"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "horario_conveniente",
    "title": "44. ¿Cuál es el horario más conveniente para tus actividades extracurriculares presenciales?",
    "type": "radio",
    "options": [
      "Viernes por la tarde (a partir de las 14:00 o 15:00 hrs)",
      "Sábados por la mañana (ej. 9:00 a 13:00 hrs)",
      "Entre semana en horario intermedio (12:00 a 14:00 hrs)",
      "Formato asíncrono o virtual con sesiones en vivo por la noche",
      "No tengo posibilidad de asistir a actividades extracurriculares"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "duracion_talleres",
    "title": "45. Duración que consideras más efectiva y sostenible para un taller práctico",
    "type": "radio",
    "options": [
      "Sesión única intensiva de 2 a 3 horas en un solo día",
      "Taller de fin de semana (sábado intensivo de 4 a 5 horas con pausas)",
      "Serie modular semanal (1 a 2 horas por semana a lo largo de 3 o 4 semanas)",
      "Bootcamp express intensivo durante periodos intersemestrales o vacacionales"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "canales_comunicacion",
    "title": "46. Medios mediante los cuales prefieres enterarte de avisos, talleres y convocatorias",
    "type": "checkbox",
    "options": [
      "Comunidad o grupos oficiales en WhatsApp",
      "Servidor o comunidad en Discord",
      "Canal de difusión en Telegram",
      "Página y publicaciones en Instagram",
      "Difusión directa presencial salón por salón y carteles en mamparas",
      "Correo institucional oficial"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "af_biblioteca",
    "title": "47. Percepción sobre los beneficios de la afiliación institucional al ecosistema internacional ACM - Acceso a la ACM Digital Library (revistas, libros, papers y conferencias de investigación)",
    "type": "radio",
    "options": [
      "Altamente valioso",
      "Moderadamente valioso",
      "Poco valioso",
      "Desconocido / Sin información suficiente"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "af_credencial",
    "title": "47. Percepción sobre los beneficios de la afiliación institucional al ecosistema internacional ACM - Membresía formal, correo institucional @acm.org y distinción en el CV profesional",
    "type": "radio",
    "options": [
      "Altamente valioso",
      "Moderadamente valioso",
      "Poco valioso",
      "Desconocido / Sin información suficiente"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "af_networking",
    "title": "47. Percepción sobre los beneficios de la afiliación institucional al ecosistema internacional ACM - Pertenencia a la red científica de computación más prestigiada a nivel global",
    "type": "radio",
    "options": [
      "Altamente valioso",
      "Moderadamente valioso",
      "Poco valioso",
      "Desconocido / Sin información suficiente"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "af_descuentos",
    "title": "47. Percepción sobre los beneficios de la afiliación institucional al ecosistema internacional ACM - Becas para congresos internacionales, competencias globales y certificaciones",
    "type": "radio",
    "options": [
      "Altamente valioso",
      "Moderadamente valioso",
      "Poco valioso",
      "Desconocido / Sin información suficiente"
    ]
  },
  {
    "step": 10,
    "module": "Módulo 10: Logística, Afiliación y Sustentabilidad Financiera",
    "key": "disposicion_sustentabilidad",
    "title": "48. Respecto a la sustentabilidad de eventos (kits, refrigerios, licencias), ¿cuál es tu postura?",
    "type": "radio",
    "options": [
      "Todas las actividades deben financiarse exclusivamente con patrocinios externos o apoyos institucionales",
      "Aportación simbólica anual ($50 a $100 MXN) si incluye beneficios tangibles y descuentos en talleres",
      "Aportación anual intermedia ($101 a $200 MXN) con acceso prioritario a eventos masivos y kits",
      "Interés en adquirir la membresía estudiantil oficial internacional ACM con descuento institucional"
    ]
  },
  {
    "step": 11,
    "module": "Módulo 11: Prioridades de Gestión, Buzón y Propuestas",
    "key": "prioridad_mesa_directiva",
    "title": "49. ¿Cuál debe ser la máxima prioridad de la próxima Mesa Directiva del Capítulo ACM 2026–2027?",
    "type": "radio",
    "options": [
      "Capacitación técnica de alto nivel y preparación para el empleo en la industria de software",
      "Organización de hackathones presenciales y competencias de programación de gran impacto",
      "Gestión y colaboración para resolver necesidades de laboratorios e infraestructura del departamento",
      "Construcción de comunidad, programa de mentorías y bienvenida integral a nuevos estudiantes",
      "Vinculación con empresas tecnológicas líderes y egresados destacados en la industria nacional e internacional"
    ]
  },
  {
    "step": 11,
    "module": "Módulo 11: Prioridades de Gestión, Buzón y Propuestas",
    "key": "propuesta_cambio_unico",
    "title": "50. Si pudieras cambiar o implementar una sola cosa en la carrera de Ingeniería en Sistemas del ITCM, ¿cuál sería?",
    "type": "textarea",
    "options": []
  },
  {
    "step": 11,
    "module": "Módulo 11: Prioridades de Gestión, Buzón y Propuestas",
    "key": "comentarios_finales",
    "title": "51. Buzón abierto: Comentarios adicionales, observaciones o propuestas libres",
    "type": "textarea",
    "options": []
  },
  {
    "step": 11,
    "module": "Módulo 11: Prioridades de Gestión, Buzón y Propuestas",
    "key": "nombre",
    "title": "52. Nombre Completo (Opcional)",
    "type": "textarea",
    "options": []
  }
];

  // Elementos de UI
  const authGate = document.getElementById('authGate');
  const authForm = document.getElementById('authForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const authError = document.getElementById('authError');
  const btnLogout = document.getElementById('btnLogout');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnPrintReport = document.getElementById('btnPrintReport');
  const btnExportCsv = document.getElementById('btnExportCsv');

  // Elementos de Rigor
  const statDbRecords = document.getElementById('statDbRecords');
  const statSampleN = document.getElementById('statSampleN');
  const statCensoStatus = document.getElementById('statCensoStatus');
  const statMarginError = document.getElementById('statMarginError');
  const statConfidenceLevel = document.getElementById('statConfidenceLevel');

  // KPIs
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiTotalMeta = document.getElementById('kpiTotalMeta');
  const kpiTutorias = document.getElementById('kpiTutorias');
  const kpiTutoriasPct = document.getElementById('kpiTutoriasPct');
  const kpiGithub = document.getElementById('kpiGithub');
  const kpiVoluntarios = document.getElementById('kpiVoluntarios');
  const kpiVoluntariosSub = document.getElementById('kpiVoluntariosSub');

  // Estados de Vista
  const emptyStateGeneral = document.getElementById('emptyStateGeneral');
  const dashboardDataGrid = document.getElementById('dashboardDataGrid');

  // Explorador Reactivo por Reactivo
  const preguntaSelector = document.getElementById('preguntaSelector');
  const explorerSearchInput = document.getElementById('explorerSearchInput');
  const quickReactivosNav = document.getElementById('quickReactivosNav');
  const explorerModuleChips = document.getElementById('explorerModuleChips');
  const itemExplorerBadge = document.getElementById('itemExplorerBadge');
  const itemExplorerType = document.getElementById('itemExplorerType');
  const itemExplorerTitle = document.getElementById('itemExplorerTitle');
  const itemExplorerCount = document.getElementById('itemExplorerCount');
  const itemExplorerModa = document.getElementById('itemExplorerModa');
  const itemExplorerSecondaryStat = document.getElementById('itemExplorerSecondaryStat');
  const itemExplorerTableBody = document.getElementById('itemExplorerTableBody');
  const itemExplorerCanvasContainer = document.getElementById('itemExplorerCanvasContainer');
  const itemExplorerTextNotice = document.getElementById('itemExplorerTextNotice');
  const chartTypeBadge = document.getElementById('chartTypeBadge');

  // Voluntarios y Buzón
  const searchVoluntariosInput = document.getElementById('searchVoluntariosInput');
  const filterComiteSelect = document.getElementById('filterComiteSelect');
  const voluntariosTableBody = document.getElementById('voluntariosTableBody');
  const tabCountVoluntarios = document.getElementById('tabCountVoluntarios');

  const searchBuzonInput = document.getElementById('searchBuzonInput');
  const buzonGrid = document.getElementById('buzonGrid');
  const tabCountBuzon = document.getElementById('tabCountBuzon');

  // --------------------------------------------------------------------------
  // 1. CONTROL DE ACCESO
  // --------------------------------------------------------------------------
  function checkAuth() {
    const storedKey = sessionStorage.getItem(AUTH_KEY_STORAGE);
    const isAuth = VALID_KEYS.includes(storedKey);
    if (isAuth) {
      if (authGate) authGate.style.display = 'none';
      if (btnExportCsv) {
        btnExportCsv.href = `${API_BASE}/api/export-csv?key=${encodeURIComponent(storedKey)}`;
      }
      initCockpit();
    } else {
      if (authGate) authGate.style.display = 'flex';
      if (adminPasswordInput) adminPasswordInput.focus();
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasswordInput.value.trim().toLowerCase();
      if (VALID_KEYS.includes(entered)) {
        sessionStorage.setItem(AUTH_KEY_STORAGE, entered);
        if (btnExportCsv) {
          btnExportCsv.href = `${API_BASE}/api/export-csv?key=${encodeURIComponent(entered)}`;
        }
        authError.style.display = 'none';
        authGate.style.display = 'none';
        initCockpit();
      } else {
        authError.style.display = 'block';
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY_STORAGE);
      window.location.reload();
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      fetchDataset();
    });
  }

  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // MODAL DE CÓDIGO QR PARA PROYECCIÓN / DIFUSIÓN
  // --------------------------------------------------------------------------
  const btnShowQrDashboard = document.getElementById('btnShowQrDashboard');
  const btnShowQrEmpty = document.getElementById('btnShowQrEmpty');
  const qrModal = document.getElementById('qrModal');
  const btnCloseQrModal = document.getElementById('btnCloseQrModal');
  const qrImageDisplay = document.getElementById('qrImageDisplay');
  const qrUrlDisplay = document.getElementById('qrUrlDisplay');
  const btnDownloadQr = document.getElementById('btnDownloadQr');
  const btnShareQrWhatsApp = document.getElementById('btnShareQrWhatsApp');
  const btnCopyQrUrl = document.getElementById('btnCopyQrUrl');

  const surveyUrl = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? window.location.origin
    : 'http://localhost:3000';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(surveyUrl)}`;
  const shareMsg = `Compañero(a) de Sistemas ITCM, te invito a responder la Encuesta de Experiencia y Formación ISC 2026–2027 del Capítulo Estudiantil ACM. ¡Tu opinión cuenta!: ${surveyUrl}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;

  function openQrModal() {
    if (!qrModal) return;
    if (qrImageDisplay) qrImageDisplay.src = qrApiUrl;
    if (qrUrlDisplay) qrUrlDisplay.textContent = surveyUrl;
    if (btnShareQrWhatsApp) btnShareQrWhatsApp.href = waUrl;
    qrModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (btnShowQrDashboard) btnShowQrDashboard.addEventListener('click', openQrModal);
  if (btnShowQrEmpty) btnShowQrEmpty.addEventListener('click', openQrModal);
  if (btnCloseQrModal) btnCloseQrModal.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.style.display === 'flex') {
      closeQrModal();
    }
  });

  if (btnDownloadQr) {
    btnDownloadQr.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(qrApiUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'QR_Censo_ISC_ACM_ITCM.png';
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
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(surveyUrl);
        } else {
          const temp = document.createElement('input');
          temp.value = surveyUrl;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        alert('¡Enlace del Censo copiado al portapapeles!');
      } catch (err) {
        prompt('Copia el enlace del Censo:', surveyUrl);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. SISTEMA DE PESTAÑAS
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // 3. BARRA DE FILTROS CRUZADOS DEL DASHBOARD
  // --------------------------------------------------------------------------
  const filterChips = document.querySelectorAll('.filter-bar .filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      applyFilteringAndRender();
    });
  });

  // --------------------------------------------------------------------------
  // 4. INICIALIZACIÓN DEL EXPLORADOR MULTI-MÓDULO
  // --------------------------------------------------------------------------
  function initCockpit() {
    initExplorerControls();
    fetchDataset();
    clearInterval(refreshTimer);
    refreshTimer = setInterval(fetchDataset, 15000); // Sincronización cada 15 seg
  }

  function initExplorerControls() {
    // Chips de filtrado por módulo
    if (explorerModuleChips) {
      const chips = explorerModuleChips.querySelectorAll('.filter-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          currentModuleStep = chip.getAttribute('data-module-step');
          populateQuestionSelector();
        });
      });
    }

    // Buscador de reactivos por texto
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

    populateQuestionSelector();
  }

  function populateQuestionSelector() {
    if (!preguntaSelector) return;
    const searchTerm = explorerSearchInput ? explorerSearchInput.value.trim().toLowerCase() : '';

    // Filtrar catálogo según módulo activo y término de búsqueda
    const filteredQuestions = CATALOGO_PREGUNTAS.filter(q => {
      const matchesModule = (currentModuleStep === 'all') || (String(q.step) === String(currentModuleStep));
      const matchesSearch = !searchTerm || 
        q.title.toLowerCase().includes(searchTerm) || 
        q.key.toLowerCase().includes(searchTerm) ||
        (q.options && q.options.some(o => o.toLowerCase().includes(searchTerm)));
      return matchesModule && matchesSearch;
    });

    // Agrupar preguntas por módulo para los <optgroup>
    const grouped = {};
    filteredQuestions.forEach(q => {
      if (!grouped[q.module]) grouped[q.module] = [];
      grouped[q.module].push(q);
    });

    if (Object.keys(grouped).length === 0) {
      preguntaSelector.innerHTML = '<option value="">No se encontraron reactivos con ese criterio</option>';
      if (quickReactivosNav) quickReactivosNav.innerHTML = '';
      return;
    }

    preguntaSelector.innerHTML = Object.entries(grouped).map(([modLabel, questions]) => {
      const opts = questions.map(q => `<option value="${q.key}">${escapeHtml(q.title)}</option>`).join('');
      return `<optgroup label="${escapeHtml(modLabel)}">${opts}</optgroup>`;
    }).join('');

    // Renderizar botones rápidos de acceso a reactivos
    if (quickReactivosNav) {
      quickReactivosNav.innerHTML = filteredQuestions.map(q => {
        const matchNum = q.title.match(/^(\d+\.\d+)/);
        const shortNum = matchNum ? matchNum[1] : q.key.substring(0, 5);
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
  // 5. CARGA DEL DATASET COMPLETO DESDE EL BACKEND
  // --------------------------------------------------------------------------
  async function fetchDataset() {
    let datasetLoaded = null;

    try {
      if (btnRefresh) btnRefresh.textContent = 'Sincronizando...';
      
      const storedKey = sessionStorage.getItem(AUTH_KEY_STORAGE) || '';
      const headers = storedKey ? { 'x-admin-key': storedKey } : {};

      const res = await fetch(`${API_BASE}/api/respuestas`, { headers });
      if (res.ok) {
        datasetLoaded = await res.json();
      }
    } catch (netErr) {
      console.warn('No se pudo obtener /api/respuestas vía red:', netErr);
    }

    if (Array.isArray(datasetLoaded)) {
      rawResponses = datasetLoaded;
    } else if (!rawResponses || rawResponses.length === 0) {
      rawResponses = [];
    }

    try {
      applyFilteringAndRender();
    } catch (renderErr) {
      console.error('Error procesando métricas en dashboard:', renderErr);
    }

    if (btnRefresh) {
      btnRefresh.textContent = 'Sincronizar';
    }
  }

  // --------------------------------------------------------------------------
  // 6. CÁLCULO ESTADÍSTICO EN MEMORIA CON FILTROS CRUZADOS
  // --------------------------------------------------------------------------
  function applyFilteringAndRender() {
    let filtered = rawResponses;

    if (currentFilter === 'iniciales') {
      filtered = rawResponses.filter(r => ['1.º Semestre', '2.º Semestre', '3.º Semestre'].includes(r.semestre));
    } else if (currentFilter === 'intermedios') {
      filtered = rawResponses.filter(r => ['4.º Semestre', '5.º Semestre', '6.º Semestre'].includes(r.semestre));
    } else if (currentFilter === 'avanzados') {
      filtered = rawResponses.filter(r => ['7.º Semestre', '8.º Semestre', '9.º Semestre o superior'].includes(r.semestre));
    } else if (currentFilter === 'matutino') {
      filtered = rawResponses.filter(r => String(r.turno).toLowerCase().includes('matutino'));
    } else if (currentFilter === 'vespertino') {
      filtered = rawResponses.filter(r => String(r.turno).toLowerCase().includes('vespertino'));
    }

    const total = filtered.length;
    const totalGlobal = rawResponses.length;

    // 1. Barra de Rigor Estadístico
    if (statDbRecords) statDbRecords.textContent = `${totalGlobal}`;
    if (statSampleN) statSampleN.textContent = `${total}`;
    
    if (total === 0) {
      if (statCensoStatus) statCensoStatus.textContent = 'En espera de respuestas';
      if (statMarginError) statMarginError.textContent = 'Sin datos';
      if (statConfidenceLevel) statConfidenceLevel.textContent = 'Sin datos';
    } else {
      if (statCensoStatus) statCensoStatus.textContent = 'Levantamiento activo';
      if (statMarginError) statMarginError.textContent = 'Calculando sobre muestra real';
      if (statConfidenceLevel) statConfidenceLevel.textContent = 'Datos en recolección';
    }

    // 2. Manejo de Estado Vacío
    if (total === 0) {
      if (emptyStateGeneral) emptyStateGeneral.style.display = 'block';
      if (dashboardDataGrid) dashboardDataGrid.style.display = 'none';
      if (kpiTotal) kpiTotal.textContent = '0';
      if (kpiTotalMeta) kpiTotalMeta.textContent = '0 respuestas';
      if (kpiTutorias) kpiTutorias.textContent = '0.0';
      if (kpiTutoriasPct) kpiTutoriasPct.textContent = '0% alta prioridad';
      if (kpiGithub) kpiGithub.textContent = '0%';
      if (kpiVoluntarios) kpiVoluntarios.textContent = '0';
      if (kpiVoluntariosSub) kpiVoluntariosSub.textContent = '0 alumnos registrados';
      if (tabCountVoluntarios) tabCountVoluntarios.textContent = '0';
      if (tabCountBuzon) tabCountBuzon.textContent = '0';

      renderVoluntariosTable([]);
      renderBuzonGrid([]);
      renderSingleQuestionExplorer(preguntaSelector ? preguntaSelector.value : 'semestre');
      return;
    }

    // Si hay datos:
    if (emptyStateGeneral) emptyStateGeneral.style.display = 'none';
    if (dashboardDataGrid) dashboardDataGrid.style.display = 'block';

    // 3. KPIs
    if (kpiTotal) kpiTotal.textContent = total;
    if (kpiTotalMeta) kpiTotalMeta.textContent = `${total} ${total === 1 ? 'respuesta registrada' : 'respuestas registradas'}`;

    let sumaTut = 0;
    let altaTut = 0;
    let sinGithub = 0;
    const voluntariosList = [];
    const buzonList = [];

    filtered.forEach(r => {
      const tut = parseInt(r.urgenciaTutorias, 10);
      if (!isNaN(tut)) {
        sumaTut += tut;
        if (tut >= 4) altaTut++;
      }

      if (r.githubEstado && (r.githubEstado.toLowerCase().includes('no tengo') || r.githubEstado.toLowerCase().includes('vacía'))) {
        sinGithub++;
      }

      if (Array.isArray(r.comitesVoluntariado) && r.comitesVoluntariado.some(c => !c.toLowerCase().includes('no me interesa') && !c.toLowerCase().includes('solo asistente'))) {
        voluntariosList.push(r);
      }

      if (r.buzonAbierto && r.buzonAbierto.trim().length > 3) {
        buzonList.push({
          texto: r.buzonAbierto.trim(),
          semestre: r.semestre || 'No especificado',
          timestamp: r.timestamp
        });
      }
    });

    if (kpiTutorias) kpiTutorias.textContent = (sumaTut / total).toFixed(1);
    if (kpiTutoriasPct) kpiTutoriasPct.textContent = `${Math.round((altaTut / total) * 100)}% alta prioridad`;
    if (kpiGithub) kpiGithub.textContent = `${Math.round((sinGithub / total) * 100)}%`;
    if (kpiVoluntarios) kpiVoluntarios.textContent = voluntariosList.length;
    if (kpiVoluntariosSub) kpiVoluntariosSub.textContent = `${voluntariosList.length} en este segmento`;
    if (tabCountVoluntarios) tabCountVoluntarios.textContent = voluntariosList.length;
    if (tabCountBuzon) tabCountBuzon.textContent = buzonList.length;

    // 4. Gráficas del Cuadro de Mando
    renderCountsBar('chartMateriasCanvas', countField(filtered, 'materiasDificiles'), total, 6, COLORS.red);
    renderCountsDonut('chartPresenciaCanvas', countField(filtered, 'githubEstado'));
    renderCountsBar('chartTalleresCanvas', countField(filtered, 'talleresMastery'), total, 6, COLORS.blue);
    renderCountsDonut('chartSoberaniaCanvas', countField(filtered, 'soberaniaTecnologica'));
    renderCountsBar('chartEventosCanvas', countField(filtered, 'eventosMasivos'), total, 5, COLORS.green);
    renderCountsBar('chartRolesCanvas', countField(filtered, 'rolesAspirados'), total, 6, COLORS.blueLight);

    // 5. Cruces Multivariables
    renderCrossTab('chartCruceIACanvas', filtered, 'frecuenciaIA', 'impactoIA');
    renderCrossTab('chartCruceTutoriasCanvas', filtered, 'semestre', 'urgenciaTutorias');
    renderCrossTab('chartCruceGithubCanvas', filtered, 'githubEstado', 'confianzaEntrevista');
    renderCrossTab('chartCruceClimaCanvas', filtered, 'climaEstudiantil', 'sindromeImpostor');

    // 6. Explorador de Reactivos
    renderSingleQuestionExplorer(preguntaSelector ? preguntaSelector.value : 'semestre');

    // 7. Voluntarios y Buzón
    renderVoluntariosTable(voluntariosList);
    renderBuzonGrid(buzonList);
  }

  // --------------------------------------------------------------------------
  // 7. EXPLORADOR EXHAUSTIVO DE REACTIVOS (TABLA FORMAL DE FRECUENCIAS)
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

    // Textos de Cabecera
    if (itemExplorerTitle) itemExplorerTitle.textContent = qConfig.title;
    if (itemExplorerBadge) itemExplorerBadge.textContent = qConfig.module;
    if (itemExplorerType) {
      const typeMap = {
        'text': 'Campo de Texto',
        'textarea': 'Texto Abierto (Buzón)',
        'radio': 'Opción Única',
        'select': 'Menú Desplegable',
        'checkbox': 'Casillas Múltiples',
        'scale': 'Escala Likert (1 al 5)'
      };
      itemExplorerType.textContent = typeMap[qConfig.type] || qConfig.type;
    }

    // Si es campo puramente de texto libre (Nombre, Correo, No. Control, Buzón)
    const isFreeText = (qConfig.type === 'text' || qConfig.type === 'textarea');

    if (isFreeText) {
      if (itemExplorerCanvasContainer) itemExplorerCanvasContainer.style.display = 'none';
      if (itemExplorerTextNotice) itemExplorerTextNotice.style.display = 'block';
      if (chartTypeBadge) chartTypeBadge.textContent = 'Auditoría Cualitativa';

      const textValues = rawResponses.map(r => r[key]).filter(v => v && String(v).trim().length > 0);
      if (itemExplorerCount) itemExplorerCount.textContent = `Respuestas: ${textValues.length}`;
      if (itemExplorerModa) itemExplorerModa.textContent = textValues.length > 0 ? `Entradas: ${textValues.length}` : 'Sin datos';
      if (itemExplorerSecondaryStat) itemExplorerSecondaryStat.style.display = 'none';

      if (itemExplorerTableBody) {
        if (textValues.length === 0) {
          itemExplorerTableBody.innerHTML = `
            <tr>
              <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
                Reactivo cualitativo en blanco. Se listarán las entradas de los alumnos conforme se envíe el censo.
              </td>
            </tr>
          `;
        } else {
          itemExplorerTableBody.innerHTML = textValues.slice(0, 15).map((val, idx) => `
            <tr>
              <td colspan="4" style="font-size: 0.88rem; color: #1E293B; font-family: monospace;">
                <strong>#${idx + 1}:</strong> ${escapeHtml(String(val))}
              </td>
            </tr>
          `).join('');
        }
      }

      if (chartInstances['chartItemExplorerCanvas']) {
        chartInstances['chartItemExplorerCanvas'].destroy();
      }
      return;
    }

    // Si es campo cuantitativo o de opciones:
    if (itemExplorerCanvasContainer) itemExplorerCanvasContainer.style.display = 'flex';
    if (itemExplorerTextNotice) itemExplorerTextNotice.style.display = 'none';
    if (chartTypeBadge) chartTypeBadge.textContent = qConfig.type === 'scale' ? 'Escala 1 al 5' : 'Distribución Frecuencias';

    const counts = countField(rawResponses, key);
    const totalResponsesInQuestion = Object.values(counts).reduce((a, b) => a + b, 0);

    // Si no hay respuestas aún pero la pregunta tiene opciones predefinidas:
    if (totalResponsesInQuestion === 0) {
      if (itemExplorerCount) itemExplorerCount.textContent = 'Respuestas: 0';
      if (itemExplorerModa) itemExplorerModa.textContent = 'Moda: Sin respuestas';
      if (itemExplorerSecondaryStat) itemExplorerSecondaryStat.style.display = 'none';

      // Mostrar las opciones predefinidas con fi=0 y hi=0.0% para que el director pueda auditar el reactivo
      const displayOpts = (qConfig.options && qConfig.options.length > 0) ? qConfig.options : ['Sin opciones predefinidas'];
      if (itemExplorerTableBody) {
        itemExplorerTableBody.innerHTML = displayOpts.map(opt => `
          <tr>
            <td style="font-weight: 500; color: #334155;">${escapeHtml(opt)}</td>
            <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--tecnm-blue);">0</td>
            <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--text-secondary);">0.0%</td>
            <td>
              <div class="freq-bar-mini-wrapper">
                <div class="freq-bar-mini-fill" style="width: 0%;"></div>
              </div>
            </td>
          </tr>
        `).join('');
      }

      // Gráfica vacía
      renderCountsBar('chartItemExplorerCanvas', {}, 0, 8, COLORS.blue);
      return;
    }

    // Si hay respuestas registradas:
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const moda = sortedEntries.length > 0 ? sortedEntries[0][0] : '-';

    if (itemExplorerCount) itemExplorerCount.textContent = `Respuestas: ${totalResponsesInQuestion}`;
    if (itemExplorerModa) itemExplorerModa.textContent = `Moda: ${moda.substring(0, 26)}`;

    // Si es escala numérica 1-5, calcular promedio
    if (qConfig.type === 'scale') {
      let suma = 0;
      let totalScales = 0;
      Object.entries(counts).forEach(([val, freq]) => {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          suma += (num * freq);
          totalScales += freq;
        }
      });
      if (totalScales > 0 && itemExplorerSecondaryStat) {
        const avg = (suma / totalScales).toFixed(2);
        itemExplorerSecondaryStat.textContent = `Promedio: ${avg} / 5.0`;
        itemExplorerSecondaryStat.style.display = 'inline-block';
      }
    } else {
      if (itemExplorerSecondaryStat) itemExplorerSecondaryStat.style.display = 'none';
    }

    // Tabla Formal con Proporciones
    if (itemExplorerTableBody) {
      itemExplorerTableBody.innerHTML = sortedEntries.map(([opcion, freq]) => {
        const pct = ((freq / totalResponsesInQuestion) * 100).toFixed(1);
        return `
          <tr>
            <td style="font-weight: 600; color: #1E293B;">${escapeHtml(opcion)}</td>
            <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--tecnm-blue);">${freq}</td>
            <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--text-secondary);">${pct}%</td>
            <td>
              <div class="freq-bar-mini-wrapper">
                <div class="freq-bar-mini-fill" style="width: ${pct}%;"></div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Gráfica
    if (qConfig.type === 'radio' && sortedEntries.length <= 4) {
      renderCountsDonut('chartItemExplorerCanvas', counts);
    } else {
      renderCountsBar('chartItemExplorerCanvas', counts, totalResponsesInQuestion, 10, COLORS.blue);
    }
  }

  // --------------------------------------------------------------------------
  // 8. HELPERS DE CONTEO Y MATRIZ DE CRUCES
  // --------------------------------------------------------------------------
  function countField(dataset, key) {
    const counts = {};
    dataset.forEach(r => {
      const val = r[key];
      if (!val) return;
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

  function renderCrossTab(canvasId, dataset, keyX, keyY) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    if (dataset.length === 0) return;

    const countX = countField(dataset, keyX);
    const topX = Object.entries(countX).sort((a, b) => b[1] - a[1]).slice(0, 4).map(e => e[0]);

    const countY = countField(dataset, keyY);
    const topY = Object.entries(countY).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    if (topX.length === 0 || topY.length === 0) return;

    const datasets = topY.map((labelY, idx) => {
      const data = topX.map(labelX => {
        return dataset.filter(r => {
          const vx = Array.isArray(r[keyX]) ? r[keyX].includes(labelX) : r[keyX] === labelX;
          const vy = Array.isArray(r[keyY]) ? r[keyY].includes(labelY) : r[keyY] === labelY;
          return vx && vy;
        }).length;
      });

      return {
        label: labelY.length > 25 ? labelY.substring(0, 22) + '...' : labelY,
        data: data,
        backgroundColor: COLORS.paletteList[idx % COLORS.paletteList.length],
        borderRadius: 4
      };
    });

    const ctx = canvas.getContext('2d');
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topX.map(l => l.length > 18 ? l.substring(0, 16) + '...' : l),
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  function renderCountsBar(canvasId, countsObj, total, limit = 6, barColor = COLORS.blue) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    if (!countsObj || Object.keys(countsObj).length === 0 || total === 0) {
      const ctx = canvas.getContext('2d');
      chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Sin datos'],
          datasets: [{ data: [0], backgroundColor: '#E2E8F0' }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
      return;
    }

    const sorted = Object.entries(countsObj).sort((a, b) => b[1] - a[1]).slice(0, limit);
    const labels = sorted.map(e => e[0].length > 32 ? e[0].substring(0, 30) + '...' : e[0]);
    const values = sorted.map(e => e[1]);

    const ctx = canvas.getContext('2d');
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: barColor,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.raw} alumnos (${Math.round((context.raw / total) * 100)}%)`
            }
          }
        },
        scales: {
          x: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
          y: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' }, color: '#0F2137' } }
        }
      }
    });
  }

  function renderCountsDonut(canvasId, countsObj) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    if (!countsObj || Object.keys(countsObj).length === 0) return;

    const entries = Object.entries(countsObj);
    const total = entries.reduce((a, b) => a + b[1], 0);
    if (total === 0) return;

    const labels = entries.map(e => e[0].length > 25 ? e[0].substring(0, 22) + '...' : e[0]);
    const values = entries.map(e => e[1]);

    const ctx = canvas.getContext('2d');
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: COLORS.paletteList.slice(0, entries.length),
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.raw} (${Math.round((context.raw / total) * 100)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. BANCO DE VOLUNTARIOS
  // --------------------------------------------------------------------------
  function renderVoluntariosTable(list) {
    if (!voluntariosTableBody) return;

    if (list.length === 0) {
      voluntariosTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
            No hay voluntarios registrados en este filtro.
          </td>
        </tr>
      `;
      return;
    }

    voluntariosTableBody.innerHTML = list.map(v => {
      const nombre = v.nombre || 'Anónimo';
      const nc = v.numeroControl || '-';
      const sem = v.semestre || '-';
      const tel = v.telefono ? String(v.telefono).trim() : '';
      const telClean = tel.replace(/\D/g, '');
      
      const comites = Array.isArray(v.comitesVoluntariado) 
        ? v.comitesVoluntariado.filter(c => !c.toLowerCase().includes('solo asistente')).join(', ')
        : (v.comitesVoluntariado || 'General');

      const waBtn = telClean.length >= 10
        ? `<a href="https://wa.me/52${telClean}?text=Hola%20${encodeURIComponent(nombre)}%2C%20te%20escribimos%20del%20Cap%C3%ADtulo%20Estudiantil%20ACM%20ITCM%20sobre%20tu%20registro%20como%20voluntario" target="_blank" class="btn-action-whatsapp">WhatsApp (${escapeHtml(telClean.slice(-4))})</a>`
        : `<span style="color: var(--text-muted); font-size: 0.75rem;">Sin teléfono</span>`;

      return `
        <tr>
          <td style="font-weight: 700; color: #0F2137;">${escapeHtml(nombre)}</td>
          <td style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--tecnm-blue);">${escapeHtml(nc)}</td>
          <td>${escapeHtml(sem)}</td>
          <td style="font-size: 0.8rem; max-width: 320px;">${escapeHtml(comites)}</td>
          <td>${waBtn}</td>
        </tr>
      `;
    }).join('');
  }

  if (searchVoluntariosInput || filterComiteSelect) {
    const filterHandler = () => {
      const q = searchVoluntariosInput ? searchVoluntariosInput.value.toLowerCase() : '';
      const comite = filterComiteSelect ? filterComiteSelect.value.toLowerCase() : '';

      const filteredVoluntarios = rawResponses.filter(r => {
        if (!Array.isArray(r.comitesVoluntariado) || !r.comitesVoluntariado.some(c => !c.toLowerCase().includes('solo asistente'))) {
          return false;
        }
        const matchText = (r.nombre && r.nombre.toLowerCase().includes(q)) || 
                          (r.numeroControl && r.numeroControl.toLowerCase().includes(q));
        const matchComite = !comite || r.comitesVoluntariado.some(c => c.toLowerCase().includes(comite));
        return matchText && matchComite;
      });

      renderVoluntariosTable(filteredVoluntarios);
    };

    if (searchVoluntariosInput) searchVoluntariosInput.addEventListener('input', filterHandler);
    if (filterComiteSelect) filterComiteSelect.addEventListener('change', filterHandler);
  }

  // --------------------------------------------------------------------------
  // 10. MURO DEL BUZÓN ABIERTO
  // --------------------------------------------------------------------------
  function renderBuzonGrid(list) {
    if (!buzonGrid) return;

    if (list.length === 0) {
      buzonGrid.innerHTML = `
        <p style="color: var(--text-muted); padding: 30px; text-align: center; width: 100%;">
          No hay mensajes en el buzón abierto en este filtro.
        </p>
      `;
      return;
    }

    buzonGrid.innerHTML = list.map(item => `
      <div class="quote-card">
        <p class="quote-text">"${escapeHtml(item.texto)}"</p>
        <div class="quote-author">
          <span>Estudiante (${escapeHtml(item.semestre)})</span>
          <span>${item.timestamp ? new Date(item.timestamp).toLocaleDateString('es-MX') : 'Censo Oficial'}</span>
        </div>
      </div>
    `).join('');
  }

  if (searchBuzonInput) {
    searchBuzonInput.addEventListener('input', () => {
      const q = searchBuzonInput.value.toLowerCase().trim();
      const buzonList = [];

      rawResponses.forEach(r => {
        if (r.buzonAbierto && r.buzonAbierto.trim().length > 3) {
          if (!q || r.buzonAbierto.toLowerCase().includes(q)) {
            buzonList.push({
              texto: r.buzonAbierto.trim(),
              semestre: r.semestre || 'No especificado',
              timestamp: r.timestamp
            });
          }
        }
      });

      renderBuzonGrid(buzonList);
    });
  }

  // Helper Sanitizador XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Arranque
  checkAuth();
});
