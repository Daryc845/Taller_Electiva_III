// src/ui/pages/TeacherPage.js
// Panel del docente: crear y cerrar sesión (operaciones async) y volver al inicio.

import {
  state,
  setState,
  setUI,
  resetApp,
  resetUI,
} from "../../state/state.js";
import { triggerRender } from "../render.js";
import { createSession, closeSession } from "../../services/session.service.js";
import { t } from "../../i18n/i18n.js";

export function createTeacherPage() {
  const container = document.createElement("main");
  container.className = "card";

  const title = document.createElement("div");
  title.className = "card__title";
  title.textContent = t("teacher.title");

  const btnOpen = document.createElement("button");
  btnOpen.className = "btn btn--primary";
  btnOpen.type = "button";
  btnOpen.textContent = t("teacher.openSession");

  const btnClose = document.createElement("button");
  btnClose.className = "btn btn--danger";
  btnClose.type = "button";
  btnClose.textContent = t("teacher.closeSession");

  const btnBack = document.createElement("button");
  btnBack.className = "btn btn--ghost";
  btnBack.type = "button";
  btnBack.textContent = t("role.changeProfile");

  const hasOpenSession = state.session?.status === "open";
  btnOpen.disabled = state.ui.isLoading || hasOpenSession;
  btnClose.disabled = state.ui.isLoading || !hasOpenSession;

  btnOpen.addEventListener("click", async () => {
    await runAction({
      loadingKey: "teacher.creating",
      action: async () => {
        const session = await createSession();
        setState({ session });
      },
      successKey: "teacher.createdOk",
    });
  });

  btnClose.addEventListener("click", async () => {
    await runAction({
      loadingKey: "teacher.closing",
      action: async () => {
        const updated = await closeSession(state.session);
        setState({ session: updated });
      },
      successKey: "teacher.closedOk",
    });
  });

  // Volver al inicio: limpia estado de rol y sesión para evitar estados pegados.
  btnBack.addEventListener("click", () => {
    resetApp();
    triggerRender();
  });

  container.append(title, btnOpen, btnClose, btnBack);
  return container;
}

/**
 * Ejecuta una acción async con un patrón común de UI:
 * - activa loading
 * - muestra mensaje de progreso
 * - ejecuta acción
 * - muestra mensaje de éxito o error
 * - desactiva loading
 */
async function runAction({ loadingKey, action, successKey }) {
  setUI({
    isLoading: true,
    messageKey: loadingKey,
    messageParams: null,
    errorKey: "",
    errorParams: null,
  });
  triggerRender();
  
  try {
    await action();
    setUI({
      messageKey: successKey,
      messageParams: null,
      errorKey: "",
      errorParams: null,
    });
  } catch (err) {
    const key = err?.code || "errors.unknown";
    setUI({
      errorKey: key,
      errorParams: null,
      messageKey: "",
      messageParams: null,
    });
  } finally {
    setUI({ isLoading: false });
    triggerRender();
  }
}
