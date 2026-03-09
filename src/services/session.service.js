// src/services/session.service.js
// Servicio simulado (mock) para practicar async/await y manejo de errores.
// En una versión real, estas funciones harían fetch() a un backend.
//
// Contrato de errores:
// - Lanzan Error con propiedad err.code = "errors.<key>" (para i18n).

const CREATE_DELAY_MS = 600;
const CLOSE_DELAY_MS = 500;

const CREATE_FAIL_RATE = 0.25; // 25%
const CLOSE_FAIL_RATE = 0.2; // 20%

const CODE_MIN = 100000;
const CODE_RANGE = 900000;

const VALIDATION_DELAY_MS = 300;
const VALIDATION_DELAY_RANGE = 300; // 300–600ms total
const VALIDATION_FAIL_RATE = 0.2;   // 20% falla total
// Del 20% que falla: 50% credenciales, 50% sistema
const VALIDATION_CREDENTIALS_RATE = 0.5;

function makeSession() {
  return {
    status: "open",
    code: String(Math.floor(CODE_MIN + Math.random() * CODE_RANGE)),
  };
}

/**
 * Crea una sesión y retorna { status: "open", code: "######" }.
 * Puede fallar con err.code = "errors.tempCreateSession".
 */
export async function createSession() {
  await sleep(CREATE_DELAY_MS);

  if (Math.random() < CREATE_FAIL_RATE) {
    const err = new Error("TEMP_CREATE_SESSION");
    err.code = "errors.tempCreateSession";
    throw err;
  }

  return makeSession();
}

/**
 * Cierra una sesión existente y retorna { ...session, status: "closed" }.
 * Puede fallar con err.code = "errors.tempCloseSession".
 */
export async function closeSession(session) {
  await sleep(CLOSE_DELAY_MS);

  if (!session) {
    // Si no hay sesión, devolvemos null para indicar "nada que cerrar".
    return null;
  }

  if (Math.random() < CLOSE_FAIL_RATE) {
    const err = new Error("TEMP_CLOSE_SESSION");
    err.code = "errors.tempCloseSession";
    throw err;
  }

  return { ...session, status: "closed" };
}

/**
 * Simula validar un código de sesión.
 * - Tarda 300–600ms
 * - 20% falla: mitad por credenciales (código no existe), mitad por sistema
 * - Retorna { valid: true } simulando que el servidor encontró la sesión
 * - Retorna { valid: false } simulando que el servidor NO encontró la sesión
 */
export async function validateSessionCode() {
  await sleep(VALIDATION_DELAY_MS + Math.random() * VALIDATION_DELAY_RANGE);

  if (Math.random() < VALIDATION_FAIL_RATE) {
    const isCredentials = Math.random() < VALIDATION_CREDENTIALS_RATE;
    const err = new Error(isCredentials ? "INVALID_CREDENTIALS" : "SYSTEM_ERROR");
    err.code = isCredentials
      ? "errors.codeInvalid"      // 50%: código no existe en el servidor
      : "errors.validationFailed"; // 50%: error interno del sistema
    throw err;
  }
  return { valid: true };
}

/**
 * Helper para simular latencia (Promise).
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
