/**
 * ============================================================================
 * VERCEL SERVERLESS FUNCTION: /api/submit
 * ============================================================================
 * Recibe la respuesta del estudiante en Vercel y la reenvía automáticamente
 * al Webhook de Google Sheets en tiempo real.
 * ============================================================================
 */

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
  }

  try {
    const payload = req.body;

    // Validación básica de campos obligatorios
    if (!payload.numeroControl || !payload.correo || !payload.semestre || !payload.turno || !payload.situacion_laboral) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios (Número de Control, Correo, Semestre, Turno o Situación laboral).'
      });
    }

    if (!/^\d{8}$/.test(String(payload.numeroControl).trim())) {
      return res.status(400).json({
        success: false,
        error: 'El Número de Control debe contener exactamente 8 dígitos.'
      });
    }

    // Agregar marca temporal si no viene
    payload.timestamp = payload.timestamp || new Date().toISOString();

    // URL del Webhook de Google Sheets (desde variable de entorno en Vercel)
    const googleWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (googleWebhookUrl) {
      // Reenviar a Google Sheets
      const sheetResponse = await fetch(googleWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const sheetResult = await sheetResponse.json().catch(() => ({}));
      console.log('Respuesta de Google Sheets:', sheetResult);
    } else {
      console.warn('Aviso: Variable GOOGLE_SHEET_WEBHOOK_URL no configurada en Vercel.');
    }

    return res.status(200).json({
      success: true,
      message: 'Tu registro ha sido completado con éxito. ¡Gracias por participar!'
    });

  } catch (error) {
    console.error('Error procesando respuesta en Vercel:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor al procesar la encuesta.'
    });
  }
}
