// src/ui/pages/StudentPage.js
// Panel del estudiante: captura el código de sesión y prepara el flujo para unirse (futuro async).

import { state, setUI, resetApp } from "../../state/state.js";
import { triggerRender } from "../render.js";
import { t } from "../../i18n/i18n.js";
import { EVENT, logEvent } from "../../services/activity-log.service.js";

export function createStudentPage() {
  const container = document.createElement("main");
  container.className = "card";

  const title = document.createElement("div");
  title.className = "card__title";
  title.textContent = t("student.title");

  const intro = document.createElement("p");
  intro.textContent = t("student.intro");

  const info = document.createElement("div");
  info.className = "student-info";
  info.textContent = getStudentInfoText();

  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  label.className = "field__label";
  label.textContent = t("student.codeLabel");

  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";
  input.inputMode = "numeric";
  input.autocomplete = "one-time-code";
  input.placeholder = t("student.codePlaceholder");
  input.value = state.ui?.studentCodeDraft || "";

  input.addEventListener("input", (e) => {
    let normalized = normalizeCode(e.target.value);

    e.target.value = normalized;

    setUI({ studentCodeDraft: normalized });
  });

  

  field.append(label, input);

  const btnJoin = document.createElement("button");
  btnJoin.className = "btn btn--primary";
  btnJoin.type = "button";
  btnJoin.textContent = t("student.join");

  btnJoin.addEventListener("click", () => {
    const draft = String(state.ui?.studentCodeDraft || "");
    const code = normalizeCode(draft);

    const codeValidation = isValidCode(code);
    if (!codeValidation.valid) {
      setUI({
        errorKey: codeValidation.key,
        errorParams: null,
        messageKey: "",
        messageParams: null,
      });
      triggerRender();
      return;
    }

    // En esta fase solo confirmamos intención (UI); no validamos contra backend aún.
    setUI({
      errorKey: "",
      errorParams: null,
      messageKey: "student.joining",
      messageParams: null,
    });

    triggerRender();
  });

  const btnBack = document.createElement("button");
  btnBack.className = "btn btn--ghost";
  btnBack.type = "button";
  btnBack.textContent = t("role.changeProfile");

  btnBack.addEventListener("click", () => {
    logEvent(EVENT.BACK_HOME, { from: "student" });
    resetApp();
    setUI({ studentCodeDraft: "" });
    triggerRender();
  });

  container.append(title, intro, info, field, btnJoin, btnBack);
  return container;
}

function getStudentInfoText() {
  if (state.session?.code && state.session?.status === "open") {
    return t("student.connectedAs", { code: state.session.code });
  }
  return t("student.notConnected");
}

function normalizeCode(value) {
  // Mantenerlo simple para estudiantes: elimina espacios y deja solo dígitos.
  return String(value).trim().replace(/\s+/g, "").replace(/[^\d]/g, "").slice(0, 6);
}

function isValidCode(code) {
  // Validación mínima y didáctica: entre 4 y 10 dígitos.
  if (!code) return { valid: false, key: "errors.codeEmpty" };
  if (code.length < 6) return { valid: false, key: "errors.codeIncomplete" };
  if (!/^\d+$/.test(code)) return { valid: false, key: "errors.codeNumbersOnly" };

  return true;
}
