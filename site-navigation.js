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
  const mobile = window.matchMedia("(max-width: 760px)");
  const band = document.getElementById("modelNavBand");
  const mobileToggle = document.getElementById("modelNavToggle");
  const main = document.querySelector("main");
  band.classList.add("is-enhanced");
  let opened = null;
  let framePending = false;
  let mobileExpanded = false;

  // Each model owns its dropdown, which becomes an inline accordion on mobile.
  const models = Array.from(nav.querySelectorAll("a")).map(anchor => {
    const url = new URL(anchor.getAttribute("href"), window.location.href);
    const key = url.pathname.split("/").pop().replace(/\.html$/, "");
    const label = anchor.textContent;
    const current = anchor.getAttribute("aria-current") === "page";
    url.hash = "inicio";
    anchor.id = `modelLink-${key}`;
    anchor.setAttribute("href", current ? "#inicio" : url.href);
    const item = document.createElement("div");
    item.classList.add("model-nav-item");
    if (current) item.classList.add("is-current");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `modelSections-${key}`);
    button.setAttribute("aria-label", `Mostrar secciones de ${label}`);
    const indicator = document.createElement("span");
    indicator.classList.add("model-nav-chevron");
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = "▾";
    button.appendChild(indicator);
    const panel = document.createElement("section");
    panel.id = `modelSections-${key}`;
    panel.classList.add("model-sections");
    panel.setAttribute("aria-labelledby", anchor.id);
    panel.hidden = true;
    const list = document.createElement("ol");
    panel.appendChild(list);
    anchor.replaceWith(item);
    item.appendChild(anchor);
    item.appendChild(button);
    item.appendChild(panel);
    const entries = sections[key].map(([id, sectionLabel]) => {
      const entry = document.createElement("li");
      const link = document.createElement("a");
      const target = current ? document.getElementById(id) : null;
      const destination = new URL(url.href);
      destination.hash = id;
      // The comparison is hidden in Rasch; remote links open its 2PL variant.
      if (key === "rasch" && id === "personComparison") destination.searchParams.set("model", "2pl");
      link.setAttribute("href", current ? `#${id}` : destination.href);
      link.textContent = sectionLabel;
      link.addEventListener("click", event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
        closeForNavigation(target);
      });
      entry.appendChild(link);
      list.appendChild(entry);
      return {item: entry, anchor: link, target};
    });
    return {key, item, anchor, button, panel, entries, current, label};
  });
  const currentModel = models.find(model => model.current);

  function headerOffset() {
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--page-header-height", height + "px");
    document.documentElement.style.setProperty("--page-header-offset", (height + 20) + "px");
    return height + 20;
  }

  function close(restoreFocus = false) {
    if (!opened) return;
    const model = opened;
    opened = null;
    model.item.classList.remove("is-open");
    model.panel.hidden = true;
    model.button.setAttribute("aria-expanded", "false");
    model.button.setAttribute("aria-label", `Mostrar secciones de ${model.label}`);
    if (restoreFocus) model.button.focus({preventScroll: true});
  }

  function positionPanel() {
    if (!opened) return;
    if (mobile.matches) {
      opened.panel.style.left = "";
      opened.panel.style.maxHeight = "";
      return;
    }
    const itemRect = opened.item.getBoundingClientRect();
    const panelWidth = opened.panel.getBoundingClientRect().width;
    const viewport = document.documentElement;
    const left = Math.min(0, viewport.clientWidth - 12 - itemRect.left - panelWidth);
    opened.panel.style.left = Math.max(12 - itemRect.left, left) + "px";
    opened.panel.style.maxHeight = Math.max(44, viewport.clientHeight - itemRect.bottom - 12) + "px";
  }

  function setMobileExpanded(expanded, restoreFocus = false) {
    if (!expanded) close();
    mobileExpanded = expanded;
    band.hidden = mobile.matches && !expanded;
    mobileToggle.hidden = !mobile.matches;
    mobileToggle.textContent = expanded ? "Cerrar" : "Menú";
    mobileToggle.setAttribute("aria-expanded", String(expanded));
    mobileToggle.setAttribute("aria-label", expanded ? "Ocultar menú de modelos" : "Mostrar menú de modelos");
    update();
    if (restoreFocus) mobileToggle.focus({preventScroll: true});
  }

  function closeForNavigation(target) {
    close();
    if (mobile.matches) setMobileExpanded(false);
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({preventScroll: true});
    }
  }

  function updateSections(offset) {
    models.forEach(model => {
      const visible = model.entries.filter(entry => {
        const available = !model.current || (entry.target && !entry.target.closest("[hidden]"));
        entry.item.hidden = !available;
        return available;
      });
      let current = model.current ? visible[0] : null;
      visible.forEach(entry => {
        if (entry.target && entry.target.getBoundingClientRect().top <= offset + 24) current = entry;
      });
      model.entries.forEach(entry => {
        if (entry === current) entry.anchor.setAttribute("aria-current", "location");
        else entry.anchor.removeAttribute("aria-current");
      });
    });
  }

  function open(model) {
    if (opened === model) return;
    close();
    opened = model;
    model.panel.hidden = false;
    model.item.classList.add("is-open");
    model.button.setAttribute("aria-expanded", "true");
    model.button.setAttribute("aria-label", `Ocultar secciones de ${model.label}`);
    update();
  }

  function update() {
    framePending = false;
    updateSections(headerOffset());
    positionPanel();
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  }

  models.forEach(model => {
    model.item.addEventListener("pointerenter", event => {
      if (!mobile.matches && event.pointerType === "mouse" && hover.matches &&
          !(opened && opened.panel.contains(document.activeElement))) open(model);
    });
    model.item.addEventListener("pointerleave", event => {
      if (!mobile.matches && event.pointerType === "mouse" && opened === model &&
          !model.item.contains(document.activeElement)) close();
    });
    model.item.addEventListener("focusout", event => {
      if (!mobile.matches && opened === model && !model.item.contains(event.relatedTarget)) close();
    });
    model.anchor.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      closeForNavigation(model.current ? document.getElementById("inicio") : null);
    });
    model.button.addEventListener("click", () => opened === model ? close() : open(model));
    const openFromKeyboard = event => {
      if (event.key !== "ArrowDown" || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      open(model);
      const first = model.entries.find(entry => !entry.item.hidden);
      if (first) first.anchor.focus({preventScroll: true});
    };
    model.anchor.addEventListener("keydown", openFromKeyboard);
    model.button.addEventListener("keydown", openFromKeyboard);
  });
  header.addEventListener("pointerleave", event => {
    if (!mobile.matches && event.pointerType === "mouse" && !header.contains(document.activeElement)) close();
  });
  header.addEventListener("focusout", event => {
    if (!header.contains(event.relatedTarget)) {
      close();
      if (mobile.matches && mobileExpanded) setMobileExpanded(false);
    }
  });
  document.addEventListener("pointerdown", event => {
    if (!header.contains(event.target)) {
      close();
      if (mobile.matches && mobileExpanded) setMobileExpanded(false);
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && opened) {
      event.preventDefault();
      close(opened.panel.contains(document.activeElement));
    } else if (event.key === "Escape" && mobile.matches && mobileExpanded) {
      event.preventDefault();
      setMobileExpanded(false, true);
    }
  });
  mobileToggle.addEventListener("click", () => setMobileExpanded(!mobileExpanded));
  mobile.addEventListener("change", () => {
    const focusedModel = models.find(model => model.item.contains(document.activeElement));
    const sectionFocused = focusedModel && focusedModel.panel.contains(document.activeElement);
    const toggleFocused = document.activeElement === mobileToggle;
    setMobileExpanded(false);
    if (mobile.matches && focusedModel) mobileToggle.focus({preventScroll: true});
    else if (!mobile.matches && toggleFocused && currentModel) currentModel.anchor.focus({preventScroll: true});
    else if (!mobile.matches && sectionFocused) focusedModel.button.focus({preventScroll: true});
  });
  window.addEventListener("scroll", scheduleUpdate, {passive: true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(header);
    observer.observe(nav);
  }
  if (window.MutationObserver && main) {
    new MutationObserver(scheduleUpdate).observe(main, {attributes: true, attributeFilter: ["hidden"], subtree: true});
  }
  setMobileExpanded(false);
})();
