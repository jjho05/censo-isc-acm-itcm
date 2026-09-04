/**
 * ============================================================================
 * LÓGICA DE CLIENTE (STEPPER WIZARD, AUTOSAVE & SHARING): CENSO ACM ITCM 2026-2027
 * ============================================================================
 * Protocolo de Rigor Académico TecNM & ACM
 * Validación de Padrón, Protección de Privacidad y Manejo de Matrices Responsivas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_STEPS = 11;
  let currentStep = 1;
  const DRAFT_KEY = 'acm_itcm_censo_draft_v2';

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
  const steps = document.querySelectorAll('.wizard-step, .form-step');

  // Elementos DOM - Difusión y Compartir
  const btnShareIntroWhatsApp = document.getElementById('btnShareIntroWhatsApp');
  const btnCopyIntroLink = document.getElementById('btnCopyIntroLink');
  const btnShareSuccessWhatsApp = document.getElementById('btnShareSuccessWhatsApp');
  const btnCopySuccessLink = document.getElementById('btnCopySuccessLink');

  // --------------------------------------------------------------------------
  // 1. SISTEMA DE DIFUSIÓN (COMPARTIR EN WHATSAPP Y COPIAR ENLACE)
  // --------------------------------------------------------------------------
  function setupSharing() {
    const currentOrigin = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
      ? window.location.origin
      : 'http://localhost:3000';

    const shareMsg = `Compañero(a) de Sistemas ITCM, te invito a responder la Encuesta de Experiencia y Formación ISC 2026–2027 del Capítulo Estudiantil ACM. ¡Tu opinión cuenta para talleres, labs y mejoras!: ${currentOrigin}`;
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
  }

  // --------------------------------------------------------------------------
  // 2. GESTIÓN DEL STEPPER WIZARD
  // --------------------------------------------------------------------------
  function updateStepUI() {
    steps.forEach(step => {
      const stepNum = parseInt(step.dataset.step, 10);
      step.style.display = (stepNum === currentStep) ? 'block' : 'none';
    });

    // Barra de progreso (Paso 1 inicia en 0%, finaliza en 100%)
    const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // Textos y botones
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
  // 3. VALIDACIÓN CONTEXTUAL POR PASO
  // --------------------------------------------------------------------------
  function validateCurrentStep() {
    const activeStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"], .form-step[data-step="${currentStep}"]`);
    if (!activeStepEl) return true;

    // Validación Módulo 1: Registro y Contexto Personal
    if (currentStep === 1) {
      const control = document.getElementById('numeroControl');
      if (!control || !/^\d{8}$/.test(control.value.trim())) {
        showToast('El Número de Control es obligatorio y debe tener exactamente 8 dígitos.', 'error');
        if (control) control.focus();
        return false;
      }

      const correo = document.getElementById('correo');
      if (!correo || !correo.value.trim() || !correo.checkValidity()) {
        showToast('Por favor introduce un Correo Electrónico válido.', 'error');
        if (correo) correo.focus();
        return false;
      }

      const tel = document.getElementById('telefono');
      if (tel && tel.value.trim() && !/^\d{10}$/.test(tel.value.trim().replace(/\D/g, ''))) {
        showToast('El teléfono debe tener 10 dígitos numéricos.', 'error');
        tel.focus();
        return false;
      }

      const edad = document.getElementById('edad');
      if (edad && !edad.value) {
        showToast('Por favor selecciona tu Edad.', 'error');
        edad.focus();
        return false;
      }

      const genero = document.querySelector('input[name="genero"]:checked');
      if (!genero) {
        showToast('Por favor selecciona tu Género.', 'error');
        return false;
      }

      const semestre = document.getElementById('semestre');
      if (semestre && !semestre.value) {
        showToast('Por favor selecciona tu Semestre actual.', 'error');
        semestre.focus();
        return false;
      }

      const turno = document.querySelector('input[name="turno"]:checked');
      if (!turno) {
        showToast('Por favor selecciona tu Turno principal.', 'error');
        return false;
      }

      const situacion = document.querySelector('input[name="situacion_laboral"]:checked');
      if (!situacion) {
        showToast('Por favor selecciona tu Situación laboral.', 'error');
        return false;
      }
    }

    return true;
  }

  // --------------------------------------------------------------------------
  // 4. PERSISTENCIA Y AUTOGUARDADO (localStorage)
  // --------------------------------------------------------------------------
  function saveDraft() {
    const data = getFormData();
    data._savedStep = currentStep;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      if (draftStatusBadge) {
        draftStatusBadge.style.display = 'inline-block';
      }
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
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
          const textEl = form.querySelector(`input[name="${key}"][type="text"], input[name="${key}"][type="email"], input[name="${key}"][type="tel"], textarea[name="${key}"]`);
          if (textEl) {
            textEl.value = value;
            if (value) restoredCount++;
          } else {
            const selectEl = form.querySelector(`select[name="${key}"]`);
            if (selectEl) {
              selectEl.value = value;
              if (value) restoredCount++;
            } else {
              const radioEl = form.querySelector(`input[name="${key}"][value="${CSS.escape(value)}"]`);
              if (radioEl) {
                radioEl.checked = true;
                restoredCount++;
                // Sincronizar pill móvil correspondiente si existe
                const mobRadio = form.querySelector(`input[name="${key}_mob"][value="${CSS.escape(value)}"]`);
                if (mobRadio) mobRadio.checked = true;
              }
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
      // Omitir duplicados móviles generados para responsividad táctil
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
  // 6. SINCRONIZACIÓN BIDIRECCIONAL MATRIZ ESCRITORIO <-> MÓVIL
  // --------------------------------------------------------------------------
  function setupMatrixSync() {
    // Cuando el usuario toca una píldora en móvil, activar el radio de la tabla
    document.querySelectorAll('input[data-sync]').forEach(mobRadio => {
      mobRadio.addEventListener('change', () => {
        const targetName = mobRadio.getAttribute('data-sync');
        const val = mobRadio.value;
        const deskRadio = form.querySelector(`input[name="${targetName}"][value="${CSS.escape(val)}"]`);
        if (deskRadio) {
          deskRadio.checked = true;
        }
        saveDraft();
      });
    });

    // Cuando cambia en la tabla de escritorio, activar la píldora móvil
    document.querySelectorAll('.matrix-table input[type="radio"]').forEach(deskRadio => {
      deskRadio.addEventListener('change', () => {
        const name = deskRadio.name;
        const val = deskRadio.value;
        const mobRadio = form.querySelector(`input[name="${name}_mob"][value="${CSS.escape(val)}"]`);
        if (mobRadio) {
          mobRadio.checked = true;
        }
        saveDraft();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. EVENT LISTENERS Y TRANSICIONES
  // --------------------------------------------------------------------------

  // Iniciar encuesta desde la pantalla de bienvenida
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
        // Regresar a la pantalla de bienvenida/portada
        if (form) form.style.display = 'none';
        if (welcomeScreen) welcomeScreen.style.display = 'block';
        if (stepperContainer) stepperContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Guardar borrador ante cualquier cambio
  if (form) {
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    // Envío final del formulario
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
          // Limpiar borrador local
          localStorage.removeItem(DRAFT_KEY);

          // Transición a pantalla de éxito
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

  // --------------------------------------------------------------------------
  // 8. INICIALIZACIÓN DE LA APLICACIÓN
  // --------------------------------------------------------------------------
  setupSharing();
  setupMatrixSync();

  // Comprobar si existe un borrador previo en este navegador
  const hasDraft = restoreDraft();
  if (hasDraft) {
    if (draftStatusBadge) draftStatusBadge.style.display = 'inline-block';
    showToast(`Tienes un borrador pendiente en el Paso ${currentStep}.`, 'info');
  }
});
