(() => {
  "use strict";

  const toggle = document.getElementById("pageExplorerToggle");
  const links = document.getElementById("pageExplorerLinks");
  if (!toggle || !links) return;
  const header = document.querySelector(".site-header, .topbar");
  const main = document.querySelector("main");
  const wide = window.matchMedia("(min-width: 1600px)");
  const entries = Array.from(links.querySelectorAll('a[href^="#"]')).map(anchor => ({
    anchor, target: document.getElementById(anchor.getAttribute("href").slice(1))
  })).filter(entry => entry.target);
  let framePending = false;

  function setExpanded(expanded) {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Ocultar secciones de esta página" : "Mostrar secciones de esta página");
    document.getElementById("pageExplorerIndicator").textContent = expanded ? "-" : "+";
    links.hidden = !expanded;
  }

  function update() {
    framePending = false;
    const offset = Math.ceil(header ? header.getBoundingClientRect().height : 0) + 20;
    document.documentElement.style.setProperty("--page-header-offset", offset + "px");
    const visible = entries.filter(({anchor, target}) => {
      const available = !target.closest("[hidden]");
      anchor.parentElement.hidden = !available;
      return available;
    });
    let current = visible[0];
    visible.forEach(entry => {
      if (entry.target.getBoundingClientRect().top <= offset + 24) current = entry;
    });
    entries.forEach(entry => {
      if (entry === current) entry.anchor.setAttribute("aria-current", "location");
      else entry.anchor.removeAttribute("aria-current");
    });
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  }

  entries.forEach(({anchor, target}) => {
    // Focusable targets preserve native hash navigation and keyboard context.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    anchor.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      target.focus({preventScroll: true});
      if (!wide.matches) setExpanded(false);
    });
  });
  toggle.addEventListener("click", () => setExpanded(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    setExpanded(false);
    toggle.focus({preventScroll: true});
  });
  document.getElementById("pageExplorerTitle").hidden = true;
  toggle.hidden = false;
  setExpanded(wide.matches);
  wide.addEventListener("change", () => {
    if (!wide.matches && links.contains(document.activeElement)) toggle.focus({preventScroll: true});
    setExpanded(wide.matches);
    scheduleUpdate();
  });
  window.addEventListener("scroll", scheduleUpdate, {passive: true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  if (window.ResizeObserver && header) new ResizeObserver(scheduleUpdate).observe(header);
  if (window.MutationObserver && main) {
    new MutationObserver(scheduleUpdate).observe(main, {attributes: true, attributeFilter: ["hidden"], subtree: true});
  }
  update();
})();
