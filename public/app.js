/**
 * ============================================================================
 * LÓGICA DE CLIENTE: ENCUESTA DE FORMACIÓN ISC ACM ITCM 2026–2027
 * ============================================================================
 * Protocolo de Rigor Metodológico TecNM & ACM
 * Asistente de 25 Preguntas en 5 Pasos Ágiles (5 a 7 minutos)
 * Validación de Padrón, Protección de Privacidad y Matrices Responsivas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_STEPS = 5;
  let currentStep = 1;
  const DRAFT_KEY = 'acm_itcm_encuesta_25_v4';

  // Elementos DOM - Pantallas
  const welcomeScreen = document.getElementById('welcomeScreen');
  const form = document.getElementById('surveyForm');
  const successScreen = document.getElementById('successScreen');
  const stepperContainer = document.getElementById('stepperContainer') || document.querySelector('.stepper-progress-container');
  const progressBar = document.getElementById('stepperProgressBar');
  const stepIndicatorText = document.getElementById('stepIndicatorText');
  const wizardCard = document.getElementById('wizardCard');
  const toast = document.getElementById('toast');
  const draftStatusBadge = document.getElementById('draftStatusBadge');

  // Elementos DOM - Botones y Navegación
  const btnStartSurvey = document.getElementById('btnStartSurvey');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  const steps = document.querySelectorAll('.wizard-step');

  // Elementos DOM - Difusión y Compartir
  const btnShareIntroWhatsApp = document.getElementById('btnShareIntroWhatsApp');
  const btnCopyIntroLink = document.getElementById('btnCopyIntroLink');
  const btnShareSuccessWhatsApp = document.getElementById('btnShareSuccessWhatsApp');
  const btnCopySuccessLink = document.getElementById('btnCopySuccessLink');

  // --------------------------------------------------------------------------
  // 1. SISTEMA DE DIFUSIÓN (COMPARTIR EN WHATSAPP, QR Y COPIAR ENLACE)
  // --------------------------------------------------------------------------
  function setupSharing() {
    const currentOrigin = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
      ? window.location.origin
      : 'http://localhost:3000';

    const shareMsg = `Compañero(a) de Sistemas ITCM, te invito a responder la Encuesta de Formación ISC 2026–2027 del Capítulo ACM. ¡Toma solo 5 minutos y tu opinión cuenta para talleres y proyectos!: ${currentOrigin}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;

    if (btnShareIntroWhatsApp) btnShareIntroWhatsApp.href = waUrl;
    if (btnShareSuccessWhatsApp) btnShareSuccessWhatsApp.href = waUrl;

    async function copyUrlToClipboard() {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(currentOrigin);
        } else {
          const temp = document.createElement('input');
          temp.value = currentOrigin;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        showToast('¡Enlace copiado al portapapeles! Listo para compartir.', 'info');
      } catch (err) {
        showToast(`Copia este enlace: ${currentOrigin}`, 'info');
      }
    }

    if (btnCopyIntroLink) btnCopyIntroLink.addEventListener('click', copyUrlToClipboard);
    if (btnCopySuccessLink) btnCopySuccessLink.addEventListener('click', copyUrlToClipboard);

    // Modal QR
    const btnShowQrIntro = document.getElementById('btnShowQrIntro');
    const qrModal = document.getElementById('qrModal');
    const btnCloseQrModal = document.getElementById('btnCloseQrModal');
    const qrImageDisplay = document.getElementById('qrImageDisplay');
    const qrUrlDisplay = document.getElementById('qrUrlDisplay');
    const btnDownloadQr = document.getElementById('btnDownloadQr');
    const btnShareQrWhatsApp = document.getElementById('btnShareQrWhatsApp');
    const btnCopyQrUrl = document.getElementById('btnCopyQrUrl');

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(currentOrigin)}`;

    function openQrModal() {
      if (!qrModal) return;
      if (qrImageDisplay) qrImageDisplay.src = qrApiUrl;
      if (qrUrlDisplay) qrUrlDisplay.textContent = currentOrigin;
      if (btnShareQrWhatsApp) btnShareQrWhatsApp.href = waUrl;
      qrModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeQrModal() {
      if (!qrModal) return;
      qrModal.style.display = 'none';
      document.body.style.overflow = '';
    }

    if (btnShowQrIntro) btnShowQrIntro.addEventListener('click', openQrModal);
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
          showToast('Descargando imagen QR...', 'info');
          const response = await fetch(qrApiUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'QR_Encuesta_ISC_ACM_ITCM.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          showToast('¡Imagen QR descargada!', 'success');
        } catch (err) {
          window.open(qrApiUrl, '_blank');
        }
      });
    }

    if (btnCopyQrUrl) {
      btnCopyQrUrl.addEventListener('click', copyUrlToClipboard);
    }
  }

  // --------------------------------------------------------------------------
  // 2. GESTIÓN DEL STEPPER WIZARD
  // --------------------------------------------------------------------------
  function updateStepUI() {
    steps.forEach(step => {
      const stepNum = parseInt(step.dataset.step, 10);
      step.style.display = (stepNum === currentStep) ? 'block' : 'none';
    });

    const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    if (stepIndicatorText) {
      stepIndicatorText.textContent = `Paso ${currentStep} de ${TOTAL_STEPS} (${progressPercent}% completado)`;
    }

    if (btnPrev) {
      btnPrev.disabled = false;
      btnPrev.textContent = (currentStep === 1) ? 'Volver a Portada' : 'Anterior';
    }

    if (currentStep === TOTAL_STEPS) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnSubmit) btnSubmit.style.display = 'inline-flex';
    } else {
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnSubmit) btnSubmit.style.display = 'none';
    }

    if (wizardCard && window.scrollY > 100) {
      wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --------------------------------------------------------------------------
  // 3. VALIDACIÓN POR PASO
  // --------------------------------------------------------------------------
  function highlightError(element, message) {
    showToast(message, 'error');
    if (element) {
      const block = element.closest('.question-block') || element.closest('tr') || element.closest('.matrix-mobile-row-card') || element;
      block.scrollIntoView({ behavior: 'smooth', block: 'center' });
      block.style.transition = 'background-color 0.3s ease';
      block.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
      setTimeout(() => { block.style.backgroundColor = ''; }, 2500);
      if (element.focus) element.focus();
    }
  }

  function validateCurrentStep() {
    const activeStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    if (!activeStepEl) return true;

    // --- PASO 1: Sobre ti e Información General ---
    if (currentStep === 1) {
      const control = document.getElementById('numeroControl');
      const valControl = control ? control.value.trim().toUpperCase() : '';
      if (!control || !/^[C]?\d{8}$/i.test(valControl)) {
        highlightError(control, 'El Número de Control es obligatorio: 8 dígitos numéricos (o C + 8 dígitos si es cambio de carrera).');
        return false;
      }
      control.value = valControl;

      const correo = document.getElementById('correo');
      const valCorreo = correo ? correo.value.trim().toLowerCase() : '';
      if (!correo || !valCorreo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valCorreo)) {
        highlightError(correo, 'El Correo Electrónico es obligatorio y debe tener un formato válido.');
        return false;
      }

      const semestre = form.querySelector('input[name="semestre"]:checked');
      if (!semestre) {
        highlightError(document.getElementById('qblock_semestre'), 'Por favor indica tu semestre o situación académica actual.');
        return false;
      }

      const turno = form.querySelector('input[name="turno"]:checked');
      if (!turno) {
        highlightError(document.getElementById('qblock_turno'), 'Por favor selecciona tu turno predominante.');
        return false;
      }

      const situacion = form.querySelector('input[name="situacion_laboral"]:checked');
      if (!situacion) {
        highlightError(document.getElementById('qblock_situacion_laboral'), 'Por favor selecciona tu situación laboral o actividades principales.');
        return false;
      }
    }

    // --- PASO 2: Condiciones de Estudio y Experiencia ---
    else if (currentStep === 2) {
      const recPc = form.querySelector('input[name="rec_pc"]:checked');
      if (!recPc) {
        highlightError(document.getElementById('qblock_rec_pc'), 'Por favor responde sobre tu acceso a equipo de cómputo para programar.');
        return false;
      }

      const satisfaccion = form.querySelector('input[name="satisfaccion_practica"]:checked');
      if (!satisfaccion) {
        highlightError(document.getElementById('qblock_satisfaccion_practica'), 'Por favor evalúa las oportunidades de práctica real en las materias.');
        return false;
      }

      const materias = form.querySelectorAll('input[name="materias_dificultad"]:checked');
      if (materias.length === 0) {
        highlightError(document.getElementById('qblock_materias_dificultad'), 'Por favor selecciona al menos una opción sobre materias con mayor reto.');
        return false;
      }

      const proyectos = form.querySelectorAll('input[name="experiencias_proyectos"]:checked');
      if (proyectos.length === 0) {
        highlightError(document.getElementById('qblock_experiencias_proyectos'), 'Por favor selecciona los tipos de proyectos en los que has participado.');
        return false;
      }

      // Matriz dinámicas de equipo (5 filas)
      const rowsEquipo = ['eq_coordinacion', 'eq_codigo_ajeno', 'eq_git_compartido', 'eq_revision_pares', 'eq_conflictos'];
      for (const rowId of rowsEquipo) {
        const checked = form.querySelector(`input[name="${rowId}"]:checked`) || form.querySelector(`input[name="${rowId}_mob"]:checked`);
        if (!checked) {
          highlightError(document.getElementById('qblock_dinamicas_equipo'), 'Por favor completa todas las filas de la tabla de dinámicas de equipo.');
          return false;
        }
      }
    }

    // --- PASO 3: Habilidades Técnicas y Aprendizaje Fuera del Aula ---
    else if (currentStep === 3) {
      // Matriz dominio herramientas (8 filas)
      const rowsDominio = ['dom_programacion', 'dom_git', 'dom_debugging', 'dom_testing', 'dom_linux', 'dom_db_apis', 'dom_docs', 'dom_aprender_tech'];
      for (const rowId of rowsDominio) {
        const checked = form.querySelector(`input[name="${rowId}"]:checked`) || form.querySelector(`input[name="${rowId}_mob"]:checked`);
        if (!checked) {
          highlightError(document.getElementById('qblock_dominio_herramientas'), 'Por favor evalúa tu nivel en todas las herramientas técnicas de la lista.');
          return false;
        }
      }

      const fuente = form.querySelector('input[name="fuente_aprendizaje"]:checked');
      if (!fuente) {
        highlightError(document.getElementById('qblock_fuente_aprendizaje'), 'Por favor selecciona tu principal fuente de aprendizaje técnico.');
        return false;
      }

      const habilidades = form.querySelectorAll('input[name="habilidades_fuera_aula"]:checked');
      if (habilidades.length === 0) {
        highlightError(document.getElementById('qblock_habilidades_fuera_aula'), 'Por favor selecciona al menos una habilidad que sentiste necesario aprender fuera del aula.');
        return false;
      }
      if (habilidades.length > 3) {
        highlightError(document.getElementById('qblock_habilidades_fuera_aula'), 'Por favor selecciona un máximo de 3 habilidades clave.');
        return false;
      }

      const ingles = form.querySelector('input[name="ing_tecnico"]:checked');
      if (!ingles) {
        highlightError(document.getElementById('qblock_ing_tecnico'), 'Por favor selecciona tu nivel de dominio en inglés técnico.');
        return false;
      }

      // Matriz confianza situaciones (5 filas)
      const rowsConfianza = ['conf_explicar_proyecto', 'conf_codigo_existente', 'conf_aprender_tech', 'conf_trabajo_equipo', 'conf_entrevista_tecnica'];
      for (const rowId of rowsConfianza) {
        const checked = form.querySelector(`input[name="${rowId}"]:checked`) || form.querySelector(`input[name="${rowId}_mob"]:checked`);
        if (!checked) {
          highlightError(document.getElementById('qblock_confianza_situaciones'), 'Por favor completa todas las filas de confianza ante situaciones profesionales.');
          return false;
        }
      }
    }

    // --- PASO 4: Preparación Profesional, IA y Proyección ---
    else if (currentStep === 4) {
      const prep = form.querySelector('input[name="preparacion_laboral_general"]:checked');
      if (!prep) {
        highlightError(document.getElementById('qblock_preparacion_laboral_general'), 'Por favor indica qué tan preparado/a te sientes para el mercado laboral.');
        return false;
      }

      const entrevistas = form.querySelector('input[name="experiencia_entrevistas"]:checked');
      if (!entrevistas) {
        highlightError(document.getElementById('qblock_experiencia_entrevistas'), 'Por favor selecciona tu experiencia con entrevistas técnicas o procesos de selección.');
        return false;
      }

      const github = form.querySelector('input[name="portafolio_github"]:checked');
      if (!github) {
        highlightError(document.getElementById('qblock_portafolio_github'), 'Por favor indica la situación actual de tu GitHub o portafolio.');
        return false;
      }

      const ia = form.querySelector('input[name="uso_ia"]:checked');
      if (!ia) {
        highlightError(document.getElementById('qblock_uso_ia'), 'Por favor indica cómo utilizas herramientas de Inteligencia Artificial para programar.');
        return false;
      }

      const softwareComunitario = form.querySelector('input[name="desarrollo_software_comunitario"]:checked');
      if (!softwareComunitario) {
        highlightError(document.getElementById('qblock_desarrollo_software_comunitario'), 'Por favor comparte tu opinión sobre el software desarrollado por estudiantes para el ITCM.');
        return false;
      }
    }

    // --- PASO 5: Talleres, Eventos y Participación ACM ---
    else if (currentStep === 5) {
      const talleres = form.querySelectorAll('input[name="interes_talleres"]:checked');
      if (talleres.length === 0) {
        highlightError(document.getElementById('qblock_interes_talleres'), 'Por favor selecciona al menos un tema de interés para talleres prácticos.');
        return false;
      }
      if (talleres.length > 3) {
        highlightError(document.getElementById('qblock_interes_talleres'), 'Por favor selecciona un máximo de 3 temas de talleres.');
        return false;
      }

      const eventos = form.querySelector('input[name="formato_eventos_masivos"]:checked');
      if (!eventos) {
        highlightError(document.getElementById('qblock_formato_eventos_masivos'), 'Por favor selecciona tu formato preferido para eventos tecnológicos masivos.');
        return false;
      }

      const disp = form.querySelector('input[name="disponibilidad_actividades"]:checked');
      if (!disp) {
        highlightError(document.getElementById('qblock_disponibilidad_actividades'), 'Por favor indica tu probabilidad de asistir a actividades extracurriculares.');
        return false;
      }

      const comites = form.querySelectorAll('input[name="voluntariado_comites"]:checked');
      if (comites.length === 0) {
        highlightError(document.getElementById('qblock_voluntariado_comites'), 'Por favor selecciona las áreas en las que te gustaría participar o si prefieres asistir.');
        return false;
      }
    }

    return true;
  }

  // Limitar checkboxes de máximo 3
  function setupCheckboxLimits() {
    function applyLimit(name, maxCount) {
      const checkboxes = form.querySelectorAll(`input[name="${name}"]`);
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const checked = form.querySelectorAll(`input[name="${name}"]:checked`);
          if (checked.length > maxCount) {
            cb.checked = false;
            showToast(`Solo puedes seleccionar hasta ${maxCount} opciones en esta pregunta.`, 'info');
          }
        });
      });
    }

    applyLimit('habilidades_fuera_aula', 3);
    applyLimit('interes_talleres', 3);
  }

  // --------------------------------------------------------------------------
  // 4. PERSISTENCIA Y AUTOGUARDADO (localStorage)
  // --------------------------------------------------------------------------
  function saveDraft() {
    const data = getFormData();
    data._savedStep = currentStep;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      if (draftStatusBadge) draftStatusBadge.style.display = 'inline-block';
    } catch (e) {
      console.warn('Error guardando borrador:', e);
    }
  }

  function restoreDraft() {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (!draft) return false;
      const data = JSON.parse(draft);

      let restoredCount = 0;
      for (const [key, value] of Object.entries(data)) {
        if (key === '_savedStep') continue;

        if (Array.isArray(value)) {
          value.forEach(val => {
            const el = form.querySelector(`input[name="${key}"][value="${CSS.escape(val)}"]`);
            if (el) {
              el.checked = true;
              restoredCount++;
            }
          });
        } else {
          const textEl = form.querySelector(`input[name="${key}"][type="text"], input[name="${key}"][type="email"], textarea[name="${key}"]`);
          if (textEl) {
            textEl.value = value;
            if (value) restoredCount++;
          } else {
            const radioEl = form.querySelector(`input[name="${key}"][value="${CSS.escape(value)}"]`);
            if (radioEl) {
              radioEl.checked = true;
              restoredCount++;
              const mobRadio = form.querySelector(`input[name="${key}_mob"][value="${CSS.escape(value)}"]`);
              if (mobRadio) mobRadio.checked = true;
            }
          }
        }
      }

      if (data._savedStep && data._savedStep >= 1 && data._savedStep <= TOTAL_STEPS) {
        currentStep = data._savedStep;
      }

      return restoredCount > 0;
    } catch (e) {
      console.warn('Error restaurando borrador:', e);
      return false;
    }
  }

  function getFormData() {
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (key.endsWith('_mob')) return;

      const elements = form.querySelectorAll(`input[name="${key}"]`);
      if (elements.length > 1 && elements[0].type === 'checkbox') {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  // --------------------------------------------------------------------------
  // 5. NOTIFICACIONES TOAST
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message, type = 'info') {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = `toast-msg show ${type}`;
    toastTimeout = setTimeout(() => {
      toast.className = 'toast-msg';
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 6. SINCRONIZACIÓN MATRIZ ESCRITORIO <-> MÓVIL
  // --------------------------------------------------------------------------
  function setupMatrixSync() {
    document.querySelectorAll('input[data-sync]').forEach(mobRadio => {
      mobRadio.addEventListener('change', () => {
        const targetName = mobRadio.getAttribute('data-sync');
        const val = mobRadio.value;
        const deskRadio = form.querySelector(`input[name="${targetName}"][value="${CSS.escape(val)}"]`);
        if (deskRadio) deskRadio.checked = true;
        saveDraft();
      });
    });

    document.querySelectorAll('.matrix-table input[type="radio"]').forEach(deskRadio => {
      deskRadio.addEventListener('change', () => {
        const name = deskRadio.name;
        const val = deskRadio.value;
        const mobRadio = form.querySelector(`input[name="${name}_mob"][value="${CSS.escape(val)}"]`);
        if (mobRadio) mobRadio.checked = true;
        saveDraft();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. EVENT LISTENERS Y TRANSICIONES
  // --------------------------------------------------------------------------
  const numControlInput = document.getElementById('numeroControl');
  if (numControlInput) {
    numControlInput.addEventListener('input', () => {
      numControlInput.value = numControlInput.value.toUpperCase();
    });
  }

  if (btnStartSurvey) {
    btnStartSurvey.addEventListener('click', () => {
      if (welcomeScreen) welcomeScreen.style.display = 'none';
      if (form) form.style.display = 'block';
      if (stepperContainer) stepperContainer.style.display = 'block';
      updateStepUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep()) {
        saveDraft();
        if (currentStep < TOTAL_STEPS) {
          currentStep++;
          updateStepUI();
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      } else if (currentStep === 1) {
        if (form) form.style.display = 'none';
        if (welcomeScreen) welcomeScreen.style.display = 'block';
        if (stepperContainer) stepperContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (form) {
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;

      const payload = getFormData();

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Enviando respuestas...';
      }

      const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
        ? ''
        : 'http://localhost:3000';

      try {
        const res = await fetch(`${API_BASE}/api/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok && result.success) {
          localStorage.removeItem(DRAFT_KEY);

          if (form) form.style.display = 'none';
          if (stepperContainer) stepperContainer.style.display = 'none';
          if (successScreen) successScreen.style.display = 'block';

          setupSharing();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          showToast(result.error || 'Hubo un error al registrar las respuestas.', 'error');
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Finalizar y Enviar Encuesta';
          }
        }
      } catch (err) {
        console.error('Error de red:', err);
        showToast('Error de conexión con el servidor. Intenta de nuevo.', 'error');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = 'Finalizar y Enviar Encuesta';
        }
      }
    });
  }

  // Inicialización
  setupSharing();
  setupMatrixSync();
  setupCheckboxLimits();

  const hasDraft = restoreDraft();
  if (hasDraft) {
    if (draftStatusBadge) draftStatusBadge.style.display = 'inline-block';
    showToast(`Tienes un borrador pendiente en el Paso ${currentStep}.`, 'info');
  }
});
