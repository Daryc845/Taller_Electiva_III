import { state, setState } from "../state/state.js";

const STORAGE_KEY = "classsync.activityLog";
const MAX_EVENTS = 20;

export const EVENT = {
  ROLE_SELECTED: "role.selected",
  LANGUAGE_CHANGED: "language.changed",
  THEME_CHANGED: "theme.changed",
  SESSION_OPENED: "session.opened",
  SESSION_CLOSED: "session.closed",
  CODE_COPIED: "session.codeCopied",
  BACK_HOME: "app.backHome",
};

export function loadActivityLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((e) => e && e.type && e.timestamp)
      .slice(0, MAX_EVENTS);
  } catch {
    return [];
  }
}

export function logEvent(type, detail = null) {
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type,
    timestamp: Date.now(),
    detail,
  };

  const next = [entry, ...(state.activityLog || [])].slice(0, MAX_EVENTS);
  setState({ activityLog: next });
  persistActivityLog(next);
}

export function clearActivityLog() {
  setState({ activityLog: [] });
  persistActivityLog([]);
}

function persistActivityLog(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}