(() => {
  "use strict";

  const toggle = document.getElementById("pageExplorerToggle");
  const links = document.getElementById("pageExplorerLinks");
  if (!toggle || !links) return;
  const explorer = document.getElementById("pageExplorer");
  const tools = document.getElementById("pageExplorerTools");
  const move = document.getElementById("pageExplorerMove");
  const reset = document.getElementById("pageExplorerReset");
  const status = document.getElementById("pageExplorerStatus");
  const header = document.querySelector(".site-header, .topbar");
  const main = document.querySelector("main");
  const wide = window.matchMedia("(min-width: 1600px)");
  const entries = Array.from(links.querySelectorAll('a[href^="#"]')).map(anchor => ({
    anchor, target: document.getElementById(anchor.getAttribute("href").slice(1))
  })).filter(entry => entry.target);
  let framePending = false;
  let headerOffset = 160;
  let drag = null;
  const storageKey = "irt-page-explorer-position-v1";
  let position = readPosition();

  function readPosition() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey));
      return saved && Number.isFinite(saved.left) && Number.isFinite(saved.top) ? saved : null;
    } catch { return null; }
  }

  function placePosition() {
    if (!position) return;
    const rect = explorer.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const maxLeft = Math.max(12, width - rect.width - 12);
    const maxTop = Math.max(12, height - rect.height - 12);
    const minTop = Math.min(headerOffset, maxTop);
    const left = Math.min(maxLeft, Math.max(12, position.left));
    const top = Math.min(maxTop, Math.max(minTop, position.top));
    explorer.style.left = left + "px";
    explorer.style.top = top + "px";
    explorer.style.bottom = "auto";
    return {left, top};
  }

  function savePosition() {
    position = placePosition();
    status.textContent = "Posición del menú ajustada.";
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(position));
      status.textContent = "Posición del menú guardada en este navegador.";
    } catch {}
  }

  function clearPositionStyles() {
    explorer.style.left = "";
    explorer.style.top = "";
    explorer.style.bottom = "";
  }

  function finishDrag(cancelled) {
    if (!drag) return;
    const previous = drag;
    drag = null;
    explorer.classList.remove("is-dragging");
    if (move.hasPointerCapture(previous.id)) move.releasePointerCapture(previous.id);
    if (cancelled) {
      position = previous.position;
      if (position) placePosition();
      else clearPositionStyles();
      status.textContent = "Movimiento cancelado.";
    } else if (previous.moved) savePosition();
  }

  function setExpanded(expanded) {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Ocultar secciones de esta página" : "Mostrar secciones de esta página");
    document.getElementById("pageExplorerIndicator").textContent = expanded ? "-" : "+";
    links.hidden = !expanded;
    tools.hidden = !expanded;
    placePosition();
  }

  function update() {
    framePending = false;
    const offset = Math.ceil(header ? header.getBoundingClientRect().height : 0) + 20;
    headerOffset = offset;
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
    placePosition();
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
  explorer.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (drag) { finishDrag(true); return; }
    setExpanded(false);
    toggle.focus({preventScroll: true});
  });
  move.addEventListener("pointerdown", event => {
    if (event.button !== 0 || event.isPrimary === false || drag) return;
    event.preventDefault();
    move.focus({preventScroll: true});
    const rect = explorer.getBoundingClientRect();
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, position, moved: false};
    move.setPointerCapture(event.pointerId);
  });
  move.addEventListener("pointermove", event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    explorer.classList.add("is-dragging");
    position = {left: drag.left + dx, top: drag.top + dy};
    placePosition();
  });
  move.addEventListener("pointerup", event => { if (drag && event.pointerId === drag.id) finishDrag(false); });
  move.addEventListener("pointercancel", event => { if (drag && event.pointerId === drag.id) finishDrag(true); });
  move.addEventListener("lostpointercapture", () => finishDrag(true));
  move.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey || drag) return;
    const directions = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const rect = explorer.getBoundingClientRect();
    const step = event.shiftKey ? 40 : 16;
    position = {left: rect.left + direction[0] * step, top: rect.top + direction[1] * step};
    savePosition();
  });
  reset.addEventListener("click", () => {
    finishDrag(true);
    position = null;
    clearPositionStyles();
    try { window.localStorage.removeItem(storageKey); } catch {}
    status.textContent = "Menú restablecido a su posición inicial.";
  });
  document.getElementById("pageExplorerTitle").hidden = true;
  toggle.hidden = false;
  setExpanded(wide.matches);
  wide.addEventListener("change", () => {
    finishDrag(true);
    if (!wide.matches && explorer.contains(document.activeElement)) toggle.focus({preventScroll: true});
    setExpanded(wide.matches);
    scheduleUpdate();
  });
  window.addEventListener("scroll", scheduleUpdate, {passive: true});
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  if (window.ResizeObserver && header) new ResizeObserver(scheduleUpdate).observe(header);
  if (window.ResizeObserver) new ResizeObserver(scheduleUpdate).observe(explorer);
  if (window.MutationObserver && main) {
    new MutationObserver(scheduleUpdate).observe(main, {attributes: true, attributeFilter: ["hidden"], subtree: true});
  }
  update();
})();
