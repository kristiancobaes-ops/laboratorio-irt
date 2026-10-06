(() => {
  "use strict";

  const header = document.querySelector(".site-header, .topbar");
  const nav = header && header.querySelector(".site-nav");
  if (!nav) return;
  const sections = {
    index: [["inicio", "Presentación"], ["casos", "Tipos de respuesta"], ["parametros", "Parámetros"], ["modelos", "Elegir laboratorio"], ["ruta", "Ruta sugerida"]],
    rasch: [["inicio", "Presentación"], ["modelo", "Modelos y alcance"], ["formula", "Fórmula"], ["laboratorio", "Laboratorio"], ["personComparison", "Comparar estudiantes (2PL/3PL)"]],
    pcm: [["inicio", "Presentación"], ["rubrica", "Parámetros y alcance"], ["formula", "Fórmula"], ["laboratorio", "Laboratorio"], ["comparacion-personas", "Comparar estudiantes"]],
    gpcm: [["inicio", "Presentación"], ["modelo", "Parámetros y alcance"], ["formula", "Fórmula"], ["laboratorio", "Laboratorio"], ["comparacion-personas", "Comparar estudiantes"]],
    grm: [["inicio", "Presentación"], ["fundamentos", "Parámetros y alcance"], ["formula", "Fórmula"], ["laboratorio", "Laboratorio"], ["comparacion-personas", "Comparar candidatos"], ["ejemplos", "Aplicaciones"], ["comparar", "Comparar dos ítems"], ["practica", "Autoevaluación"], ["sintesis", "Síntesis"]]
  };
  const hover = window.matchMedia("(any-hover: hover)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const band = document.getElementById("modelNavBand");
  const row = document.getElementById("modelNavRow");
  const previous = document.getElementById("modelNavPrevious");
  const next = document.getElementById("modelNavNext");
  const track = document.getElementById("modelNavScrollTrack");
  const thumb = document.getElementById("modelNavScrollThumb");
  const scrollHint = document.getElementById("modelNavScrollHint");
  const main = document.querySelector("main");
  let opened = null;
  let entries = [];
  let framePending = false;

  const panel = document.createElement("section");
  panel.id = "modelSections";
  panel.classList.add("model-sections");
  panel.setAttribute("aria-labelledby", "modelSectionsTitle");
  panel.hidden = true;
  const panelHead = document.createElement("div");
  panelHead.classList.add("model-sections-head");
  const title = document.createElement("h2");
  title.id = "modelSectionsTitle";
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("model-sections-close");
  closeButton.textContent = "Cerrar";
  closeButton.setAttribute("aria-label", "Cerrar secciones del modelo");
  const list = document.createElement("ol");
  panelHead.appendChild(title);
  panelHead.appendChild(closeButton);
  panel.appendChild(panelHead);
  panel.appendChild(list);
  header.appendChild(panel);

  // Real page links remain the fallback when JavaScript is unavailable.
  const models = Array.from(nav.querySelectorAll("a")).map(anchor => {
    const url = new URL(anchor.getAttribute("href"), window.location.href);
    const key = url.pathname.split("/").pop().replace(/\.html$/, "");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = anchor.textContent;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panel.id);
    button.setAttribute("aria-label", `Mostrar secciones de ${anchor.textContent}`);
    const current = anchor.getAttribute("aria-current") === "page";
    if (current) {
      button.classList.add("active");
      button.setAttribute("aria-current", "page");
    }
    const indicator = document.createElement("span");
    indicator.classList.add("model-nav-chevron");
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = "▾";
    button.appendChild(indicator);
    anchor.replaceWith(button);
    return {key, url, button, current, label: anchor.textContent};
  });
  document.getElementById("modelNavHint").textContent = "Selecciona un modelo para ver sus secciones.";

  function headerOffset() {
    const offset = Math.ceil(header.getBoundingClientRect().height) + 20;
    document.documentElement.style.setProperty("--page-header-offset", offset + "px");
    return offset;
  }

  function close(restoreFocus = false) {
    if (!opened) return;
    const button = opened.button;
    opened = null;
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    headerOffset();
    if (restoreFocus) button.focus({preventScroll: true});
  }

  function updateSections(offset) {
    if (!opened) return;
    const visible = entries.filter(entry => {
      const available = !opened.current || (entry.target && !entry.target.closest("[hidden]"));
      entry.item.hidden = !available;
      return available;
    });
    let current = opened.current ? visible[0] : null;
    visible.forEach(entry => {
      if (entry.target && entry.target.getBoundingClientRect().top <= offset + 24) current = entry;
    });
    entries.forEach(entry => {
      if (entry === current) entry.anchor.setAttribute("aria-current", "location");
      else entry.anchor.removeAttribute("aria-current");
    });
  }

  function open(model) {
    if (opened === model) return;
    close();
    opened = model;
    list.replaceChildren();
    title.textContent = `${model.label}: secciones`;
    entries = sections[model.key].map(([id, label]) => {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      const target = model.current ? document.getElementById(id) : null;
      const destination = new URL(model.url.href);
      destination.hash = id;
      // The comparison is hidden in Rasch; remote links open its 2PL variant.
      if (model.key === "rasch" && id === "personComparison") destination.searchParams.set("model", "2pl");
      anchor.setAttribute("href", model.current ? `#${id}` : destination.href);
      anchor.textContent = label;
      if (target && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      anchor.addEventListener("click", event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
        close();
        if (target) target.focus({preventScroll: true});
      });
      item.appendChild(anchor);
      list.appendChild(item);
      return {item, anchor, target};
    });
    panel.hidden = false;
    model.button.setAttribute("aria-expanded", "true");
    updateSections(headerOffset());
  }

  function updateScroll() {
    const overflow = nav.scrollWidth > row.clientWidth + 1;
    band.classList.toggle("has-overflow", overflow);
    previous.hidden = next.hidden = track.hidden = scrollHint.hidden = !overflow;
    const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
    const progress = maxScroll ? Math.min(1, Math.max(0, nav.scrollLeft / maxScroll)) : 0;
    const fraction = Math.min(1, nav.clientWidth / Math.max(1, nav.scrollWidth));
    previous.disabled = nav.scrollLeft <= 1;
    next.disabled = nav.scrollLeft >= maxScroll - 1;
    thumb.style.width = fraction * 100 + "%";
    thumb.style.marginLeft = progress * (1 - fraction) * 100 + "%";
  }

  function update() {
    framePending = false;
    updateScroll();
    updateSections(headerOffset());
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  }

  models.forEach(model => {
    model.button.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse" && hover.matches && !panel.contains(document.activeElement)) open(model);
    });
    model.button.addEventListener("click", () => opened === model ? close() : open(model));
    model.button.addEventListener("keydown", event => {
      if (event.key !== "ArrowDown" || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      open(model);
      const first = entries.find(entry => !entry.item.hidden);
      if (first) first.anchor.focus({preventScroll: true});
    });
  });
  header.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse" && !header.contains(document.activeElement)) close();
  });
  header.addEventListener("focusout", event => {
    if (!header.contains(event.relatedTarget)) close();
  });
  document.addEventListener("pointerdown", event => {
    if (!header.contains(event.target)) close();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && opened) {
      event.preventDefault();
      close(panel.contains(document.activeElement));
    }
  });
  closeButton.addEventListener("click", () => close(true));
  [[previous, -1], [next, 1]].forEach(([button, direction]) => {
    button.addEventListener("click", () => nav.scrollBy({
      left: direction * Math.max(160, nav.clientWidth * .75),
      behavior: reducedMotion.matches ? "auto" : "smooth"
    }));
  });
  nav.addEventListener("scroll", scheduleUpdate, {passive: true});
  window.addEventListener("scroll", scheduleUpdate, {passive: true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(header);
    observer.observe(row);
  }
  if (window.MutationObserver && main) {
    new MutationObserver(scheduleUpdate).observe(main, {attributes: true, attributeFilter: ["hidden"], subtree: true});
  }
  update();
  const currentModel = models.find(model => model.current);
  if (currentModel) {
    const buttonRect = currentModel.button.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    nav.scrollLeft = Math.max(0, Math.min(nav.scrollWidth - nav.clientWidth,
      nav.scrollLeft + buttonRect.left - navRect.left - (nav.clientWidth - buttonRect.width) / 2));
    updateScroll();
  }
})();
