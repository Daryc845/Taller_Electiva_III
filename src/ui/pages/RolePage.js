// src/ui/pages/RolePage.js
// Pantalla inicial: permite elegir el rol con el que se usará la app.

import { setState } from "../../state/state.js";
import { triggerRender } from "../render.js";
import { t } from "../../i18n/i18n.js";

export function createRolePage() {
  const container = document.createElement("main");
  container.className = "card";

  const title = document.createElement("div");
  title.className = "card__title";
  title.textContent = t("role.title");

  const grid = document.createElement("div");
  grid.className = "role-grid";

  grid.append(
    createRoleCard({
      accent: "teacher",
      shortKey: "role.teacherShort",
      titleKey: "role.teacher",
      descKey: "role.teacherDesc",
      onSelect: () => selectRole("teacher"),
    }),
    createRoleCard({
      accent: "student",
      shortKey: "role.studentShort",
      titleKey: "role.student",
      descKey: "role.studentDesc",
      onSelect: () => selectRole("student"),
    }),
  );

  container.append(title, grid);
  return container;
}

function selectRole(role) {
  setState({ role });
  triggerRender();
}

function createRoleCard({ accent, shortKey, titleKey, descKey, onSelect }) {
  const title = t(titleKey);
  const desc = t(descKey);

  const card = document.createElement("button");
  card.type = "button";
  card.className = "role-card";
  card.dataset.accent = accent;
  card.setAttribute("aria-label", `${title}. ${desc}`);

  const head = document.createElement("div");
  head.className = "role-card__head";

  const iconEl = document.createElement("div");
  iconEl.className = "role-card__icon role-card__icon--letter";
  iconEl.textContent = t(shortKey);

  const titleEl = document.createElement("div");
  titleEl.className = "role-card__title";
  titleEl.textContent = title;

  head.append(iconEl, titleEl);

  const descEl = document.createElement("div");
  descEl.className = "role-card__desc";
  descEl.textContent = desc;

  const hintEl = document.createElement("div");
  hintEl.className = "role-card__hint";
  hintEl.textContent = t("common.tapToSelect");

  card.append(head, descEl, hintEl);
  card.addEventListener("click", onSelect);

  return card;
}
