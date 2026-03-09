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
import {
  EVENT,
  clearActivityLog,
  logEvent,
} from "../services/activity-log.service.js";

let mountEl = null;
let clearLogConfirmUntil = 0;

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

  app.append(createHeader(), createStatusBar(), createActivityLog(), createMain());
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
    if (lang === "es") return;
    setLanguage("es");
    logEvent(EVENT.LANGUAGE_CHANGED, { lang: "es" });
    triggerRender();
  });

  btnEN.addEventListener("click", () => {
    if (lang === "en") return;
    setLanguage("en");
    logEvent(EVENT.LANGUAGE_CHANGED, { lang: "en" });
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
    const theme = toggleTheme();
    logEvent(EVENT.THEME_CHANGED, { theme });
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
        logEvent(EVENT.CODE_COPIED, { code });
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

function createActivityLog() {
  const section = document.createElement("section");
  section.className = "activity-log";

  const head = document.createElement("div");
  head.className = "activity-log__head";

  const title = document.createElement("h2");
  title.className = "activity-log__title";
  title.textContent = t("activity.title");

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "btn btn--ghost activity-log__clear";
  clearBtn.textContent = t("activity.clear");

  const events = Array.isArray(state.activityLog) ? state.activityLog : [];
  clearBtn.disabled = events.length === 0;

  clearBtn.addEventListener("click", () => {
    const now = Date.now();

    if (now <= clearLogConfirmUntil) {
      clearActivityLog();
      clearLogConfirmUntil = 0;
      flashMessageKey("activity.cleared", 1500);
      triggerRender();
      return;
    }

    clearLogConfirmUntil = now + 3000;
    flashMessageKey("activity.confirmClear", 2500);
    triggerRender();
  });

  head.append(title, clearBtn);

  const list = document.createElement("ul");
  list.className = "activity-log__list";

  if (!events.length) {
    const empty = document.createElement("li");
    empty.className = "activity-log__empty";
    empty.textContent = t("activity.empty");
    list.append(empty);
  } else {
    for (const event of events) {
      const item = document.createElement("li");
      item.className = "activity-log__item";
      item.dataset.event = eventGroupFromType(event.type);

      const row = document.createElement("div");
      row.className = "activity-log__row";

      const label = document.createElement("strong");
      label.textContent = t(`activity.events.${event.type}`);

      const time = document.createElement("time");
      time.className = "activity-log__time";
      time.dateTime = new Date(event.timestamp).toISOString();
      time.textContent = formatEventTime(event.timestamp);

      row.append(label, time);
      item.append(row);

      const detailText = formatEventDetail(event);
      if (detailText) {
        const detail = document.createElement("div");
        detail.className = "activity-log__detail";
        detail.textContent = detailText;
        item.append(detail);
      }

      list.append(item);
    }
  }

  section.append(head, list);
  return section;
}

function eventGroupFromType(type) {
  if (String(type).startsWith("session.")) return "session";
  if (String(type).startsWith("role.")) return "role";
  if (String(type).startsWith("language.")) return "language";
  if (String(type).startsWith("theme.")) return "theme";
  if (String(type).startsWith("app.")) return "app";
  return "other";
}

function formatEventTime(timestamp) {
  try {
    const lang = getLanguage() || "en";
    return new Intl.DateTimeFormat(lang, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(timestamp));
  } catch {
    return String(timestamp);
  }
}

function formatEventDetail(event) {
  const detail = event?.detail;
  if (!detail || typeof detail !== "object") return "";

  switch (event.type) {
    case "role.selected":
      return t("activity.detail.role", {
        role: t(`activity.values.${String(detail.role || "")}`),
      });
    case "language.changed":
      return t("activity.detail.language", {
        lang: String(detail.lang || "").toUpperCase(),
      });
    case "theme.changed":
      return t("activity.detail.theme", {
        theme: t(`activity.values.${String(detail.theme || "")}`),
      });
    case "session.opened":
    case "session.closed":
    case "session.codeCopied":
      return detail.code
        ? t("activity.detail.code", { code: String(detail.code) })
        : "";
    case "app.backHome":
      return t("activity.detail.from", {
        from: t(`activity.values.${String(detail.from || "")}`),
      });
    default:
      return "";
  }
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
