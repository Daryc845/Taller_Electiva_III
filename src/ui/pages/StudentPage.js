// src/ui/pages/StudentPage.js
// Panel del estudiante: captura el código de sesión y prepara el flujo para unirse (futuro async).

import { state, setStudentSession, setUI, resetApp } from "../../state/state.js";
import { triggerRender } from "../render.js";
import { t } from "../../i18n/i18n.js";
import { EVENT, logEvent } from "../../services/activity-log.service.js";
import { validateSessionCode } from "../../services/session.service.js";

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
    const normalized = normalizeCode(e.target.value);
    e.target.value = normalized;
    setUI({ studentCodeDraft: normalized });
  });

  field.append(label, input);

  const btnJoin = document.createElement("button");
  btnJoin.className = "btn btn--primary";
  btnJoin.type = "button";
  btnJoin.textContent = t("student.join");

  const alreadyJoined = state.studentSession?.status === "open";
  btnJoin.disabled = state.ui?.isLoading || alreadyJoined;

  btnJoin.addEventListener("click", async () => {
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

    await runAction({
      loadingKey: "student.joining",
      action: async () => {
        const result = await validateSessionCode();

        if (!result.valid) {
          const err = new Error("CODE_NOT_FOUND");
          err.code = "errors.codeInvalid";
          throw err;
        }

        setStudentSession({ status: "open", code });
        logEvent(EVENT.SESSION_OPENED, { code });
      },
      successKey: "student.joinedOk",
      successParams: { code },
    });
  });

  const btnBack = document.createElement("button");
  btnBack.className = "btn btn--ghost";
  btnBack.type = "button";
  btnBack.textContent = t("role.changeProfile");

  btnBack.addEventListener("click", () => {
    logEvent(EVENT.BACK_HOME, { from: "student" });
    resetApp();
    triggerRender();
  });

  container.append(title, intro, info, field, btnJoin, btnBack);
  return container;
}

async function runAction({ loadingKey, action, successKey, successParams = null }) {
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
      messageParams: successParams,
      errorKey: "",
      errorParams: null,
    });
  } catch (err) {
    setUI({
      errorKey: err?.code || "errors.unknown",
      errorParams: null,
      messageKey: "",
      messageParams: null,
    });
  } finally {
    setUI({ isLoading: false });
    triggerRender();
  }
}

function getStudentInfoText() {
  if (state.studentSession?.status === "open") {
    return t("student.connectedAs", { code: state.studentSession.code });
  }
  return t("student.notConnected");
}

function normalizeCode(value) {
  return String(value).trim().replace(/\s+/g, "").replace(/[^\d]/g, "").slice(0, 6);
}

function isValidCode(code) {
  if (!code) return { valid: false, key: "errors.codeEmpty" };
  if (code.length < 6) return { valid: false, key: "errors.codeIncomplete" };
  if (!/^\d+$/.test(code)) return { valid: false, key: "errors.codeNumbersOnly" };
  return { valid: true };
}
