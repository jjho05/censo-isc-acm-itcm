/**
 * ============================================================================
 * SCRIPT DE GOOGLE APPS SCRIPT: GENERADOR AUTOMÁTICO DE ENCUESTA ACM ITCM
 * ============================================================================
 * Autor: Jesús Javier Hernández Olvera (N.C. 23070477)
 * Proyecto: Capítulo Estudiantil ACM ITCM 2026-2027
 * Versión: 2.0 (11 Módulos Completos Sincronizados con README)
 * 
 * INSTRUCCIONES DE USO:
 * 1. Entra a https://script.google.com/ con tu cuenta de Google.
 * 2. Haz clic en "Nuevo proyecto" (New project).
 * 3. Borra el código por defecto y pega todo este archivo.
 * 4. Haz clic en el botón "Ejecutar" (Run) con la función 'crearEncuestaCompletaACM'.
 * 5. Otorga los permisos de Google Drive cuando te los solicite.
 * 6. En el registro (Logs) aparecerán los enlaces de edición y público en 5 segundos.
 * ============================================================================
 */

function crearEncuestaCompletaACM() {
  var titulo = "CENSO DE DIAGNÓSTICO ESTUDIANTIL Y CONSULTA INTEGRAL ISC 2026 | CAPÍTULO ACM ITCM";
  var form = FormApp.create(titulo);
  
  form.setDescription(
    "Compañera, compañero de Ingeniería en Sistemas Computacionales del ITCM:\n\n" +
    "Esta consulta es un censo técnico y de diagnóstico estudiantil institucional coordinado por y para estudiantes. " +
    "La información recabada fundamentará con datos duros y rigor científico el Plan de Trabajo Estratégico del Capítulo " +
    "Estudiantil ACM ITCM para el ciclo 2026–2027.\n\n" +
    "⏱️ Tiempo estimado: 6 a 8 minutos.\n" +
    "🛡️ Confidencialidad y Uso Ético: Tus datos personales se manejarán con estricta responsabilidad institucional y servirán para " +
    "registrarte formalmente a la red de beneficios, talleres, dinámicas de bienvenida y comités del Capítulo.\n" +
    "🎯 Impacto: Tus respuestas definirán la oferta de bootcamps certificados, hackathons, tutorías y proyectos de software para el campus.\n\n" +
    "¡Tu participación es el motor de la transformación en Sistemas!"
  );
  
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);
  
  // --------------------------------------------------------------------------
  // MÓDULO 1: DATOS DE IDENTIFICACIÓN
  // --------------------------------------------------------------------------
  var itemNombre = form.addTextItem();
  itemNombre.setTitle("1.1 Nombre Completo");
  itemNombre.setHelpText("Ingresa tus nombres y apellidos completos (tal como aparecen en el SII).");
  itemNombre.setRequired(true);
  
  var itemControl = form.addTextItem();
  itemControl.setTitle("1.2 Número de Control");
  itemControl.setHelpText("Número de control oficial del ITCM (ejemplo: 23070477).");
  itemControl.setRequired(true);
  
  var itemCorreo = form.addTextItem();
  itemCorreo.setTitle("1.3 Correo Electrónico Principal");
  itemCorreo.setHelpText("Correo institucional (@cdmadero.tecnm.mx) o personal que revises frecuentemente.");
  itemCorreo.setRequired(true);
  
  var itemTel = form.addTextItem();
  itemTel.setTitle("1.4 Número de Teléfono Celular / WhatsApp");
  itemTel.setHelpText("A 10 dígitos para agregarte a la comunidad oficial de avisos y coordinar entrega de beneficios.");
  itemTel.setRequired(true);
  
  var itemGenero = form.addMultipleChoiceItem();
  itemGenero.setTitle("1.5 Género");
  itemGenero.setHelpText("Permite calcular métricas para impulsar iniciativas de equidad tecnológica y el capítulo ACM-W.");
  itemGenero.setChoiceValues(["Femenino", "Masculino", "No binario / Otro", "Prefiero no responder"]);
  itemGenero.setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 2: TRAYECTORIA ACADÉMICA Y CONTEXTO
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 2: Trayectoria Académica, Movilidad y Recursos de Trabajo")
      .setHelpText("Caracterización de tu entorno universitario, tiempos y herramientas de estudio.");
  
  var itemSemestre = form.addMultipleChoiceItem();
  itemSemestre.setTitle("2.1 ¿En qué semestre te encuentras formalmente inscrito?");
  itemSemestre.setChoiceValues([
    "1.º Semestre (Nuevo Ingreso)", "2.º Semestre", "3.º Semestre", "4.º Semestre",
    "5.º Semestre", "6.º Semestre", "7.º Semestre", "8.º Semestre",
    "9.º Semestre o superior", "Egresado / En Residencia Profesional"
  ]).setRequired(true);
  
  var itemTurno = form.addMultipleChoiceItem();
  itemTurno.setTitle("2.2 ¿En qué turno tomas la mayor carga de tus asignaturas presenciales?");
  itemTurno.setChoiceValues([
    "Turno Matutino (07:00 a 13:00 hrs)",
    "Turno Vespertino (13:00 a 20:00 hrs)",
    "Turno Mixto / Horario Disperso"
  ]).setRequired(true);
  
  var itemTrabajo = form.addMultipleChoiceItem();
  itemTrabajo.setTitle("2.3 Además de tus estudios en el ITCM, ¿cuál es tu situación laboral?");
  itemTrabajo.setChoiceValues([
    "Estudiante de tiempo completo (dedicación 100% a la carrera)",
    "Estudio y trabajo en desarrollo de software / soporte de TI / freelance tech",
    "Estudio y trabajo en un área no tecnológica (comercio, servicios)",
    "Estudio y administro un emprendimiento propio",
    "Estudio y participo en selecciones deportivas o culturales representativas"
  ]).setRequired(true);

  var itemTraslado = form.addMultipleChoiceItem();
  itemTraslado.setTitle("2.4 ¿Cuánto tiempo te toma trasladarte diariamente al ITCM (un solo sentido)?");
  itemTraslado.setChoiceValues([
    "Menos de 20 minutos (vivo cerca o en zona universitaria)",
    "Entre 20 y 45 minutos",
    "Entre 45 minutos y 1 hora y media (traslado interurbano Tampico-Madero-Altamira)",
    "Más de 1 hora y media diaria"
  ]).setRequired(true);

  var itemLaptop = form.addMultipleChoiceItem();
  itemLaptop.setTitle("2.5 ¿Dispones de una computadora portátil (laptop) propia para tus clases y laboratorios?");
  itemLaptop.setChoiceValues([
    "Sí, laptop propia con buen rendimiento para compilar y virtualizar",
    "Sí, pero tiene limitaciones severas (batería dañada, poca memoria RAM o lentitud)",
    "No cuento con laptop propia; dependo al 100% de los laboratorios o de una PC en casa"
  ]).setRequired(true);

  var itemOS = form.addMultipleChoiceItem();
  itemOS.setTitle("2.6 ¿Cuál es el Sistema Operativo principal que utilizas para programar?");
  itemOS.setChoiceValues([
    "Windows (10 / 11) de forma nativa",
    "Windows con Subsistema de Linux (WSL / WSL2)",
    "Distribución nativa de Linux (Ubuntu, Fedora, Debian, Arch, Mint)",
    "macOS (MacBook / Apple Silicon)",
    "No programo en equipo propio"
  ]).setRequired(true);

  var itemInternet = form.addMultipleChoiceItem();
  itemInternet.setTitle("2.7 ¿Dispones de conexión a internet estable en tu lugar de residencia?");
  itemInternet.setChoiceValues([
    "Sí, conexión rápida y estable (Fibra óptica / Cable)",
    "Sí, pero la conexión es lenta o inestable",
    "No tengo internet fijo; dependo de datos móviles o del Wi-Fi del Tec"
  ]).setRequired(true);

  var itemHorasLibres = form.addMultipleChoiceItem();
  itemHorasLibres.setTitle("2.8 En promedio, ¿cuántas 'horas libres o muertas' tienes a la semana en el campus?");
  itemHorasLibres.setChoiceValues([
    "Menos de 2 horas semanales (horario continuo y compacto)",
    "De 3 a 5 horas semanales",
    "De 6 a 10 horas semanales",
    "Más de 10 horas semanales dispersas en el campus"
  ]).setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 3: DIAGNÓSTICO CURRICULAR Y RETENCIÓN ESCOLAR
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 3: Realidad Académica, Materias Filtro y Retención Escolar")
      .setHelpText("Dificultad de asignaturas, deserción y necesidad de acompañamiento.");

  var itemMaterias = form.addCheckboxItem();
  itemMaterias.setTitle("3.1 Asignaturas con mayor nivel de complejidad, rezago o riesgo de reprobación:");
  itemMaterias.setChoiceValues([
    "Fundamentos de Programación (1.º semestre)",
    "Programación Orientada a Objetos (2.º semestre)",
    "Estructuras de Datos y Algoritmos (3.º semestre)",
    "Cálculo Diferencial / Integral / Vectorial",
    "Álgebra Lineal / Métodos Numéricos",
    "Ecuaciones Diferenciales / Probabilidad y Estadística",
    "Principios Eléctricos y Arquitectura de Computadoras",
    "Lenguajes y Autómatas I y II / Compiladores",
    "Fundamentos de Telecomunicaciones / Redes de Computadoras",
    "Taller de Bases de Datos / Administración de BD",
    "Sistemas Operativos / Sistemas Distribuidos",
    "Programación Web / Desarrollo Móvil",
    "Graficación / Inteligencia Artificial",
    "Ninguna asignatura me ha representado dificultad significativa"
  ]);

  var itemCausas = form.addCheckboxItem();
  itemCausas.setTitle("3.2 Factores principales por los cuales los estudiantes reprueban programación/matemáticas:");
  itemCausas.setChoiceValues([
    "Enfoque excesivamente teórico: poca codificación práctica en clase",
    "Docentes que no explican la lógica algorítmica paso a paso con paciencia",
    "Uso de herramientas o compiladores anticuados que dificultan la comprensión",
    "Deficiencias en razonamiento lógico-matemático desde el bachillerato",
    "El ritmo del semestre avanza demasiado rápido sin tiempo para resolver dudas",
    "Inexistencia de asesorías extracurriculares entre alumnos con explicaciones accesibles",
    "Desinterés, falta de estudio individual y procrastinación del propio alumno"
  ]);

  var itemBaja = form.addMultipleChoiceItem();
  itemBaja.setTitle("3.3 ¿Has considerado darte de baja temporal, definitiva o cambiarte de carrera por dificultad o estrés?");
  itemBaja.setChoiceValues([
    "Sí, lo he pensado seriamente en momentos de alta reprobación o estrés",
    "Lo llegué a considerar al inicio (1.º a 3.º semestre), pero logré adaptarme",
    "Raras veces me ha cruzado por la mente",
    "Nunca; estoy 100% seguro y motivado con la carrera de Sistemas"
  ]).setRequired(true);

  var itemHorasEstudio = form.addMultipleChoiceItem();
  itemHorasEstudio.setTitle("3.4 Tiempo semanal dedicado al estudio autónomo o práctica de código fuera de clases:");
  itemHorasEstudio.setChoiceValues([
    "Menos de 2 horas semanales (solo hago tareas indispensables)",
    "Entre 3 y 6 horas semanales",
    "Entre 7 y 12 horas semanales",
    "Más de 12 horas semanales (desarrollo proyectos personales de forma autodidacta)"
  ]).setRequired(true);

  var itemLenguajes = form.addCheckboxItem();
  itemLenguajes.setTitle("3.5 Lenguajes de programación que dominas con confianza para crear proyectos funcionales:");
  itemLenguajes.setChoiceValues([
    "Java", "C / C++", "Python", "JavaScript / TypeScript", "C# (.NET)",
    "PHP", "SQL (PostgreSQL / MySQL)", "Kotlin / Swift / Dart (Móvil)",
    "Rust / Go", "Ninguno todavía; me cuesta estructurar código sin ayuda"
  ]);

  var itemUsoIA = form.addMultipleChoiceItem();
  itemUsoIA.setTitle("3.6 ¿Con qué frecuencia utilizas asistentes de Inteligencia Artificial (ChatGPT, Copilot, Claude, Gemini)?");
  itemUsoIA.setChoiceValues([
    "Diariamente: como mi tutor principal para entender la lógica y depurar",
    "Frecuentemente: copio código cuando me atoro o no tengo tiempo",
    "Ocasionalmente: solo para recordar sintaxis de funciones o comandos",
    "Casi nunca o nunca: prefiero investigar en libros o documentación oficial"
  ]).setRequired(true);

  var itemImpactoIA = form.addMultipleChoiceItem();
  itemImpactoIA.setTitle("3.7 ¿Sientes que el uso continuo de IA afecta tu capacidad de resolver algoritmos por ti mismo?");
  itemImpactoIA.setChoiceValues([
    "No, al contrario: me ayuda a entender mejor los conceptos y aprender más rápido",
    "Sí, reconozco que me he vuelto dependiente y me bloqueo si tengo que programar sin IA",
    "Es un balance neutral: la uso como herramienta de apoyo, no de reemplazo",
    "No aplica (no utilizo IA)"
  ]).setRequired(true);

  var itemTutorias = form.addScaleItem();
  itemTutorias.setTitle("3.8 Urgencia del programa formal de tutorías entre pares 'Padres de Sistemas':");
  itemTutorias.setBounds(1, 5);
  itemTutorias.setLabels("Nada urgente / Innecesario", "Crítico / Urgente (Evitaría reprobaciones)");
  itemTutorias.setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 4: BRECHA TECNOLÓGICA Y EMPLEABILIDAD
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 4: Competitividad Laboral, Portafolio y Habilidades de Industria")
      .setHelpText("Evaluación de competencias requeridas por la industria de software nacional y global.");

  var itemGridTech = form.addGridItem();
  itemGridTech.setTitle("4.1 Nivel de dominio práctico en competencias tecnológicas de alta demanda:");
  itemGridTech.setRows([
    "Git & GitHub (GitFlow, ramas, Pull Requests)",
    "Docker y entornos de contenedores",
    "Linux y administración básica por terminal (Bash, SSH)",
    "Diseño y consumo de APIs REST / GraphQL",
    "Frameworks modernos de Frontend (React, Next.js, Vue)",
    "Desarrollo Backend con bases de datos (Node, Spring, FastAPI)",
    "Bases de datos NoSQL / Cloud (MongoDB, Firebase, Supabase)",
    "Despliegue en la Nube (AWS, Azure, GCP, Vercel)",
    "Integración programática de Inteligencia Artificial (APIs LLMs)",
    "Ciberseguridad, testing automatizado y código seguro",
    "Algoritmos para entrevistas técnicas (LeetCode / HackerRank)"
  ]);
  itemGridTech.setColumns([
    "1. Nulo", "2. Básico", "3. Intermedio", "4. Avanzado", "5. Profesional"
  ]);

  var itemGitHub = form.addMultipleChoiceItem();
  itemGitHub.setTitle("4.2 ¿Cuentas con un perfil activo en GitHub con repositorios personales documentados?");
  itemGitHub.setChoiceValues([
    "Sí, repositorios ordenados con Readme documentados y código original",
    "Tengo cuenta, pero está prácticamente vacía o solo contiene tareas básicas",
    "No tengo cuenta en GitHub o no sé cómo utilizarlo profesionalmente"
  ]).setRequired(true);

  var itemLinkedIn = form.addMultipleChoiceItem();
  itemLinkedIn.setTitle("4.3 ¿Cuentas con un perfil profesional optimizado en LinkedIn?");
  itemLinkedIn.setChoiceValues([
    "Sí, actualizado con proyectos, certificaciones y contactos de tecnología",
    "Tengo cuenta, pero inactiva o con información incompleta",
    "No tengo cuenta en LinkedIn"
  ]).setRequired(true);

  var itemIngles = form.addMultipleChoiceItem();
  itemIngles.setTitle("4.4 Nivel de competencia en Inglés Técnico orientado a sistemas:");
  itemIngles.setChoiceValues([
    "Básico / Nulo: dependo al 100% de traductores para leer documentación",
    "Intermedio de lectura: leo manuales técnicos bien, pero no lo hablo",
    "Intermedio-Avanzado: puedo mantener una conversación y explicar un proyecto técnico",
    "Avanzado / Bilingüe: totalmente capacitado para entrevistas laborales en inglés"
  ]).setRequired(true);

  var itemCertificaciones = form.addMultipleChoiceItem();
  itemCertificaciones.setTitle("4.5 ¿Cuentas con certificaciones técnicas oficiales (AWS, Azure, Cisco, Google, etc.)?");
  itemCertificaciones.setChoiceValues([
    "Sí, cuento con 1 o más certificaciones oficiales vigentes",
    "He tomado cursos libres en línea, pero sin certificado oficial",
    "No he tomado cursos ni certificaciones externas",
    "Deseo certificarme, pero los costos de los exámenes son inaccesibles"
  ]).setRequired(true);

  var itemEntrevista = form.addScaleItem();
  itemEntrevista.setTitle("4.6 ¿Qué tan preparado/a te sientes hoy para una prueba técnica de código en vivo (Coding Interview)?");
  itemEntrevista.setBounds(1, 5);
  itemEntrevista.setLabels("Totalmente indefenso / Pánico", "Plenamente preparado y seguro");
  itemEntrevista.setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 5: ESPECIALIDADES OFICIALES, RESIDENCIA E INNOVATECNM
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 5: Especialidades de la Carrera, Residencia y Concursos de Innovación")
      .setHelpText("Orientación terminal de la carrera, vinculación productiva y eventos del TecNM.");

  var itemEspecialidad = form.addMultipleChoiceItem();
  itemEspecialidad.setTitle("5.1 ¿Cuál de las especialidades oficiales de Sistemas te interesa cursar o estás cursando actualmente?");
  itemEspecialidad.setChoiceValues([
    "Ciencia de Datos",
    "Tecnologías Móviles",
    "Aún no decido / En primeros semestres"
  ]).setRequired(true);

  var itemResidencia = form.addMultipleChoiceItem();
  itemResidencia.setTitle("5.2 Al pensar en tu Residencia Profesional (semestres finales), ¿cuál es tu mayor preocupación?");
  itemResidencia.setChoiceValues([
    "No contar con los conocimientos técnicos prácticos que exigen las empresas",
    "Falta de contactos o empresas que ofrezcan proyectos remunerados o de alto nivel",
    "El proceso administrativo y papeleo engorroso ante el departamento",
    "Ninguna; ya tengo empresa o proyecto definido"
  ]).setRequired(true);

  var itemInnova = form.addMultipleChoiceItem();
  itemInnova.setTitle("5.3 ¿Conoces InnovaTecNM y te interesaría competir representando al ITCM?");
  itemInnova.setChoiceValues([
    "Sí, me encantaría desarrollar un prototipo y competir en InnovaTecNM",
    "He escuchado de ella, pero no tengo equipo ni asesor docente",
    "No la conozco, pero me gustaría recibir información",
    "No me interesan los concursos de innovación"
  ]).setRequired(true);

  var itemRol = form.addCheckboxItem();
  itemRol.setTitle("5.4 ¿Hacia qué rol profesional específico aspiras integrarte al egresar?");
  itemRol.setChoiceValues([
    "Fullstack Developer (Frontend + Backend)",
    "Backend Engineer (APIs, Arquitectura, Bases de Datos)",
    "Frontend / Mobile Developer (React, Flutter, UI)",
    "DevOps / Cloud Engineer (AWS, Docker, CI/CD)",
    "Analista / Ingeniero de Ciberseguridad",
    "Data Scientist / AI Engineer",
    "QA Engineer / Tester Automatizador",
    "Project Manager / Líder Técnico de Proyectos"
  ]);

  // --------------------------------------------------------------------------
  // MÓDULO 6: INFRAESTRUCTURA Y SOBERANÍA TECNOLÓGICA
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 6: Infraestructura del Campus, Laboratorios y Desarrollo Propio")
      .setHelpText("Condiciones materiales y desarrollo de software por alumnos para el ITCM.");

  var itemEvalLabs = form.addScaleItem();
  itemEvalLabs.setTitle("6.1 Calificación general de los Laboratorios de Cómputo de Sistemas en el ITCM:");
  itemEvalLabs.setBounds(1, 5);
  itemEvalLabs.setLabels("Deplorables / Inoperantes", "Excelentes / Primer nivel");
  itemEvalLabs.setRequired(true);

  var itemDeficiencias = form.addCheckboxItem();
  itemDeficiencias.setTitle("6.2 Mayores deficiencias materiales experimentadas en laboratorios y aulas:");
  itemDeficiencias.setChoiceValues([
    "Red Wi-Fi institucional lenta, inestable o con bloqueos excesivos",
    "Computadoras de laboratorio muy lentas, poca RAM o discos mecánicos",
    "Falta de software actualizado (IDEs, compiladores, Docker, Python, Git)",
    "Escasez crítica de contactos eléctricos en salones para laptops",
    "Fallas o falta de aire acondicionado en aulas y laboratorios",
    "Laboratorios cerrados con llave fuera de horas de clase obligatorias",
    "Falta de un área de estudio silenciosa y colaborativa para programar",
    "Trámites manuales burocráticos y papeleo para solicitar salas o material"
  ]);

  var itemSoberania = form.addMultipleChoiceItem();
  itemSoberania.setTitle("6.3 ¿Qué opinas de que el Capítulo ACM desarrolle sistemas propios para el ITCM (control QR/RFID, reserva de PCs)?");
  itemSoberania.setChoiceValues([
    "Totalmente a favor: es la mejor forma de aplicar ingeniería y transformar el campus",
    "A favor, siempre que la directiva brinde los permisos y apoyo necesarios",
    "Indiferente mientras las instalaciones funcionen",
    "En contra: deberían contratar a empresas externas"
  ]).setRequired(true);

  var itemParticiparDev = form.addMultipleChoiceItem();
  itemParticiparDev.setTitle("6.4 ¿Estarías dispuesto/a a integrarte a un equipo de desarrollo de software para modernizar el Tec?");
  itemParticiparDev.setChoiceValues([
    "¡Por supuesto! Me apasiona programar y quiero proyectos reales en mi currículum",
    "Sí, si se me valida para Servicio Social, Créditos Complementarios o Residencia",
    "Solo como usuario final / tester ocasional",
    "No dispongo de tiempo"
  ]).setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 7: CULTURA, BIENESTAR Y CONFORMISMO
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 7: Cultura Estudiantil, Bienestar, Motivación y Síndrome del Impostor")
      .setHelpText("Clima social, superación colectiva y bienestar emocional del estudiante de sistemas.");

  var itemClima = form.addMultipleChoiceItem();
  itemClima.setTitle("7.1 Actitud predominante percibida en la comunidad estudiantil de Sistemas:");
  itemClima.setChoiceValues([
    "Hay compañerismo, pero se normaliza el conformismo ('pasar con 70', ocio pasivo)",
    "Comunidad fragmentada en grupitos aislados sin sentido de pertenencia",
    "Ambiente estimulante donde la gente se motiva a aprender y programar",
    "Ambiente desmotivador o con rivalidades estériles"
  ]).setRequired(true);

  var itemImpostor = form.addMultipleChoiceItem();
  itemImpostor.setTitle("7.2 ¿Has experimentado el 'Síndrome del Impostor' (dudar si eres capaz de programar o si sirves para esto)?");
  itemImpostor.setChoiceValues([
    "Sí, con mucha frecuencia: me causa ansiedad y dudas constantes",
    "Ocasionalmente, ante proyectos o materias muy complejas",
    "Raras veces: confío en mi ritmo de aprendizaje",
    "Nunca he sentido esa inseguridad"
  ]).setRequired(true);

  var itemOcio = form.addMultipleChoiceItem();
  itemOcio.setTitle("7.3 ¿En qué sueles emplear la mayor parte de tus horas libres en el campus?");
  itemOcio.setChoiceValues([
    "Platicar, convivir o almorzar con amigos en áreas comunes",
    "Consumo pasivo en celular/consola (videojuegos móviles, series, redes)",
    "Estudiar, avanzar tareas escolares o programar proyectos personales",
    "Salir del Tecnológico porque no hay espacios atractivos donde quedarse"
  ]).setRequired(true);

  var itemFaltaEventos = form.addScaleItem();
  itemFaltaEventos.setTitle("7.4 ¿Consideras que la falta de eventos estimulantes influye en que los alumnos caigan en apatía?");
  itemFaltaEventos.setBounds(1, 5);
  itemFaltaEventos.setLabels("Nada que ver / Es 100% individual", "Totalmente / La falta de foros desmotiva");
  itemFaltaEventos.setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 8: CATÁLOGO DE INICIATIVAS ACM
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 8: Oferta Académica Extracurricular, Certificaciones y Eventos ACM")
      .setHelpText("Priorización de talleres intensivos, hackathons y programas especiales.");

  var itemMastery = form.addCheckboxItem();
  itemMastery.setTitle("8.1 Talleres Prácticos Certificados de Alta Demanda (ACM Mastery Series):");
  itemMastery.setChoiceValues([
    "Git & GitHub Pro (Flujos de trabajo colaborativos y portafolio)",
    "Docker & Linux para Desarrolladores (Contenedores y Bash)",
    "Inteligencia Artificial Aplicada (APIs de LLMs, Prompt Engineering y agentes)",
    "Desarrollo Web Fullstack (React/Next.js + Node + PostgreSQL)",
    "Ciberseguridad Práctica & Hacking Ético (OWASP y CTFs)",
    "Desarrollo de Videojuegos (Godot Engine / Unity)",
    "Desarrollo Móvil Multiplataforma (Flutter / React Native)",
    "Fundamentos de Nube y preparación para certificaciones AWS / Azure",
    "Algoritmos y Estructuras de Datos Competitivas (LeetCode / ICPC)",
    "Internet de las Cosas (IoT) y Sistemas Embebidos (ESP32 / Arduino)"
  ]);

  var itemEventos = form.addCheckboxItem();
  itemEventos.setTitle("8.2 Eventos Masivos e Integración Estudiantil:");
  itemEventos.setChoiceValues([
    "Hackathon ITCM (36 horas ininterrumpidas con patrocinadores y premios)",
    "Torneo Local de Programación Algorítmica estilo ICPC",
    "DevFest / Congreso Tecnológico con egresados en Big Tech",
    "Feria y Demo Day de Proyectos Estudiantiles frente a reclutadores",
    "Torneos de E-Sports y Gaming Tech con casters",
    "Visitas Industriales y Viajes Académicos a empresas tecnológicas"
  ]);

  var itemSoftSkills = form.addCheckboxItem();
  itemSoftSkills.setTitle("8.3 Habilidades Blandas y Empleabilidad:");
  itemSoftSkills.setChoiceValues([
    "Taller de optimización de CV técnico, portafolio y LinkedIn",
    "Simulacros de entrevistas técnicas y de RRHH (Mock Interviews)",
    "Taller de oratoria y cómo defender proyectos de software",
    "Metodologías ágiles en equipos reales (Scrum, Jira)"
  ]);

  var itemACMW = form.addMultipleChoiceItem();
  itemACMW.setTitle("8.4 Impulso a la iniciativa ACM-W (Mujeres en la Computación):");
  itemACMW.setChoiceValues([
    "Indispensable: participaría activamente en sus eventos y liderazgo",
    "Totalmente de acuerdo en que se impulse en el ITCM",
    "Neutral / Me es indiferente",
    "No conozco la iniciativa"
  ]).setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 9: EGRESADOS MENTORES, ERGONOMÍA Y SALUD EN SISTEMAS
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 9: Egresados Mentores, Ergonomía y Salud en Sistemas")
      .setHelpText("Vinculación con exalumnos en la industria y condiciones de trabajo digno.");

  var itemAlumni = form.addMultipleChoiceItem();
  itemAlumni.setTitle("9.1 ¿Te gustaría un programa de Mentoría con Egresados del ITCM que laboran en empresas globales?");
  itemAlumni.setChoiceValues([
    "¡Totalmente! Sería invaluable recibir orientación de alguien que estuvo en nuestras mismas aulas",
    "Sí, principalmente para sesiones de orientación laboral y vacantes",
    "Neutral",
    "No me interesa"
  ]).setRequired(true);

  var itemErgonomia = form.addScaleItem();
  itemErgonomia.setTitle("9.2 Calificación de la ergonomía y comodidad de sillas/mesas en laboratorios y salones:");
  itemErgonomia.setBounds(1, 5);
  itemErgonomia.setLabels("Muy deficientes / Causan dolor de espalda", "Totalmente ergonómicas y cómodas");
  itemErgonomia.setRequired(true);

  var itemSalud = form.addMultipleChoiceItem();
  itemSalud.setTitle("9.3 ¿Sufres de fatiga visual, dolores posturales o estrés severo por largas jornadas de estudio/código?");
  itemSalud.setChoiceValues([
    "Frecuentemente (dolores de cuello, muñeca o fatiga ocular constante)",
    "Ocasionalmente en periodos de exámenes o entregas de proyectos",
    "Raras veces",
    "Nunca"
  ]).setRequired(true);

  var itemConvivencia = form.addMultipleChoiceItem();
  itemConvivencia.setTitle("9.4 ¿Te interesaría que ACM organice convivencias estudiantiles ('Café & Código', juegos de mesa, deportes)?");
  itemConvivencia.setChoiceValues([
    "Sí, necesitamos espacios para desconectar, convivir y hacer comunidad",
    "Tal vez, si coinciden con mis horas libres",
    "Prefiero enfocarme únicamente en lo académico y técnico"
  ]).setRequired(true);

  // --------------------------------------------------------------------------
  // MÓDULO 10: LOGÍSTICA, HORARIOS Y CAJA DE CRISTAL
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 10: Logística Operativa, Horarios y Gobernanza Financiera")
      .setHelpText("Formatos de asistencia y transparencia en el manejo de recursos.");

  var itemHorarioTaller = form.addMultipleChoiceItem();
  itemHorarioTaller.setTitle("10.1 Horario y modalidad preferida para asistir a talleres extracurriculares:");
  itemHorarioTaller.setChoiceValues([
    "Entre semana: en horas intermedias (11:00 a 14:00 hrs) presencial en laboratorios",
    "Entre semana: por la tarde/noche (18:00 a 20:00 hrs) virtual en vivo",
    "Sábados por la mañana (09:00 a 13:00 hrs) presencial intensivo",
    "Modalidad 100% asíncrona: videos grabados y asesorías semanales"
  ]).setRequired(true);

  var itemDuracion = form.addMultipleChoiceItem();
  itemDuracion.setTitle("10.2 Duración óptima para un taller práctico sin que resulte tedioso:");
  itemDuracion.setChoiceValues([
    "Sesiones de 1.5 a 2 horas (durante 3 a 5 días)",
    "Talleres relámpago de 3 a 4 horas en un solo día",
    "Bootcamps intensivos de fin de semana (sábado y domingo)",
    "Cursos modulares de 4 semanas (1 sesión semanal)"
  ]).setRequired(true);

  var itemCajaCristal = form.addMultipleChoiceItem();
  itemCajaCristal.setTitle("10.3 ¿Apoyas una afiliación voluntaria simbólica ($40-$70) bajo 'Caja de Cristal' (finanzas públicas)?");
  itemCajaCristal.setChoiceValues([
    "Totalmente de acuerdo: garantiza eventos de calidad y total transparencia contable",
    "De acuerdo, siempre que los afiliados tengamos beneficios preferenciales",
    "Solo participaría si todo es 100% gratuito sin cuota alguna",
    "No me interesa afiliarme"
  ]).setRequired(true);

  var itemCanalAviso = form.addCheckboxItem();
  itemCanalAviso.setTitle("10.4 Canales favoritos para recibir convocatorias y avisos:");
  itemCanalAviso.setChoiceValues([
    "Comunidad oficial de WhatsApp de Sistemas ITCM",
    "Servidor de Discord de la carrera (código y voz)",
    "Cuenta de Instagram oficial del Capítulo ACM",
    "Carteles impresos con códigos QR en mamparas de Sistemas",
    "Correo institucional oficial"
  ]);

  // --------------------------------------------------------------------------
  // MÓDULO 11: AUDITORÍA CUALITATIVA Y BANCO DE TALENTO
  // --------------------------------------------------------------------------
  form.addPageBreakItem()
      .setTitle("Módulo 11: Tu Criterio, Propuestas y Postulación al Equipo Directivo")
      .setHelpText("Espacio de libre expresión y convocatoria para integrarte a comités de trabajo.");

  var itemPresidente = form.addCheckboxItem();
  itemPresidente.setTitle("11.1 Perfil indispensable en quien encabece la Presidencia del Capítulo ACM 2026-2027:");
  itemPresidente.setChoiceValues([
    "Excelencia técnica comprobable, código en producción y certificaciones",
    "Vocación genuina de servicio, humildad y trato cercano sin distinción de semestre",
    "Capacidad de gestión, orden administrativo y rendición de cuentas pública",
    "Carácter firme para defender los derechos estudiantiles y exigir laboratorios dignos",
    "Habilidad para vincular la carrera con empresas tech nacionales e internacionales"
  ]);

  var itemBuzon = form.addParagraphTextItem();
  itemBuzon.setTitle("11.2 BUZÓN ABIERTO: Si pudieras cambiar o implementar una sola cosa en la carrera mañana mismo, ¿qué sería?");
  itemBuzon.setHelpText("Tu opinión es 100% libre. Exprésate con franqueza sobre tus quejas o propuestas.");
  itemBuzon.setRequired(false);

  var itemComites = form.addCheckboxItem();
  itemComites.setTitle("11.3 ¿Te gustaría formar parte activa del equipo organizador del Capítulo ACM 2026-2027?");
  itemComites.setChoiceValues([
    "Comité Técnico y Desarrollo (Crear apps web, bots y sistemas del Capítulo)",
    "Comité Académico / Tutorías (Ser mentor de nuevos ingresos en 'Padres de Sistemas')",
    "Comité de Logística y Hackathons (Organizar eventos masivos, torneos y premios)",
    "Comité de Diseño, Media y Difusión (Redes sociales, video, diseño gráfico)",
    "Instructor Estudiantil (Impartir un taller sobre un tema que domino)",
    "Por ahora solo me interesa asistir como participante general",
    "No me interesa participar activamente"
  ]);

  // Mensaje final de confirmación
  Logger.log("\n============================================================");
  Logger.log("¡FORMULARIO GENERADO EXITOSAMENTE CON 11 MÓDULOS!");
  Logger.log("URL de Edición (Para ti): " + form.getEditUrl());
  Logger.log("URL Pública (Para compartir): " + form.getPublishedUrl());
  Logger.log("============================================================\n");
}
