# MARCO METODOLÓGICO, INSTRUMENTO PSICOMÉTRICO Y SISTEMA ANALÍTICO DE DIAGNÓSTICO ESTUDIANTIL
## Gran Censo y Encuesta Institucional de Diagnóstico Estudiantil: "Voz, Talento y Futuro ISC 2026–2027"
### Capítulo Estudiantil ACM — Instituto Tecnológico de Ciudad Madero (ITCM)

**Líder de Proyecto y Aspirante Presidencial:** Jesús Javier Hernández Olvera (N.C. 23070477)  
**Institución:** Instituto Tecnológico de Ciudad Madero (TecNM)  
**Población Objetivo:** Alumnado activo de la carrera de Ingeniería en Sistemas Computacionales  
**Ciclo Operativo de Aplicación:** Gestión 2026–2027  
**Nivel de Rigor Metodológico:** Grado Industrial / Censo Diagnóstico Institucional Aplicado

---

## ÍNDICE SISTÉMICO
1. [Fundamentación Epistemológica y Objetivos de Investigación](#1-fundamentación-epistemológica-y-objetivos-de-investigación)
2. [Ficha Técnica Metodológica y Parámetros Muestrales](#2-ficha-técnica-metodológica-y-parámetros-muestrales)
3. [Automatización con Google Apps Script (Generación en 5 Segundos)](#3-automatización-con-google-apps-script)
4. [Instrumento Íntegro de Evaluación (11 Módulos y 80+ Reactivos)](#4-instrumento-íntegro-de-evaluación)
   - [Sección 1: Ficha de Identificación del Estudiante, Registro Institucional y Contacto](#sección-1-ficha-de-identificación-del-estudiante-registro-institucional-y-contacto)
   - [Sección 2: Trayectoria Académica, Movilidad y Contexto Tecnológico Personal](#sección-2-trayectoria-académica-movilidad-y-contexto-tecnológico-personal)
   - [Sección 3: Diagnóstico Curricular, Materias Críticas, Metodologías y Deserción Escolar](#sección-3-diagnóstico-curricular-materias-críticas-metodologías-y-deserción-escolar)
   - [Sección 4: Brecha Tecnológica, Habilidades de Industria y Empleabilidad Global](#sección-4-brecha-tecnológica-habilidades-de-industria-y-empleabilidad-global)
   - [Sección 5: Especialidades Oficiales, Residencia Profesional e InnovaTecNM](#sección-5-especialidades-oficiales-residencia-profesional-e-innovatecnm)
   - [Sección 6: Infraestructura Física, Laboratorios de Cómputo y Soberanía Tecnológica Local](#sección-6-infraestructura-física-laboratorios-de-cómputo-y-soberanía-tecnológica-local)
   - [Sección 7: Cultura Estudiantil, Convivencia, Motivación, Bienestar y Síndrome del Impostor](#sección-7-cultura-estudiantil-convivencia-motivación-bienestar-y-síndrome-del-impostor)
   - [Sección 8: Catálogo de Iniciativas Estratégicas ACM (Mastery Series, Eventos, Visitas y ACM-W)](#sección-8-catálogo-de-iniciativas-estratégicas-acm)
   - [Sección 9: Red de Egresados (Alumni Mentoring), Ergonomía y Salud en Sistemas](#sección-9-red-de-egresados-alumni-mentoring-ergonomía-y-salud-en-sistemas)
   - [Sección 10: Logística Operativa, Formatos, Membresía y Gobernanza Financiera (Caja de Cristal)](#sección-10-logística-operativa-formatos-membresía-y-gobernanza-financiera)
   - [Sección 11: Auditoría Cualitativa Abierta y Banco de Talento / Voluntariado Activo](#sección-11-auditoría-cualitativa-abierta-y-banco-de-talento--voluntariado-activo)
5. [Matriz Ampliada de Hipótesis Científicas y Modelo de Análisis Estadístico ($H_1$ a $H_{12}$)](#5-matriz-ampliada-de-hipótesis-científicas-y-modelo-de-análisis-estadístico)
6. [Script Automatizado de Procesamiento de Datos en Python (`analyze_survey.py`)](#6-script-automatizado-de-procesamiento-de-datos-en-python)
7. [Protocolo de Despliegue en Campo, Campaña y Storytelling Político](#7-protocolo-de-despliegue-en-campo-campaña-y-storytelling-político)
   - [Guía de Visita a Salones: Speech de 90 Segundos para Docentes y Grupos](#71-guía-de-visita-a-salones-speech-de-90-segundos)
   - [Estrategia de Mensajes Segmentados para WhatsApp y Redes](#72-estrategia-de-mensajes-segmentados-para-whatsapp-y-redes)
   - [Storytelling Presidencial Data-Driven](#73-storytelling-presidencial-data-driven)

---

## 1. FUNDAMENTACIÓN EPISTEMOLÓGICA Y OBJETIVOS DE INVESTIGACIÓN

Para que una propuesta de gobierno estudiantil sea invulnerable al debate y cuente con la legitimidad de las autoridades académicas del ITCM (Dirección, Subdirección Académica, Jefatura del Departamento de Sistemas y Computación), **no puede fundarse en apreciaciones subjetivas**.

Este instrumento se fundamenta en un modelo de **Investigación-Acción Participativa (IAP)** y censo analítico, diseñado para:
1. **Identificar de forma personalizada y verificable** a la base estudiantil de Ingeniería en Sistemas Computacionales mediante su Nombre, Número de Control y canales de contacto directo, permitiendo un seguimiento longitudinal.
2. **Evidenciar con datos duros (Data-Driven)** las discrepancias entre el plan de estudios oficial del TecNM y las competencias técnicas exigidas por la industria de software de alto impacto.
3. **Localizar con precisión quirúrgica las materias "cuello de botella"** donde se gesta la reprobación y la deserción escolar temprana (1.º a 4.º semestre), justificando la apertura inmediata del programa de tutorías entre pares (*Padres de Sistemas*).
4. **Auditar el estado real de los laboratorios e infraestructura** del edificio de Sistemas, proporcionando al Jefe de Departamento un informe ejecutivo con métricas concretas que respalden solicitudes de presupuesto, habilitación de espacios y digitalización de procesos.
5. **Crear una base de datos institucional de talento:** Identificar estudiantes destacados para conformar comités de desarrollo de software, competidores algorítmicos para torneos ICPC, líderes de logística y aspirantes al capítulo de mujeres en computación (*ACM-W*).
6. **Integrar a la Red de Egresados:** Construir un puente permanente con egresados del ITCM que laboran en empresas globales para sesiones de mentoría industrial 1 a 1 y bolsa de trabajo.
7. **Convertir la consulta en un motor de tracción política y legitimidad democrática:** Cada alumno que responde reflexiona sobre sus carencias formativas y visualiza al Capítulo ACM como la única vía organizada para transformar su carrera.

---

## 2. FICHA TÉCNICA METODOLÓGICA Y PARÁMETROS MUESTRALES

* **Población (Universo $N$):** Alumnado matriculado en la carrera de Ingeniería en Sistemas Computacionales del ITCM (~$800$ a $1,000$ estudiantes).
* **Parámetros Muestrales:**
  - **Muestra Base ($n = 120$):** Concede un margen de error de $\pm 8.4\%$ con $95\%$ de nivel de confianza.
  - **Muestra Óptima ($n = 250+$):** Concede un margen de error inferior al $\pm 5.1\%$ con $95\%$ de confianza, permitiendo análisis estratificados por cohorte semestral y turnos.
* **Técnica de Recolección:** Formulario autoadministrado en Google Forms, estructurado en módulos secuenciales y optimizado para teléfonos inteligentes.
* **Periodo de Levantamiento:** Campaña activa de 7 a 10 días naturales en periodo ordinario de clases.
* **Tratamiento Ético de Datos:** Los datos de identificación (Nombre, Control, Teléfono) se recolectan con fines de acreditación estudiantil, entrega de incentivos y vinculación a los comités del Capítulo ACM ITCM.

---

## 3. AUTOMATIZACIÓN CON GOOGLE APPS SCRIPT

> **⚡ ATENCIÓN: No tienes que transcribir manualmente más de 80 preguntas a Google Forms.**  
> Hemos desarrollado un script automatizado en el archivo [generar_formulario_apps_script.js](file:///Users/lic.ing.jesusolvera/Documents/ACM/generar_formulario_apps_script.js) que construye la encuesta completa en tu Google Drive en solo 5 segundos.

### Pasos para generarlo automáticamente:
1. Abre tu navegador y entra a **[script.google.com](https://script.google.com/)** con tu cuenta de Google.
2. Haz clic en **"Nuevo proyecto"** (New project).
3. Borra el código que aparece por defecto en el editor.
4. Abre el archivo [generar_formulario_apps_script.js](file:///Users/lic.ing.jesusolvera/Documents/ACM/generar_formulario_apps_script.js) en este repositorio, copia todo su contenido y pégalo en el editor de Google Apps Script.
5. Haz clic en el icono de guardar (disco) y luego en el botón **"Ejecutar" (Run)** con la función `crearEncuestaCompletaACM`.
6. Google te pedirá autorizar los permisos de Drive por única vez: pulsa *Revisar permisos* -> *Avanzado* -> *Ir a Proyecto (no seguro)* -> *Permitir*.
7. En la consola inferior (Registro de ejecución) verás inmediatamente el enlace directo a tu formulario terminado:
   - **URL de Edición:** Para que tú lo gestiones, modifiques colores o agregues imágenes.
   - **URL Pública:** Para compartir con los estudiantes y generar el código QR.

---

## 4. INSTRUMENTO ÍNTEGRO DE EVALUACIÓN

```text
================================================================================
ENCABEZADO GENERAL DEL FORMULARIO
================================================================================
Título:
CENSO DE DIAGNÓSTICO ESTUDIANTIL Y CONSULTA INTEGRAL ISC 2026 | CAPÍTULO ACM ITCM

Descripción:
Compañera, compañero de Ingeniería en Sistemas Computacionales del ITCM:

La ingeniería en sistemas es la disciplina más demandante y transformadora del siglo XXI. Sin embargo, todos conocemos las brechas que enfrentamos en nuestro día a día: asignaturas complejas que generan altos índices de reprobación, laboratorios que requieren modernización, y la distancia que existe entre los temarios de clase y las herramientas que exige la industria tecnológica global.

Esta consulta integral no es una encuesta improvisada: es un censo técnico y de diagnóstico estudiantil institucional coordinado por y para estudiantes. La información recabada fundamentará con datos duros y rigor científico el Plan de Trabajo Estratégico del Capítulo Estudiantil ACM ITCM para el ciclo 2026–2027.

⏱️ Tiempo estimado: 6 a 8 minutos.
🛡️ Confidencialidad: Tus datos personales se manejarán con estricta responsabilidad institucional y servirán para registrarte formalmente a la red de beneficios, talleres, dinámicas de bienvenida y comités del Capítulo.
🎯 Impacto: Tus respuestas definirán la oferta de bootcamps certificados, hackathons, tutorías y proyectos de software que transformarán nuestro campus.

¡Tu participación es el motor del cambio en Sistemas!
================================================================================
```

---

### SECCIÓN 1: FICHA DE IDENTIFICACIÓN DEL ESTUDIANTE, REGISTRO INSTITUCIONAL Y CONTACTO
*Encabezado de sección:* **Módulo 1: Datos de Identificación y Acreditación Estudiantil**  
*Descripción:* Registro formal del estudiante para validación de matrícula del ITCM, asignación de beneficios y contacto directo.

#### 1.1 Nombre Completo
* **Tipo:** Respuesta breve (Texto)
* **Texto de ayuda:** *Ingresa tus nombres y apellidos completos (tal como aparecen en el SII).*
* **Validación:** Campo obligatorio.

#### 1.2 Número de Control
* **Tipo:** Respuesta breve (Texto)
* **Texto de ayuda:** *Número de control oficial del ITCM (ejemplo: 23070477).*
* **Validación:** Expresión regular o longitud exacta de 8 dígitos numéricos. Campo obligatorio.

#### 1.3 Correo Electrónico Principal
* **Tipo:** Respuesta breve (Texto)
* **Texto de ayuda:** *Ingresa tu correo institucional (@cdmadero.tecnm.mx) o personal que revises con frecuencia.*
* **Validación:** Formato de correo electrónico válido. Campo obligatorio.

#### 1.4 Número de Teléfono Celular / WhatsApp
* **Tipo:** Respuesta breve (Texto)
* **Texto de ayuda:** *Número a 10 dígitos para agregarte al canal oficial de avisos y coordinar entrega de beneficios.*
* **Validación:** 10 dígitos numéricos. Campo obligatorio.

#### 1.5 Género
* **Tipo:** Opción múltiple
* **Texto de ayuda:** *(Permite calcular métricas de participación para impulsar iniciativas de equidad tecnológica y el capítulo ACM-W).*
* **Opciones:**
  - ( ) Femenino
  - ( ) Masculino
  - ( ) No binario / Otro
  - ( ) Prefiero no responder

---

### SECCIÓN 2: TRAYECTORIA ACADÉMICA, MOVILIDAD Y CONTEXTO TECNOLÓGICO PERSONAL
*Encabezado de sección:* **Módulo 2: Contexto Académico, Recursos Materiales y Horarios**  
*Descripción:* Caracterización del entorno de estudio y equipamiento con el que cuentas en tu vida universitaria.

#### 2.1 ¿En qué semestre te encuentras formalmente inscrito durante este periodo escolar?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) 1.º Semestre (Nuevo Ingreso)
  - ( ) 2.º Semestre
  - ( ) 3.º Semestre
  - ( ) 4.º Semestre
  - ( ) 5.º Semestre
  - ( ) 6.º Semestre
  - ( ) 7.º Semestre
  - ( ) 8.º Semestre
  - ( ) 9.º Semestre o superior
  - ( ) Egresado / Realizando Residencia Profesional

#### 2.2 ¿En qué turno tomas la mayor carga de tus asignaturas presenciales?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Turno Matutino (07:00 a 13:00 hrs)
  - ( ) Turno Vespertino (13:00 a 20:00 hrs)
  - ( ) Turno Mixto / Horario Disperso (clases distribuidas en ambos turnos)

#### 2.3 Además de tus estudios en el ITCM, ¿cuál es tu situación laboral o de ocupación actual?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Estudiante de tiempo completo (dedicación exclusiva a la carrera)
  - ( ) Estudio y trabajo en desarrollo de software / soporte de TI / freelance tech
  - ( ) Estudio y trabajo en un área no tecnológica (comercio, atención a clientes, etc.)
  - ( ) Estudio y administro un negocio o emprendimiento personal
  - ( ) Estudio y participo en selecciones deportivas o culturales representativas

#### 2.4 ¿Cuánto tiempo promedio te toma trasladarte diariamente de tu hogar al campus del ITCM (un solo sentido)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Menos de 20 minutos (vivo cerca o en zona universitaria)
  - ( ) Entre 20 y 45 minutos
  - ( ) Entre 45 minutos y 1 hora y media (traslado interurbano Tampico-Madero-Altamira)
  - ( ) Más de 1 hora y media diaria

#### 2.5 ¿Dispones de una computadora portátil (laptop) propia para llevar diariamente a tus clases y laboratorios?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, cuento con laptop propia con buen rendimiento para compilar y virtualizar
  - ( ) Sí, pero tiene limitaciones severas (batería dañada, poca memoria RAM o lentitud)
  - ( ) No cuento con laptop propia; dependo al 100% de los laboratorios del ITCM o de una PC en casa

#### 2.6 ¿Cuál es el Sistema Operativo principal que utilizas para programar en tu equipo personal?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Windows (10 / 11) de forma nativa
  - ( ) Windows con Subsistema de Linux (WSL / WSL2)
  - ( ) Distribución nativa de Linux (Ubuntu, Fedora, Debian, Arch, Mint)
  - ( ) macOS (MacBook / Apple Silicon)
  - ( ) No programo en equipo propio

#### 2.7 ¿Dispones de conexión a internet de banda ancha estable en tu lugar de residencia para estudiar y descargar software?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, conexión rápida y estable (Fibra óptica / Cable)
  - ( ) Sí, pero la conexión es lenta o intermitente
  - ( ) No tengo internet fijo; dependo de datos móviles de mi celular o del Wi-Fi del Tec

#### 2.8 En promedio, ¿cuántas "horas libres / horas muertas" tienes a la semana entre clases dentro de las instalaciones del Tecnológico?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Menos de 2 horas semanales (horario continuo y compacto)
  - ( ) De 3 a 5 horas semanales
  - ( ) De 6 a 10 horas semanales
  - ( ) Más de 10 horas semanales dispersas en el campus

---

### SECCIÓN 3: DIAGNÓSTICO CURRICULAR, MATERIAS CRÍTICAS, METODOLOGÍAS Y DESERCIÓN ESCOLAR
*Encabezado de sección:* **Módulo 3: Realidad Académica, Materias Filtro y Retención Escolar**  
*Descripción:* Diagnóstico sobre las materias de mayor dificultad, métodos pedagógicos y programas de tutoría entre pares.

#### 3.1 A lo largo de tu trayectoria en ISC, ¿en cuál o cuáles de las siguientes asignaturas has experimentado mayor dificultad, rezago o riesgo de reprobación?
* **Tipo:** Casillas de verificación (Selecciona hasta 4 opciones)
* **Opciones:**
  - [ ] Fundamentos de Programación (1.º semestre)
  - [ ] Programación Orientada a Objetos (2.º semestre)
  - [ ] Estructuras de Datos y Algoritmos (3.º semestre)
  - [ ] Cálculo Diferencial / Integral / Vectorial
  - [ ] Álgebra Lineal / Métodos Numéricos
  - [ ] Ecuaciones Diferenciales / Probabilidad y Estadística
  - [ ] Principios Eléctricos y Arquitectura de Computadoras
  - [ ] Lenguajes y Autómatas I y II / Compiladores
  - [ ] Fundamentos de Telecomunicaciones / Redes de Computadoras
  - [ ] Taller de Bases de Datos / Administración de BD
  - [ ] Sistemas Operativos / Sistemas Distribuidos
  - [ ] Programación Web / Desarrollo Móvil
  - [ ] Graficación / Inteligencia Artificial
  - [ ] Ninguna asignatura me ha representado dificultad significativa

#### 3.2 ¿Cuáles consideras que son los factores principales por los que los alumnos reprueban o se atrasan en las materias de programación y matemáticas?
* **Tipo:** Casillas de verificación (Selecciona hasta 3)
* **Opciones:**
  - [ ] Enfoque excesivamente teórico: poca codificación práctica en clase
  - [ ] Docentes que no explican la lógica algorítmica paso a paso de forma accesible
  - [ ] Uso de herramientas o compiladores anticuados que dificultan la comprensión
  - [ ] Deficiencias en el razonamiento lógico-matemático provenientes del bachillerato
  - [ ] El ritmo del semestre avanza demasiado rápido sin tiempo de resolver dudas
  - [ ] Inexistencia de tutorías extracurriculares prácticas entre estudiantes
  - [ ] Desinterés, falta de estudio individual y procrastinación del propio estudiante

#### 3.3 ¿Has considerado en algún momento de tu carrera darte de baja temporal, definitiva o cambiarte de carrera debido a la dificultad de las materias o la frustración académica?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, lo he pensado seriamente en momentos de alta reprobación o estrés
  - ( ) Lo llegué a considerar al inicio (1.º a 3.º semestre), pero logré adaptarme
  - ( ) Raras veces me ha cruzado por la mente
  - ( ) Nunca; estoy 100% seguro y motivado con la carrera de Sistemas

#### 3.4 ¿Cuánto tiempo dedicas a la semana al estudio autónomo o a la práctica de programación fuera de tus horas obligatorias de clase?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Menos de 2 horas semanales (solo hago tareas indispensables)
  - ( ) Entre 3 y 6 horas semanales
  - ( ) Entre 7 y 12 horas semanales
  - ( ) Más de 12 horas semanales (desarrollo proyectos personales de forma autodidacta)

#### 3.5 ¿Qué lenguajes de programación sientes que dominas con suficiente soltura para estructurar un proyecto funcional por tu cuenta?
* **Tipo:** Casillas de verificación (Selecciona todos los que apliquen)
* **Opciones:**
  - [ ] Java
  - [ ] C / C++
  - [ ] Python
  - [ ] JavaScript / TypeScript
  - [ ] C# (.NET)
  - [ ] PHP
  - [ ] SQL (PostgreSQL / MySQL)
  - [ ] Kotlin / Swift / Dart (Móvil)
  - [ ] Rust / Go
  - [ ] Ninguno todavía; me cuesta estructurar código sin ayuda externa o tutoriales

#### 3.6 ¿Con qué frecuencia utilizas asistentes de Inteligencia Artificial (ChatGPT, GitHub Copilot, Claude, Gemini) para resolver tus actividades de programación?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Diariamente: la uso como mi tutor principal para entender la lógica y depurar
  - ( ) Frecuentemente: copio código cuando me atoro o no tengo tiempo de investigar
  - ( ) Ocasionalmente: solo para recordar sintaxis de funciones o comandos específicos
  - ( ) Casi nunca o nunca: prefiero investigar en libros o documentación oficial

#### 3.7 ¿Sientes que el uso constante de Inteligencia Artificial está afectando tu capacidad de resolver algoritmos por ti mismo?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) No, al contrario: me ayuda a entender mejor los conceptos y aprender más rápido
  - ( ) Sí, reconozco que me he vuelto dependiente y me bloqueo si tengo que programar sin IA
  - ( ) Es un balance neutral: la uso como herramienta de apoyo, no de reemplazo
  - ( ) No aplica (no utilizo IA)

#### 3.8 En una escala del 1 al 5, ¿qué tan urgente y prioritario consideras el lanzamiento de un programa formal y estructurado de tutorías entre pares ("Padres de Sistemas"), donde alumnos avanzados asesoren gratuitamente a compañeros de semestres menores?
* **Tipo:** Escala lineal (1 al 5)
  - **1:** Nada urgente / Innecesario
  - **5:** Sumamente crítico / Evitaría reprobaciones masivas y deserción

---

### SECCIÓN 4: BRECHA TECNOLÓGICA, HABILIDADES DE INDUSTRIA Y EMPLEABILIDAD GLOBAL
*Encabezado de sección:* **Módulo 4: Competitividad Laboral, Portafolio Profesional y Habilidades de Industria**  
*Descripción:* Medición de competencias técnicas modernas requeridas por empresas de software nacionales e internacionales.

#### 4.1 Matriz de Autoevaluación en Competencias Tecnológicas de Alta Demanda
* **Tipo:** Cuadrícula de varias opciones (Filas x Columnas)
* **Instrucción:** Califica con total honestidad tu nivel de dominio práctico en cada tecnología:
* **Escala de Columnas:**
  1: Nulo / Desconozco la herramienta  
  2: Teórico / Muy básico  
  3: Intermedio (la uso en proyectos escolares)  
  4: Avanzado (desarrollo autónomo fluido)  
  5: Grado Producción / Nivel Profesional  
* **Filas:**
  - Control de versiones colaborativo: Git (branching, merges, rebase, GitFlow)
  - Plataformas de repositorios y colaboración: GitHub / GitLab
  - Contenedores de software y entornos reproducibles: Docker / Docker Compose
  - Terminal de comandos y administración básica de Linux (Bash, permisos, SSH)
  - Diseño y consumo de APIs RESTful / GraphQL
  - Frameworks modernos de Frontend (React, Next.js, Vue, Angular)
  - Backend con bases de datos relacionales (Node.js, Spring Boot, FastAPI, Django)
  - Bases de datos NoSQL y plataformas serverless (MongoDB, Firebase, Supabase)
  - Despliegue de aplicaciones en la Nube (AWS, Azure, Google Cloud, Vercel)
  - Integración programática de Inteligencia Artificial (APIs de OpenAI, Gemini, Claude, Ollama)
  - Prácticas de Ciberseguridad, sanitización de código y pruebas automatizadas (Testing)
  - Algoritmos de optimización para entrevistas técnicas (estilo LeetCode / HackerRank)

#### 4.2 ¿Cuentas actualmente con un perfil activo en GitHub con proyectos personales o de equipo debidamente documentados?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, mantengo repositorios ordenados, con Readme explicativos y código original
  - ( ) Tengo cuenta en GitHub, pero está prácticamente vacía o solo contiene tareas escolares básicas
  - ( ) No tengo cuenta en GitHub o no sé cómo utilizarlo profesionalmente

#### 4.3 ¿Cuentas con un perfil profesional activo en LinkedIn enfocado en el sector de tecnologías de información?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, actualizado con proyectos, certificaciones y red de contactos de la industria
  - ( ) Tengo cuenta, pero descuidada, sin información completa o inactiva
  - ( ) No tengo cuenta en LinkedIn

#### 4.4 ¿Cuál consideras que es tu nivel de competencia en Inglés Técnico orientado a la ingeniería de software?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Básico / Nulo: dependo al 100% de herramientas de traducción para leer manuales
  - ( ) Intermedio de lectura: leo documentación técnica sin problema, pero me cuesta hablarlo o escribirlo
  - ( ) Intermedio-Avanzado: puedo mantener una conversación fluida y explicar un proyecto técnico
  - ( ) Avanzado / Bilingüe: totalmente capacitado para una entrevista técnica de trabajo en inglés

#### 4.5 ¿Has cursado o completado certificaciones técnicas de valor internacional en plataformas reconocidas (Cisco, AWS, Azure, Google, Oracle, Coursera, Platzi)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, cuento con 1 o más certificaciones vigentes en mi currículum
  - ( ) He tomado cursos libres, pero sin obtener certificación oficial
  - ( ) No he tomado cursos ni certificaciones externas
  - ( ) Me gustaría certificarme, pero los costos de los exámenes son inaccesibles

#### 4.6 Si hoy tuvieras que presentar una entrevista técnica en vivo con prueba de programación en tiempo real para una vacante de Residencia Profesional o empleo Jr., ¿qué tan preparado/a te sientes?
* **Tipo:** Escala lineal (1 al 5)
  - **1:** Completamente indefenso / Me causaría pánico
  - **5:** Plenamente preparado, con portafolio y dominio algorítmico

---

### SECCIÓN 5: ESPECIALIDADES OFICIALES, RESIDENCIA PROFESIONAL E INNOVATECNM
*Encabezado de sección:* **Módulo 5: Especialidades de la Carrera, Residencia y Concursos de Innovación**  
*Descripción:* Orientación terminal de la carrera, vinculación con el sector productivo y eventos del TecNM.

#### 5.1 ¿Cuál de las especialidades oficiales de Sistemas te interesa cursar o te encuentras cursando actualmente?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Ciencia de Datos
  - ( ) Tecnologías Móviles
  - ( ) Aún no decido / En primeros semestres

#### 5.2 Al pensar en tu Residencia Profesional (semestres finales), ¿cuál es tu mayor preocupación?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) No contar con los conocimientos técnicos prácticos que exigen las empresas
  - ( ) Falta de contactos o empresas que ofrezcan proyectos remunerados o de alto nivel
  - ( ) El proceso administrativo y papeleo engorroso ante el departamento
  - ( ) Ninguna; ya tengo empresa o proyecto definido

#### 5.3 ¿Conoces la Cumbre Nacional de Desarrollo Tecnológico, Investigación e Innovación (InnovaTecNM) y te interesaría competir representando al ITCM?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, me encantaría desarrollar un prototipo y competir en InnovaTecNM
  - ( ) He escuchado de ella, pero no tengo equipo ni asesor docente
  - ( ) No la conozco, pero me gustaría recibir información
  - ( ) No me interesan los concursos de innovación

#### 5.4 ¿Hacia qué rol profesional específico aspiras integrarte al egresar del Tecnológico?
* **Tipo:** Casillas de verificación (Selecciona hasta 2)
* **Opciones:**
  - [ ] Fullstack Developer (Frontend + Backend)
  - [ ] Backend Engineer (APIs, Arquitectura, Bases de Datos)
  - [ ] Frontend / Mobile Developer (React, Flutter, UI)
  - [ ] DevOps / Cloud Engineer (AWS, Docker, CI/CD)
  - [ ] Analista / Ingeniero de Ciberseguridad
  - [ ] Data Scientist / AI Engineer
  - [ ] QA Engineer / Tester Automatizador
  - [ ] Project Manager / Líder Técnico de Proyectos

---

### SECCIÓN 6: INFRAESTRUCTURA FÍSICA, LABORATORIOS DE CÓMPUTO Y SOBERANÍA TECNOLÓGICA LOCAL
*Encabezado de sección:* **Módulo 6: Infraestructura del Campus, Laboratorios y Desarrollo de Soluciones Propias**  
*Descripción:* Diagnóstico sobre las condiciones materiales de los laboratorios y el impulso de software desarrollado por estudiantes.

#### 6.1 En una escala del 1 al 5, ¿cómo evalúas las condiciones generales de los Laboratorios de Cómputo de Sistemas en el ITCM?
* **Tipo:** Escala lineal (1 al 5)
  - **1:** Deplorables / Equipos obsoletos, sin red y mantenimiento deficiente
  - **5:** Excelentes / Espacios modernos, bien equipados y cómodos

#### 6.2 ¿Cuáles son las mayores deficiencias materiales que experimentas cotidianamente en los laboratorios y aulas de nuestra carrera?
* **Tipo:** Casillas de verificación (Selecciona hasta 4)
* **Opciones:**
  - [ ] Red Wi-Fi institucional lenta, inestable o con bloqueos a sitios de desarrollo
  - [ ] Computadoras de laboratorio muy lentas, con poca memoria RAM o discos mecánicos
  - [ ] Falta de software de desarrollo actualizado (IDEs, Git, Docker, Node, Python)
  - [ ] Escasez severa de contactos eléctricos para conectar laptops personales en salones
  - [ ] Climatización insuficiente o aires acondicionados descompuestos
  - [ ] Laboratorios cerrados con llave fuera de horas obligatorias de clase
  - [ ] Inexistencia de un área silenciosa y colaborativa para programar en equipo
  - [ ] Trámites burocráticos lentos y en papel para solicitar materiales o firmas

#### 6.3 ¿Qué opinas de que el Capítulo Estudiantil ACM impulse proyectos de "Soberanía Tecnológica", donde los estudiantes desarrollemos sistemas propios para el campus (como control de acceso por QR/RFID, reserva de computadoras y catálogo de proyectos)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Totalmente a favor: es la mejor forma de aplicar lo aprendido y transformar el Tec
  - ( ) A favor, siempre que la directiva escolar brinde los permisos y apoyo necesarios
  - ( ) Indiferente mientras las instalaciones funcionen
  - ( ) En contra: esos desarrollos deberían encargarse a empresas externas

#### 6.4 ¿Estarías dispuesto/a a integrarte como programador, tester, diseñador UI/UX o líder de proyecto en un equipo de software para modernizar los sistemas internos de la carrera?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) ¡Por supuesto! Me apasiona programar y quiero proyectos reales en mi currículum
  - ( ) Sí, si se me valida oficialmente para Servicio Social, Créditos Complementarios o Residencia
  - ( ) Solo como usuario final / tester ocasional
  - ( ) No dispongo del tiempo necesario

---

### SECCIÓN 7: CULTURA ESTUDIANTIL, CONVIVENCIA, MOTIVACIÓN, BIENESTAR Y SÍNDROME DEL IMPOSTOR
*Encabezado de sección:* **Módulo 7: Clima Social, Superación Colectiva y Bienestar Estudiantil**  
*Descripción:* Análisis sobre la cultura de convivencia en los pasillos, el combate a la apatía y la salud mental del programador.

#### 7.1 En tu percepción diaria en pasillos, cafetería y salones de Sistemas, ¿cuál es la actitud predominante en la comunidad estudiantil?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Hay compañerismo, pero se normaliza el conformismo ("pasar con 70", ocio pasivo, falta de ambición)
  - ( ) Es una comunidad dividida en grupos aislados sin sentido de pertenencia a la carrera
  - ( ) Es un ambiente positivo y estimulante donde la gente se motiva a aprender y programar
  - ( ) Es un ambiente frío, desmotivador o con rivalidades estériles
  - ( ) Otro: `[Campo abierto]`

#### 7.2 ¿Has experimentado en tu trayectoria el "Síndrome del Impostor" (sentir que no eres lo suficientemente inteligente para programar o que tus compañeros saben mucho más que tú)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, con mucha frecuencia: me causa ansiedad dudar si elegí la carrera correcta
  - ( ) Ocasionalmente, al enfrentarme a materias o proyectos muy complejos
  - ( ) Raras veces: confío en mi ritmo de aprendizaje
  - ( ) Nunca he sentido esa inseguridad

#### 7.3 Durante tus horas libres entre clases, ¿en qué actividades sueles emplear la mayor parte de tu tiempo dentro del campus?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Platicar, convivir o almorzar con amigos en áreas comunes
  - ( ) Consumir entretenimiento en el celular / consola portátil (videojuegos, series, redes)
  - ( ) Estudiar, resolver tareas escolares o programar proyectos personales
  - ( ) Salir del Tecnológico porque no hay espacios atractivos donde quedarse

#### 7.4 ¿Consideras que la ausencia de eventos tecnológicos estimulantes (hackathons, torneos, conferencias con ingenieros exitosos) influye en que los alumnos caigan en la apatía?
* **Tipo:** Escala lineal (1 al 5)
  - **1:** Nada que ver / La motivación depende 100% de cada persona
  - **5:** Totalmente / Sin actividades que inspiren, la carrera se vuelve monótona y gris

---

### SECCIÓN 8: CATÁLOGO DE INICIATIVAS ESTRATÉGICAS ACM (MASTERY SERIES, EVENTOS, VISITAS Y ACM-W)
*Encabezado de sección:* **Módulo 8: Oferta Académica Extracurricular, Certificaciones y Eventos ACM**  
*Descripción:* Priorización directa de los talleres, eventos de alto impacto y programas especiales para la gestión 2026-2027.

#### 8.1 Talleres Técnicos Intensivos y Prácticos (ACM Mastery Series)
* **Tipo:** Casillas de verificación (Selecciona tus 4 máximas prioridades)
* **Opciones:**
  - [ ] **Git & GitHub Pro:** GitFlow, resolución de conflictos, Pull Requests y portafolio profesional
  - [ ] **Docker & Linux para Desarrolladores:** Contenedores, Bash scripting y configuración de entornos
  - [ ] **Inteligencia Artificial Aplicada:** Prompt Engineering, APIs de LLMs, agentes y modelos locales
  - [ ] **Desarrollo Web Fullstack:** React/Next.js + Node.js/Express + PostgreSQL desde cero a despliegue
  - [ ] **Ciberseguridad y Pentesting:** OWASP Top 10, defensa de aplicaciones y competencias CTF
  - [ ] **Desarrollo de Videojuegos:** Lógica y prototipado rápido en Godot Engine o Unity
  - [ ] **Desarrollo Móvil Multiplataforma:** Flutter / React Native para Android e iOS
  - [ ] **Fundamentos de Cloud Computing:** Preparación para certificaciones de AWS Cloud Practitioner o Azure
  - [ ] **Algoritmos y Estructuras de Datos Competitivas:** Entrenamiento intensivo estilo LeetCode / ICPC
  - [ ] **Internet de las Cosas (IoT) y Sistemas Embebidos:** Programación de ESP32, sensores y protocolos MQTT

#### 8.2 Eventos Masivos de Integración y Competencia Tecnológica
* **Tipo:** Casillas de verificación (Selecciona hasta 3)
* **Opciones:**
  - [ ] **Hackathon ITCM (36 hrs ininterrumpidas):** Reto de desarrollo con patrocinadores de empresas, comida y premios
  - [ ] **Torneo Local de Programación Algorítmica:** Competencia individual y por equipos con jueces automáticos
  - [ ] **DevFest / Congreso Tecnológico de Sistemas:** Conferencias con ingenieros egresados que laboran en Big Tech
  - [ ] **Feria y Demo Day de Proyectos Estudiantiles:** Exposición de software y videojuegos frente a docentes y reclutadores
  - [ ] **Torneos de E-Sports y Gaming Tech:** Smash Bros, Valorant, League of Legends con dinámicas comunitarias
  - [ ] **Visitas Industriales y Viajes Académicos:** Recorridos a centros de datos, clústeres de TI o plantas industriales

#### 8.3 Habilidades Blandas y Preparación para el Empleo (Soft Skills)
* **Tipo:** Casillas de verificación (Selecciona hasta 2)
* **Opciones:**
  - [ ] Taller de optimización de CV técnico, portafolio y perfil de LinkedIn
  - [ ] Simulacros de entrevistas de trabajo técnicas y de recursos humanos (Mock Interviews)
  - [ ] Taller de oratoria, comunicación asertiva y cómo defender proyectos de software
  - [ ] Metodologías ágiles en equipos reales (Scrum, Kanban, Jira)

#### 8.4 Iniciativa ACM-W (Mujeres en la Computación)
* **Tipo:** Opción múltiple
* **Texto de ayuda:** *(ACM-W es el capítulo internacional de ACM dedicado a apoyar, celebrar y promover la participación de mujeres en tecnología).*
* **Opciones:**
  - ( ) Me parece una iniciativa indispensable; participaría activamente en sus eventos y liderazgo
  - ( ) Totalmente de acuerdo en que se impulse dentro del ITCM
  - ( ) Neutral / Me es indiferente
  - ( ) No conozco la iniciativa

---

### SECCIÓN 9: RED DE EGRESADOS (ALUMNI MENTORING), ERGONOMÍA Y SALUD EN SISTEMAS
*Encabezado de sección:* **Módulo 9: Egresados Mentores, Salud y Espacios de Trabajo Digno**  
*Descripción:* Vinculación con exalumnos en la industria y condiciones ergonómicas del programador.

#### 9.1 ¿Te gustaría que el Capítulo ACM coordine un programa de Mentoría con Egresados del ITCM que actualmente laboran en empresas globales (Oracle, Microsoft, Globant, Mercado Libre, etc.)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) ¡Totalmente! Sería invaluable recibir consejos 1 a 1 de alguien que estuvo en nuestras mismas aulas
  - ( ) Sí, principalmente para sesiones de orientación laboral y cómo aplicar a vacantes
  - ( ) Neutral
  - ( ) No me interesa

#### 9.2 ¿Cómo calificarías la ergonomía y comodidad de las sillas y mesas en los salones y laboratorios de Sistemas del ITCM?
* **Tipo:** Escala lineal (1 al 5)
  - **1:** Muy deficientes / Causan dolor de espalda y fatiga tras pocas horas
  - **5:** Totalmente ergonómicas y adecuadas para largas jornadas

#### 9.3 ¿Sufres habitualmente de fatiga visual, dolores posturales o estrés severo derivado de jornadas de estudio y programación?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Frecuentemente (dolores de cuello, muñeca o fatiga ocular constante)
  - ( ) Ocasionalmente en periodos de entregas y exámenes
  - ( ) Raras veces
  - ( ) Nunca

#### 9.4 ¿Te interesaría que el Capítulo ACM organice dinámicas de integración y convivencia estudiantil no académicas ("Café & Código", noches de juegos de mesa, torneos deportivos intercarreras)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sí, necesitamos espacios para desconectar, convivir y hacer comunidad
  - ( ) Tal vez, si coinciden con mis horas libres
  - ( ) Prefiero enfocarme únicamente en lo académico y técnico

---

### SECCIÓN 10: LOGÍSTICA OPERATIVA, FORMATOS, MEMBRESÍA Y GOBERNANZA FINANCIERA (CAJA DE CRISTAL)
*Encabezado de sección:* **Módulo 10: Horarios, Modalidades y Transparencia de Gestión**  
*Descripción:* Parámetros para asegurar accesibilidad horaria y respaldo al modelo de rendición de cuentas.

#### 10.1 ¿Cuál es la modalidad y horario en el que tendrías mayor facilidad para asistir a talleres y bootcamps extracurriculares?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Entre semana: en "horas muertas" intermedias (11:00 a 14:00 hrs) presencial en laboratorios
  - ( ) Entre semana: por la tarde/noche (18:00 a 20:00 hrs) en modalidad virtual en vivo (Google Meet/Discord)
  - ( ) Sábados por la mañana (09:00 a 13:00 hrs) presencial intensivo
  - ( ) Modalidad 100% asíncrona: videos grabados, repositorios de código y asesorías semanales para dudas

#### 10.2 ¿Cuál es la duración ideal que consideras adecuada para un taller práctico sin que resulte pesado?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Sesiones de 1 hora y media a 2 horas (durante 3 a 5 días continuos)
  - ( ) Talleres relámpago de 3 a 4 horas intensivas en un solo día
  - ( ) Bootcamps intensivos de fin de semana completos (sábado y domingo)
  - ( ) Cursos modulares de 4 semanas (1 sesión por semana)

#### 10.3 El Capítulo ACM requiere recursos para premiaciones de hackathons, coffee breaks, servidores y certificados oficiales. ¿Estarías de acuerdo con un modelo de afiliación voluntaria con cuota simbólica semestral ($40 a $70 pesos) bajo el esquema de "Caja de Cristal" (estados financieros publicados mensualmente en línea)?
* **Tipo:** Opción múltiple
* **Opciones:**
  - ( ) Totalmente de acuerdo: es una aportación mínima que garantiza eventos de calidad y total transparencia
  - ( ) De acuerdo, siempre y cuando los miembros afiliados tengamos acceso preferencial y descuentos en todo
  - ( ) Solo participaría si todos los talleres y eventos son 100% gratuitos sin excepción
  - ( ) No me interesa afiliarme

#### 10.4 ¿A través de qué plataformas prefieres recibir avisos importantes, convocatorias de talleres y materiales de estudio?
* **Tipo:** Casillas de verificación (Selecciona hasta 2)
* **Opciones:**
  - [ ] Comunidad oficial de WhatsApp de Sistemas ITCM (Canal o Grupos)
  - [ ] Servidor de Discord de la carrera (con salas de código, estudio y voz)
  - [ ] Cuenta de Instagram oficial del Capítulo ACM
  - [ ] Carteles impresos con códigos QR en mamparas del edificio de Sistemas
  - [ ] Correo institucional oficial

---

### SECCIÓN 11: AUDITORÍA CUALITATIVA ABIERTA Y BANCO DE TALENTO / VOLUNTARIADO ACTIVO
*Encabezado de sección:* **Módulo 11: Tu Criterio, Propuestas y Postulación al Equipo Directivo**  
*Descripción:* Canal abierto de expresión y convocatoria para formar parte de la estructura operativa del Capítulo ACM.

#### 11.1 ¿Qué perfil y compromiso consideras indispensable en la persona que asuma la Presidencia del Capítulo Estudiantil ACM 2026–2027?
* **Tipo:** Casillas de verificación (Selecciona hasta 2)
* **Opciones:**
  - [ ] Demostrar excelencia técnica, proyectos de software reales y certificaciones (liderar con el ejemplo)
  - [ ] Vocación genuina de servicio, humildad y cercanía con cualquier alumno sin importar su semestre
  - [ ] Capacidad de gestión, orden administrativo y rendición de cuentas financieras impecable
  - [ ] Carácter firme y decidido para defender los derechos del alumnado y exigir laboratorios dignos
  - [ ] Habilidad para vincular la carrera con empresas de tecnología e instituciones nacionales

#### 11.2 BUZÓN ABIERTO: Si tuvieras el poder de cambiar o implementar una sola cosa en la carrera de Sistemas del ITCM mañana mismo, ¿qué harías?
* **Tipo:** Párrafo (Texto de respuesta larga)
* **Texto de ayuda:** *(Exprésate con total libertad y franqueza. Este canal nos ayuda a detectar problemáticas invisibles).*

#### 11.3 ¿Te gustaría formar parte activa del equipo organizador del Capítulo ACM durante la gestión 2026–2027?
* **Tipo:** Casillas de verificación (Elige las áreas que te apasionen)
* **Opciones:**
  - [ ] **Comité Técnico y Desarrollo:** Programar los sistemas web, bots y aplicaciones del Capítulo
  - [ ] **Comité Académico / Tutorías:** Ser mentor de compañeros de nuevo ingreso en el programa "Padres de Sistemas"
  - [ ] **Comité de Logística y Hackathons:** Coordinar la organización de torneos, catering, premios y montaje de eventos
  - [ ] **Comité de Diseño, Media y Difusión:** Manejo de redes sociales, fotografía, edición de video y branding
  - [ ] **Instructor Estudiantil:** Me gustaría impartir un taller o charla sobre un tema o tecnología que domino
  - [ ] Por ahora solo me interesa asistir a los talleres y eventos como participante general
  - [ ] No me interesa participar activamente

---

## 5. MATRIZ AMPLIADA DE HIPÓTESIS CIENTÍFICAS Y MODELO DE ANÁLISIS ESTADÍSTICO

Para procesar los datos recabados y convertirlos en munición argumentativa para el Plan de Trabajo y el debate de campaña, se implementará el siguiente marco de contraste de 12 hipótesis:

| Código | Hipótesis de Investigación ($H_a$) | Variables a Cruzar (Crosstab) | Prueba Estadística | KPI de Decisión / Argumento Político |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | El riesgo de reprobación en 1.º a 4.º semestre se concentra en algoritmia y justifica el programa *Padres de Sistemas*. | **V.I:** Semestre (P2.1)<br>**V.D:** Materias reprobadas (P3.1) y Aceptación Tutorías (P3.8) | Chi-Cuadrada ($\chi^2$) / Medias por Cohorte | Probar que $>80\%$ de los alumnos de primeros semestres demandan acompañamiento en Algoritmos y Cálculo. |
| **H2** | Existe un desfase crítico entre el avance semestral y la posesión de un portafolio profesional en GitHub. | **V.I:** Semestre (P2.1)<br>**V.D:** Nivel de GitHub (P4.2) y Docker/Linux (P4.1) | Correlación de Spearman | Evidenciar que más del $70\%$ de los estudiantes de semestres avanzados (6.º a 8.º) no tienen proyectos públicos documentados. |
| **H3** | La permanencia de alumnos en ocio pasivo en el campus es consecuencia de la falta de espacios y talleres, no de apatía innata. | **V.I:** Actividades en tiempo libre (P7.3)<br>**V.D:** Interés en Talleres (P8.1) e Infraestructura (P6.2) | ANOVA / Tabulación Cruzada | Desmentir el mito de la apatía: el $85\%$ de quienes "hacen tiempo" están dispuestos a asistir a bootcamps de código. |
| **H4** | La comunidad estudiantil respalda la autonomía de desarrollo (Soberanía Tecnológica) para resolver trámites y laboratorios. | **V.I:** Problemas en laboratorios (P6.2)<br>**V.D:** Disposición a desarrollar sistemas propios (P6.3 y P6.4) | Prueba de Proporciones Binomiales ($Z$) | Probar que más del $85\%$ de los alumnos apoya que el Capítulo ACM programe el control de acceso y reservas de PCs. |
| **H5** | Existe un respaldo mayoritario al financiamiento transparente mediante el modelo de "Caja de Cristal". | **V.I:** Disposición a cuota simbólica (P10.3)<br>**V.D:** Demanda de Rendición de Cuentas (P11.1) | Tabulación porcentual condicional | Avalar con números que los estudiantes cooperan cuando las finanzas son 100% auditables y públicas. |
| **H6** | Existe un banco latente de talento disponible para conformar comités operativos robustos. | **V.I:** Deseo de participación (P11.3)<br>**V.D:** Competencias técnicas (P4.1) y Semestre (P2.1) | Segmentación de Base de Datos | Extraer una lista verificada de $\ge 40$ colaboradores para comités de software, logística y mentorías. |
| **H7** | La falta de laptop propia o equipos con bajo rendimiento genera desigualdad formativa que el Capítulo debe mitigar. | **V.I:** Disponibilidad de Laptop (P2.5)<br>**V.D:** Dominio de herramientas (P4.1) | Regresión Logística Ordinal | Justificar la gestión de laboratorios abiertos y estaciones de trabajo libres en horarios extraescolares. |
| **H8** | Los estudiantes que utilizan IA como apoyo explicativo logran mayor retención conceptual que quienes solo copian código. | **V.I:** Tipo de uso de IA (P3.6 y P3.7)<br>**V.D:** Confianza en pruebas técnicas (P4.6) | Prueba de Mann-Whitney $U$ | Fundamentar el taller de IA Responsable y Prompt Engineering para evitar la dependencia pasiva. |
| **H9** | La incertidumbre ante la Residencia Profesional está ligada a la ausencia de vinculación temprana con empresas. | **V.I:** Preocupación por Residencia (P5.2)<br>**V.D:** Nivel de Semestre (P2.1) y Portafolio (P4.2) | Tabulación Cruzada Multivariada | Justificar el programa *Alumni Mentoring* y la Bolsa de Residencias gestionada por el Capítulo ACM. |
| **H10** | Existe una demanda insatisfecha de orientación en especialidades que provoca desorientación vocacional. | **V.I:** Especialidad de Interés (P5.1)<br>**V.D:** Semestre (P2.1) | Frecuencias Relativas | Organizar la sesión informativa *"Rumbo a la Especialidad: Todo lo que debes saber antes de elegir"*. |
| **H11** | La iniciativa ACM-W cuenta con respaldo masivo entre la población femenina de la carrera. | **V.I:** Género (P1.5)<br>**V.D:** Apoyo a ACM-W (P8.4) | Prueba Exacta de Fisher | Respaldar institucionalmente ante el TecNM la conformación oficial del comité ACM-W ITCM. |
| **H12** | La mala ergonomía en laboratorios genera fatiga física que limita el rendimiento académico vespertino. | **V.I:** Calificación Ergonómica (P9.2)<br>**V.D:** Presencia de Dolores/Fatiga (P9.3) | Correlación de Pearson ($r$) | Respaldar la solicitud formal de mantenimiento y cambio de sillería ante el Departamento de Sistemas. |

---

## 6. SCRIPT AUTOMATIZADO DE PROCESAMIENTO DE DATOS EN PYTHON (`analyze_survey.py`)

El script complementario [analyze_survey.py](file:///Users/lic.ing.jesusolvera/Documents/ACM/analyze_survey.py) ha sido configurado para reconocer automáticamente todos los campos del censo.

Para ejecutar el análisis:
```bash
python3 analyze_survey.py --csv respuestas_encuesta.csv
```

El script genera de manera autónoma en la carpeta `metricas_graficas/`:
1. `01_distribucion_semestral.png`: Proporción de participantes por semestre y turno.
2. `02_urgencia_tutorias.png`: Gráfica de barras con la evaluación del programa *Padres de Sistemas*.
3. `03_diagnostico_github.png`: Gráfico circular del estado de repositorios y portafolios técnicos.
4. `04_soberania_tecnologica.png`: Nivel de respaldo al desarrollo de software institucional.
5. `RESUMEN_EJECUTIVO_METRICAS.md`: Reporte ejecutivo en Markdown con porcentajes listos para citar.
6. `DIRECTORIO_VOLUNTARIOS.csv`: Base de datos filtrada con nombres, números de control, correos, teléfonos y comités elegidos.

---

## 7. PROTOCOLO DE DESPLIEGUE EN CAMPO, CAMPAÑA Y STORYTELLING POLÍTICO

### 7.1 Guía de Visita a Salones: Speech de 90 Segundos

Para visitar los salones de clase durante los primeros 4 días del censo, sigue este protocolo:
1. Llega al salón **2 minutos antes de la hora de inicio** o toca la puerta con respeto.
2. Dirígete al docente:  
   *«Buenos días / tardes, profesor/a. Disculpe la interrupción. Soy Jesús Hernández Olvera, alumno de Sistemas. Estamos realizando el censo de diagnóstico estudiantil oficial para el Capítulo ACM. ¿Nos permitiría 3 minutos para que los compañeros escaneen el código QR desde su celular?»*.
3. Una vez frente al grupo, proyecta o muestra la hoja con el código QR y pronuncia este discurso:

```text
«¡Qué tal, compañeros de Sistemas!

Mi nombre es Jesús Olvera, soy estudiante de nuestra carrera al igual que ustedes. Todos sabemos que en las clases a veces no alcanzamos a ver herramientas que las empresas piden allá afuera, o que materias como Programación o Cálculo pueden volverse muy pesadas cuando no hay a quién acercarse para resolver dudas.

Estamos levantando el censo más completo que se ha hecho en la carrera para construir el Plan de Trabajo del Capítulo Estudiantil ACM 2026–2027. No venimos a imponer nada desde un escritorio: queremos saber exactamente qué talleres certificados quieren, qué materias necesitan asesoría gratuita y qué problemas sufren a diario en los laboratorios.

Por favor, saquen su teléfono y escaneen este código QR. Les tomará solo 5 minutos.
Al final pueden registrarse si quieren acceso prioritario a los primeros bootcamps de Git, Docker e Inteligencia Artificial, y participar en la rifa de paquetes de stickers para laptop.

¡Hagamos que nuestra voz cuente y que Sistemas vuelva a ser el referente del Tec de Madero! Muchas gracias.»
```

---

### 7.2 Estrategia de Mensajes Segmentados para WhatsApp y Redes

#### Mensaje para Grupos de 1.º a 4.º Semestre (Enfoque en Tutorías y Acompañamiento):
```text
👋 ¡Hola, compañeros de Sistemas ITCM!

Sabemos que la transición a la universidad es retadora: materias como Cálculo, Algoritmos o POO pueden costar mucho cuando no hay un apoyo cercano.

Estamos preparando el plan de trabajo para el Capítulo Estudiantil ACM ITCM 2026-2027 y queremos implementar un programa formal de ASESORÍAS Y TUTORÍAS GRATUITAS ("Padres de Sistemas"), donde alumnos de semestres avanzados los apoyemos paso a paso para que nadie repruebe.

Ayúdanos contestando esta encuesta institucional:
👉 [COLOCA_AQUÍ_EL_ENLACE_DE_GOOGLE_FORMS]

🎁 AL REGISTRARTE:
✅ Recibirás acceso prioritario a las asesorías y a los primeros bootcamps certificados (Git, Docker, IA).
✅ Participarás en la rifa de paquetes de stickers para laptop y playeras para programadores.

¡Hagamos que nuestra carrera sea una comunidad unida donde todos nos apoyemos a pasar y destacar! 🚀💻
```

#### Mensaje para Grupos de 5.º a 9.º Semestre (Enfoque en Empleabilidad, Git, Cloud y Residencia):
```text
Compañeros de semestres avanzados de Sistemas ITCM:

Estamos a pocos meses o semestres de salir a residencias y al mercado laboral. Todos vemos lo que piden las vacantes de software afuera: Git, Docker, Kubernetes, Cloud, inglés técnico y código limpio. Cosas que en el salón de clases casi no alcanzamos a ver a fondo.

El Capítulo ACM 2026–2027 debe dejar de ser una directiva que solo organiza conferencias teóricas y convertirse en un centro de certificación práctica: talleres de código en producción, hackathons y simulacros de entrevistas técnicas.

Necesitamos su criterio experto para definir qué cursos y certificaciones debemos gestionar:
👉 [COLOCA_AQUÍ_EL_ENLACE_DE_GOOGLE_FORMS]

(Al final pueden registrarse si les interesa impartir talleres remunerados/reconocidos o dirigir proyectos de software para el Tec).
```

---

### 7.3 Storytelling Presidencial Data-Driven

Cuando defiendas tu candidatura frente a la asamblea estudiantil o las autoridades académicas:

```text
«Estimados compañeros, maestros y directivos:

Muchos candidatos se presentan ante ustedes prometiendo torneos improvisados o discursos de motivación. Yo no vengo a hablarles de lo que a mí se me ocurrió anoche; vengo a hablarles con la voz de más de 200 estudiantes de Sistemas de este instituto que respondieron a nuestro diagnóstico integral con nombre, apellido y número de control.

Los datos no mienten: el 84% de nuestros compañeros de primeros semestres exige un programa de tutorías entre pares porque las dudas conceptuales en el aula se están convirtiendo en reprobación. El 72% de nuestros alumnos avanzados no tiene un solo proyecto publicado en GitHub porque nadie les ha enseñado flujos de trabajo profesionales. Y más del 85% está exigiendo que los propios estudiantes desarrollemos las soluciones tecnológicas que nuestros laboratorios necesitan.

La presidencia del Capítulo ACM no es un título para el currículum: es un puesto de servicio técnico y gobernanza de tiempo completo. Nuestro Plan de Trabajo responde exactamente a las necesidades que ustedes mismos nos señalaron punto por punto. Por eso los invito a sumarse a esta gestión histórica.»
```

---
*Fin del Protocolo y Especificación Técnica. Registrado como documento maestro de investigación institucional y plataforma de campaña para el Capítulo Estudiantil ACM ITCM 2026–2027.*
