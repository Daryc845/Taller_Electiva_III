// src/state/state.js
// Estado central de la aplicación (single source of truth).
// Regla: la UI renderiza a partir de este objeto y solo se modifica con setState/setUI.

export const state = {
  // Pantalla actual: null (home) | "teacher" | "student"
  role: null,

  // Estado de sesión compartido entre roles (cuando aplique):
  // - code: string
  // - status: "open" | "closed" | "pending" (placeholder para futuras operaciones async)
  session: null,

  // Estado de UI global (mensajes, errores y loading)
  ui: {
    isLoading: false,

    // Claves i18n (la UI traduce en render; evita mensajes "pegados" al cambiar idioma)
    messageKey: "",
    messageParams: null,

    errorKey: "",
    errorParams: null,

    // Campos temporales de UI (ej: input draft)
    studentCodeDraft: "",
  },
};

/**
 * Actualiza el estado raíz. Acepta:
 * - un objeto patch (merge superficial)
 * - una función updater(prevState) => patch (para evitar condiciones de carrera)
 */
export function setState(patchOrUpdater) {
  const patch =
    typeof patchOrUpdater === "function"
      ? patchOrUpdater(state)
      : patchOrUpdater; 

  if (!patch || typeof patch !== "object") return;

  // Merge superficial del estado raíz
  Object.assign(state, patch);

  // Si el patch incluye ui, se recomienda usar setUI para merge controlado.
}

/**
 * Actualiza únicamente state.ui (merge superficial).
 */
export function setUI(patchOrUpdater) {
  const patch =
    typeof patchOrUpdater === "function"
      ? patchOrUpdater(state.ui)
      : patchOrUpdater;

  if (!patch || typeof patch !== "object") return;

  Object.assign(state.ui, patch);
}

/**
 * Limpia mensajes/errores (útil al navegar entre pantallas o después de acciones).
 */
export function resetUI() {
  setUI({
    isLoading: false,
    messageKey: "",
    messageParams: null,
    errorKey: "",
    errorParams: null,
  });
}

/**
 * Resetea la app al estado "home" sin sesión.
 */
export function resetApp() {
  setState({
    role: null,
    session: null,
  });
  resetUI();
  setUI({ studentCodeDraft: "" });
}

/**
 * Muestra un mensaje i18n por un tiempo y luego lo limpia.
 * Ideal para "copiado", "guardado", etc.
 */
export function flashMessageKey(messageKey, durationMs = 1500) {
  setUI({
    messageKey,
    messageParams: null,
    errorKey: "",
    errorParams: null,
  });

  const current = messageKey;

  setTimeout(() => {
    // Solo limpia si el mensaje no fue reemplazado por otro
    // y la UI no está en loading ni mostrando error.
    if (
      state.ui.messageKey === current &&
      !state.ui.isLoading &&
      !state.ui.errorKey
    ) {
      setUI({ messageKey: "", messageParams: null });
    }
  }, durationMs);
}
