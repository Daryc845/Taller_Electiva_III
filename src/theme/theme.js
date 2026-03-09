// src/theme/theme.js
// Gestión de tema (dark / light).
// Responsabilidades:
// - Leer tema persistido
// - Aplicar tema al <html>
// - Alternar tema
// - Mantener consistencia con localStorage

const THEME_KEY = "theme";
const DEFAULT_THEME = "dark";

/**
 * Devuelve el tema guardado en localStorage si es válido.
 */
export function getSavedTheme() {
  const value = localStorage.getItem(THEME_KEY);
  return value === "light" || value === "dark" ? value : null;
}

/**
 * Devuelve el tema actualmente aplicado al documento.
 */
export function getCurrentTheme() {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" || value === "dark" ? value : DEFAULT_THEME;
}

/**
 * Aplica un tema al documento y lo persiste.
 */
export function applyTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Inicializa el tema al arrancar la aplicación.
 * Prioridad:
 * 1) Tema guardado
 * 2) Tema por defecto
 */
export function initTheme() {
  const theme = getSavedTheme() ?? DEFAULT_THEME;
  applyTheme(theme);
  return theme;
}

/**
 * Alterna entre dark y light.
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
