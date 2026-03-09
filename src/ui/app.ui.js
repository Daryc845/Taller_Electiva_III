// src/ui/app.ui.js
// UI raíz: header + status bar + router por role.
// Este módulo define el ciclo de render manual:
// - registerRender(render) conecta el pipeline
// - triggerRender() re-renderiza cuando cambia el estado

import { state, setUI, flashMessageKey } from "../state/state.js";

import { createRolePage } from "./pages/RolePage.js";
import { createTeacherPage } from "./pages/TeacherPage.js";
import { createStudentPage } from "./pages/StudentPage.js";

import { registerRender, triggerRender } from "./render.js";
import { toggleTheme } from "../theme/theme.js";

import { getLanguage, setLanguage, t } from "../i18n/i18n.js";

let mountEl = null;

export function createAppRoot(mount) {
  mountEl = mount;
  registerRender(render);
  triggerRender();
}

function render() {
  if (!mountEl) return;

  mountEl.innerHTML = "";

  const app = document.createElement("div");
  app.className = "app";

  app.append(createHeader(), createStatusBar(), createMain());
  mountEl.append(app);
}

function createHeader() {
  const header = document.createElement("header");
  header.className = "header";

  const brand = document.createElement("div");
  brand.className = "brand";

  const title = document.createElement("h1");
  title.textContent = t("brand.name");

  const subtitle = document.createElement("p");
  subtitle.textContent = t("brand.subtitle");

  brand.append(title, subtitle);

  const actions = document.createElement("div");
  actions.className = "header__actions";

  actions.append(createLanguageToggle(), createThemeToggle());

  header.append(brand, actions);
  return header;
}

function createLanguageToggle() {
  const lang = getLanguage() || "en";

  const langToggle = document.createElement("div");
  langToggle.className = "segmented";
  langToggle.setAttribute("role", "group");
  langToggle.setAttribute("aria-label", t("lang.toggleAria"));

  const btnES = document.createElement("button");
  btnES.type = "button";
  btnES.className = "segmented__item";
  btnES.textContent = t("lang.es");
  btnES.dataset.active = lang === "es" ? "true" : "false";

  const btnEN = document.createElement("button");
  btnEN.type = "button";
  btnEN.className = "segmented__item";
  btnEN.textContent = t("lang.en");
  btnEN.dataset.active = lang === "en" ? "true" : "false";

  btnES.addEventListener("click", () => {
    setLanguage("es");
    triggerRender();
  });

  btnEN.addEventListener("click", () => {
    setLanguage("en");
    triggerRender();
  });

  langToggle.append(btnES, btnEN);
  return langToggle;
}

function createThemeToggle() {
  const themeBtn = document.createElement("button");
  themeBtn.className = "icon-btn";
  themeBtn.type = "button";
  themeBtn.setAttribute("aria-label", t("theme.toggleAria"));

  const icon = document.createElement("span");
  icon.className = "icon-btn__icon";
  themeBtn.append(icon);

  themeBtn.addEventListener("click", () => {
    toggleTheme();
    triggerRender();
  });

  return themeBtn;
}

function createStatusBar() {
  const bar = document.createElement("div");
  bar.className = "status";

  // UI status: error > loading > ok(message) > idle
  if (state.ui?.errorKey) {
    bar.textContent =
      t("status.errorPrefix") + t(state.ui.errorKey, state.ui.errorParams);
    bar.dataset.variant = "error";
  } else if (state.ui?.isLoading) {
    bar.textContent = t("status.loading");
    bar.dataset.variant = "loading";
  } else if (state.ui?.messageKey) {
    bar.textContent = t(state.ui.messageKey, state.ui.messageParams);
    bar.dataset.variant = "ok";
  } else {
    bar.textContent = t("status.idle");
    bar.dataset.variant = "idle";
  }

  // Session status (si existe)
  if (state.session) {
    const extra = document.createElement("div");
    extra.className = "status__session";

    const statusKey =
      state.session.status === "open" ? "status.open" : "status.closed";

    const left = document.createElement("span");
    left.textContent = `${t("status.session")}: ${t(statusKey)} | `;

    const label = document.createElement("span");
    label.textContent = `${t("status.code")}: `;

    const codeBtn = document.createElement("button");
    codeBtn.type = "button";
    codeBtn.className = "status__codebtn";
    codeBtn.setAttribute("aria-label", t("status.copyCodeAria"));
    codeBtn.textContent = `${state.session.code} ⧉`;

    codeBtn.addEventListener("click", async () => {
      const code = String(state.session?.code || "");
      if (!code) return;

      try {
        await copyToClipboard(code);
        flashMessageKey("status.codeCopied", 1500);
        triggerRender();
      } catch {
        setUI({
          errorKey: "errors.copyFailed",
          errorParams: null,
          messageKey: "",
          messageParams: null,
        });
        triggerRender();
      }
    });

    extra.append(left, label, codeBtn);

    bar.dataset.session = state.session.status === "open" ? "open" : "closed";
    bar.append(extra);
  } else {
    bar.dataset.session = "none";
  }

  return bar;
}

function createMain() {
  if (!state.role) return createRolePage();
  if (state.role === "teacher") return createTeacherPage();
  return createStudentPage();
}

/**
 * Copia texto al portapapeles.
 * - Usa Clipboard API cuando está disponible (HTTPS/localhost).
 * - Si no, usa un fallback basado en textarea + execCommand.
 */
async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return fallbackCopy(text);
}

function fallbackCopy(text) {
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();

      const ok = document.execCommand("copy");
      document.body.removeChild(ta);

      ok ? resolve() : reject(new Error("copy_failed"));
    } catch (e) {
      reject(e);
    }
  });
}
