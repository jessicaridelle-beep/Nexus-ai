/* ORIVANE Canvas — renders AI-generated HTML inside a sandboxed preview. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const artifactStore = [];
  let activeArtifact = null;
  let overlay = null;
  let frame = null;
  let titleNode = null;

  function safeText(value, fallback, limit) {
    return String(value || fallback).replace(/[<>]/g, "").trim().slice(0, limit);
  }

  function makeDocument(source) {
    const html = String(source || "").trim();
    const policy = "default-src 'none'; img-src data: blob: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; media-src data: blob:; connect-src 'none'; form-action 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'";
    return "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta http-equiv=\"Content-Security-Policy\" content=\"" + policy + "\"><style>html,body{min-height:100%;margin:0}body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style></head><body>" + html + "</body></html>";
  }

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "canvas-overlay";
    overlay.hidden = true;
    overlay.innerHTML = '<section class="canvas-dialog" role="dialog" aria-modal="true" aria-label="ORIVANE Canvas preview"><header class="canvas-dialog-head"><div class="canvas-dialog-title"><strong id="canvasDialogTitle">Canvas preview</strong><small>Sandboxed interactive preview · Local rendering</small></div><div class="canvas-dialog-actions"><button type="button" id="canvasRefresh">↻ Refresh</button><button type="button" id="canvasCopy">Copy HTML</button><button type="button" id="canvasDownload">↓ Export</button><button type="button" class="canvas-close" id="canvasClose" aria-label="Close preview">×</button></div></header><div class="canvas-frame-wrap"><iframe title="ORIVANE Canvas interactive preview" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe></div></section>';
    document.body.appendChild(overlay);
    frame = overlay.querySelector("iframe");
    titleNode = $("canvasDialogTitle");
    $("canvasClose").addEventListener("click", closeCanvas);
    $("canvasRefresh").addEventListener("click", renderActive);
    $("canvasCopy").addEventListener("click", copyActive);
    $("canvasDownload").addEventListener("click", downloadActive);
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeCanvas(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && overlay && !overlay.hidden) closeCanvas(); });
  }

  function renderActive() {
    if (!activeArtifact || !frame) return;
    frame.srcdoc = activeArtifact.document;
  }

  function openCanvas(artifact) {
    ensureOverlay();
    activeArtifact = artifact;
    titleNode.textContent = artifact.title;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    renderActive();
    $("canvasClose").focus();
  }

  function closeCanvas() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (frame) frame.srcdoc = "about:blank";
  }

  async function copyActive() {
    if (!activeArtifact) return;
    const button = $("canvasCopy");
    try {
      await navigator.clipboard.writeText(activeArtifact.document);
      button.textContent = "Copied!";
    } catch {
      button.textContent = "Copy unavailable";
    }
    setTimeout(() => { if (button.isConnected) button.textContent = "Copy HTML"; }, 1500);
  }

  function downloadActive() {
    if (!activeArtifact) return;
    const blob = new Blob([activeArtifact.document], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (activeArtifact.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "orivane-canvas") + ".html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function addCanvasCard(message, artifact) {
    if (message.dataset.canvasAdded === "true") return;
    message.dataset.canvasAdded = "true";
    const body = message.querySelector(".message-body");
    const response = message.querySelector(".assistant-message-content");
    if (!body || !response) return;
    response.textContent = artifact.remainingText || "I've built your interactive Canvas preview.";
    const card = document.createElement("section");
    card.className = "orivane-canvas-card";
    const head = document.createElement("div");
    head.className = "orivane-canvas-card-head";
    const intro = document.createElement("div");
    const brand = document.createElement("div");
    brand.className = "orivane-canvas-brand";
    const mark = document.createElement("span");
    mark.textContent = "✳";
    brand.append(mark, document.createTextNode(" ORIVANE CANVAS"));
    const title = document.createElement("h3");
    title.textContent = artifact.title;
    const description = document.createElement("p");
    description.textContent = artifact.description;
    intro.append(brand, title, description);
    head.append(intro);
    const preview = document.createElement("div");
    preview.className = "orivane-canvas-preview";
    const thumb = document.createElement("iframe");
    thumb.title = artifact.title + " preview";
    thumb.setAttribute("sandbox", "allow-scripts");
    thumb.setAttribute("referrerpolicy", "no-referrer");
    thumb.tabIndex = -1;
    thumb.setAttribute("aria-hidden", "true");
    thumb.srcdoc = artifact.document;
    preview.append(thumb);
    const actions = document.createElement("div");
    actions.className = "orivane-canvas-card-actions";
    const open = document.createElement("button");
    open.type = "button";
    open.className = "canvas-open";
    open.textContent = "↗ Open interactive preview";
    open.addEventListener("click", () => openCanvas(artifact));
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "Copy HTML";
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(artifact.document); copy.textContent = "Copied!"; }
      catch { copy.textContent = "Copy unavailable"; }
      setTimeout(() => { if (copy.isConnected) copy.textContent = "Copy HTML"; }, 1500);
    });
    actions.append(open, copy);
    card.append(head, preview, actions);
    body.appendChild(card);
    artifactStore.push(artifact);
    if (artifactStore.length > 20) artifactStore.shift();
  }

  function processMessage(message) {
    if (!(message instanceof HTMLElement) || message.dataset.canvasAdded === "true") return;
    const response = message.querySelector(".assistant-message-content");
    if (!response) return;
    const original = response.textContent || "";
    const match = original.match(/```orivane-ui(?:\s+title="([^"]*)")?(?:\s+description="([^"]*)")?\s*\n([\s\S]*?)```/i);
    if (!match) return;
    const html = match[3].trim();
    if (!html || html.length > 28000) {
      response.textContent = original.replace(match[0], "[Canvas preview omitted: the generated HTML was empty or too large.]").trim();
      return;
    }
    const artifact = {
      title: safeText(match[1], "Your new interface", 80),
      description: safeText(match[2], "A responsive interactive experience generated by ORIVANE.", 180),
      document: makeDocument(html),
      remainingText: original.replace(match[0], "").trim()
    };
    addCanvasCard(message, artifact);
  }

  function scan(root) {
    if (root.matches && root.matches(".assistant-message")) processMessage(root);
    root.querySelectorAll?.(".assistant-message").forEach(processMessage);
  }

  const chat = $("chatContent");
  if (chat) {
    new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        });
      }
    }).observe(chat, { childList: true, subtree: true });
    scan(chat);
  }

  $("canvasOpen")?.addEventListener("click", () => {
    const last = artifactStore[artifactStore.length - 1];
    if (last) openCanvas(last);
    else {
      const input = $("promptInput");
      if (input) {
        input.value = "Build me an interactive, responsive interface in ORIVANE Canvas for: ";
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  });

  document.querySelectorAll("[data-canvas-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = $("promptInput");
      if (!input) return;
      input.value = button.dataset.canvasPrompt || "Create an interactive interface in ORIVANE Canvas.";
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  });

  window.OrivaneCanvas = {
    openLast: () => artifactStore.length ? openCanvas(artifactStore[artifactStore.length - 1]) : false,
    getCount: () => artifactStore.length
  };
})();
