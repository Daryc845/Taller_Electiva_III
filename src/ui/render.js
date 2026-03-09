// src/ui/render.js
// Render pipeline simple.
// Permite desacoplar el estado del proceso de renderizado.
//
// Flujo:
// 1. main.js registra la función render principal con registerRender.
// 2. Cuando cambia el estado, se llama triggerRender().
// 3. triggerRender ejecuta la función registrada.

let renderFn = null;
export function registerRender(fn) {
  if (typeof fn !== "function") {
    throw new Error("registerRender requires a function");
  }

  renderFn = fn;
}
export function triggerRender() {
  if (!renderFn) return;

  renderFn();
}
