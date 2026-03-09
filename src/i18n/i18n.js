// src/i18n/i18n.js
// i18n manual basado en diccionarios.
// Regla: la UI nunca guarda textos finales, guarda keys (messageKey, errorKey) y traduce en render.

import { messages } from "./messages.js";

const LS_LANG = "lang"; // "es" | "en"
const DEFAULT_LANG = "en";

/**
 * Detecta el idioma del navegador (solo "es" o "en").
 * Si no coincide, retorna DEFAULT_LANG.
 */
function detectBrowserLanguage() {
  const langs = Array.isArray(navigator.languages) ? navigator.languages : [];
  const primary = navigator.language ? [navigator.language] : [];
  const candidates = [...langs, ...primary].filter(Boolean);

  for (const l of candidates) {
    const norm = String(l).toLowerCase();
    if (norm.startsWith("es")) return "es";
    if (norm.startsWith("en")) return "en";
  }
  return DEFAULT_LANG;
}

/**
 * Lee el idioma guardado. No tiene efectos secundarios.
 */
export function getLanguage() {
  const saved = localStorage.getItem(LS_LANG);
  return saved === "es" || saved === "en" ? saved : null;
}

/**
 * Inicializa el idioma al arrancar la app.
 * Prioridad:
 * 1) Idioma guardado
 * 2) Idioma detectado
 * 3) DEFAULT_LANG
 */
export function initLanguage() {
  const saved = getLanguage();
  const lang = saved ?? detectBrowserLanguage() ?? DEFAULT_LANG;
  localStorage.setItem(LS_LANG, lang);
  return lang;
}

/**
 * Establece idioma y lo persiste.
 */
export function setLanguage(lang) {
  const next = lang === "es" ? "es" : "en";
  localStorage.setItem(LS_LANG, next);
  return next;
}

/**
 * Alterna entre ES y EN.
 */
export function toggleLanguage() {
  const current = getLanguage() ?? initLanguage();
  return setLanguage(current === "es" ? "en" : "es");
}

/**
 * Traduce una clave tipo "path.to.key".
 * Soporta interpolación: t("key", { name: "Jorge" }) => "Hola Jorge"
 *
 * Fallback:
 * - Si falta en el idioma actual, intenta en EN.
 * - Si falta en ambos, devuelve la key (para detectar huecos).
 */
export function t(key, params = null) {
  const lang = getLanguage() ?? initLanguage();

  const dict = messages[lang] ?? messages.en ?? {};
  const enDict = messages.en ?? dict;

  let value = getByPath(dict, key);
  if (value == null) value = getByPath(enDict, key);
  if (value == null) return String(key);

  let out = String(value);
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

/**
 * Valida consistencia de claves entre ES y EN.
 * Retorna un objeto con claves faltantes en cada diccionario.
 * Útil en desarrollo (no se ejecuta automáticamente).
 */
export function validateDictionaries() {
  const es = messages.es ?? {};
  const en = messages.en ?? {};

  const esKeys = flattenKeys(es);
  const enKeys = flattenKeys(en);

  return {
    missingInEs: [...enKeys].filter((k) => !esKeys.has(k)),
    missingInEn: [...esKeys].filter((k) => !enKeys.has(k)),
  };
}

function getByPath(obj, key) {
  const parts = String(key).split(".");
  let cur = obj;
  for (const p of parts) {
    cur = cur?.[p];
    if (cur == null) return null;
  }
  return cur;
}

function flattenKeys(obj, prefix = "") {
  const out = new Set();
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

  for (const [k, v] of Object.entries(obj || {})) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (isObj(v)) {
      for (const child of flattenKeys(v, next)) out.add(child);
    } else {
      out.add(next);
    }
  }
  return out;
}
