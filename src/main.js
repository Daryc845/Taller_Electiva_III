// src/main.js
// Punto de entrada de la aplicación.
// Responsabilidades:
// 1) Cargar estilos globales.
// 2) Inicializar configuración persistente (tema / idioma).
// 3) Montar la UI raíz.

import "./styles/index.css";
import { createAppRoot } from "./ui/app.ui.js";
import { initTheme } from "./theme/theme.js";
import { initLanguage } from "./i18n/i18n.js";

initLanguage();

// Aplica el tema guardado (dark por defecto + toggle).
// Debe ejecutarse antes del primer render para evitar "flash" de tema.
initTheme();

// Montaje de la app
const mount = document.getElementById("app");
if (!mount) {
  throw new Error('Mount element "#app" not found');
}

createAppRoot(mount);
