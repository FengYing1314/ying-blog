<template>
  <div ref="root" class="markdown-body" v-html="html" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Locale } from "../types/content";
import { uiText } from "../config/site";

const props = defineProps<{
  html: string;
  locale: Locale;
}>();

const root = ref<HTMLElement>();
let tabGroupCounter = 0;
let codeResizeObserver: ResizeObserver | undefined;
let mermaidRenderCounter = 0;
let themeObserver: MutationObserver | undefined;
let mermaidRenderer: typeof import("mermaid").default | undefined;
let activeMermaidDialog: HTMLElement | undefined;
let activeMermaidDialogCleanup: Array<() => void> = [];
let activeMermaidDialogFocus: HTMLElement | undefined;
let previousBodyOverflow = "";

const mermaidMinScale = 0.6;
const mermaidMaxScale = 2.5;
const mermaidZoomStep = 0.15;
const mermaidStateByHost = new WeakMap<HTMLElement, MermaidViewState>();

interface MermaidViewState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  pointerId?: number;
  startX: number;
  startY: number;
  startTranslateX: number;
  startTranslateY: number;
  moved: boolean;
  activeTimer?: number;
}

onMounted(() => {
  void enhance();
  observeThemeChanges();
});

onBeforeUnmount(() => {
  codeResizeObserver?.disconnect();
  themeObserver?.disconnect();
  closeMermaidDialog(false);
});

watch(
  () => [props.html, props.locale],
  async () => {
    closeMermaidDialog(false);
    await enhance();
  },
);

async function enhance() {
  await nextTick();
  enhanceCodeCopy();
  enhanceMermaidCopy();
  await renderMermaidDiagrams();
  enhanceMermaidInteractions();
  enhanceScrollableCode();
  observeScrollableCode();
  enhanceTabs();
}

function enhanceCodeCopy() {
  root.value?.querySelectorAll<HTMLButtonElement>("[data-copy-code]").forEach((button) => {
    const copyLabel = button.dataset.copyLabel ?? uiText.actions.copy[props.locale];
    const copiedLabel = button.dataset.copiedLabel ?? uiText.actions.copied[props.locale];

    if (button.dataset.ready === "true") {
      button.textContent = copyLabel;
      button.setAttribute("aria-label", copyLabel);
      return;
    }

    button.dataset.ready = "true";
    button.textContent = copyLabel;
    button.setAttribute("aria-label", copyLabel);
    button.addEventListener("click", async () => {
      const wrapper = button.closest<HTMLElement>(".code-block");
      const code = wrapper?.dataset.code ?? "";
      const copied = await copyToClipboard(code);
      if (copied) {
        button.textContent = copiedLabel;
        button.setAttribute("aria-label", copiedLabel);
        window.setTimeout(() => {
          button.textContent = copyLabel;
          button.setAttribute("aria-label", copyLabel);
        }, 1400);
      }
    });
  });
}

function enhanceScrollableCode() {
  root.value?.querySelectorAll<HTMLElement>(".shiki").forEach((block) => {
    block.classList.toggle("is-scrollable", block.scrollWidth > block.clientWidth + 1);
  });
}

function observeScrollableCode() {
  codeResizeObserver?.disconnect();

  if (!root.value || !("ResizeObserver" in window)) {
    return;
  }

  codeResizeObserver = new ResizeObserver(() => {
    enhanceScrollableCode();
  });

  root.value.querySelectorAll<HTMLElement>(".code-block, .shiki").forEach((element) => {
    codeResizeObserver?.observe(element);
  });
}

function observeThemeChanges() {
  if (!("MutationObserver" in window)) {
    return;
  }

  themeObserver = new MutationObserver(() => {
    closeMermaidDialog(false);
    root.value?.querySelectorAll<HTMLElement>("[data-mermaid]").forEach((element) => {
      element.dataset.rendered = "false";
      const canvas = element.querySelector<HTMLElement>("[data-mermaid-canvas]");
      if (canvas) {
        canvas.innerHTML = "";
      }
    });
    void (async () => {
      await renderMermaidDiagrams();
      enhanceMermaidInteractions();
    })();
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

function enhanceMermaidCopy() {
  root.value?.querySelectorAll<HTMLButtonElement>("[data-copy-mermaid]").forEach((button) => {
    const copyLabel = button.dataset.copyLabel ?? uiText.actions.copy[props.locale];
    const copiedLabel = button.dataset.copiedLabel ?? uiText.actions.copied[props.locale];

    if (button.dataset.ready === "true") {
      button.setAttribute("aria-label", copyLabel);
      button.setAttribute("title", copyLabel);
      return;
    }

    button.dataset.ready = "true";
    button.setAttribute("aria-label", copyLabel);
    button.setAttribute("title", copyLabel);
    button.addEventListener("click", async () => {
      const wrapper = button.closest<HTMLElement>("[data-mermaid]");
      const source =
        wrapper?.querySelector<HTMLElement>("[data-mermaid-source]")?.textContent ?? "";
      const copied = await copyToClipboard(source);
      if (copied) {
        wrapper?.classList.add("is-copied");
        button.setAttribute("aria-label", copiedLabel);
        button.setAttribute("title", copiedLabel);
        window.setTimeout(() => {
          wrapper?.classList.remove("is-copied");
          button.setAttribute("aria-label", copyLabel);
          button.setAttribute("title", copyLabel);
        }, 1400);
      }
    });
  });
}

async function renderMermaidDiagrams() {
  const diagrams = Array.from(
    root.value?.querySelectorAll<HTMLElement>('[data-mermaid][data-rendered="false"]') ?? [],
  );

  if (diagrams.length === 0) {
    return;
  }

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: currentMermaidTheme(),
    themeVariables: mermaidThemeVariables(),
  });

  for (const diagram of diagrams) {
    const canvas = diagram.querySelector<HTMLElement>("[data-mermaid-canvas]");
    const source = diagram.querySelector<HTMLElement>("[data-mermaid-source]")?.textContent ?? "";
    if (!canvas || !source.trim()) {
      diagram.dataset.rendered = "error";
      continue;
    }

    const renderId = `md-mermaid-${props.locale}-${mermaidRenderCounter}`;
    mermaidRenderCounter += 1;

    try {
      const { svg, bindFunctions } = await mermaid.render(renderId, source);
      canvas.innerHTML = `<div class="md-mermaid-pan" data-mermaid-pan>${svg}</div>`;
      sizeMermaidSvg(canvas);
      bindFunctions?.(canvas.querySelector<HTMLElement>("[data-mermaid-pan]") ?? canvas);
      diagram.dataset.rendered = "true";
      diagram.classList.remove("is-error");
      resetMermaidView(diagram);
      window.requestAnimationFrame(() => {
        fitMermaid(diagram, false);
      });
    } catch {
      diagram.dataset.rendered = "error";
      diagram.classList.add("is-error");
    }
  }
}

function sizeMermaidSvg(canvas: HTMLElement) {
  const svg = canvas.querySelector<SVGSVGElement>("svg");
  const viewBox = svg?.getAttribute("viewBox");
  const width = Number(viewBox?.trim().split(/\s+/)[2]);
  if (!svg || !Number.isFinite(width) || width <= 0) {
    return;
  }

  svg.style.width = `${Math.max(Math.ceil(width), 520)}px`;
  svg.style.maxWidth = "none";
  svg.style.height = "auto";
  svg.setAttribute("aria-hidden", "true");
}

function enhanceMermaidInteractions() {
  root.value?.querySelectorAll<HTMLElement>("[data-mermaid]").forEach((diagram) => {
    if (diagram.dataset.interactive === "true") {
      updateMermaidControls(diagram);
      return;
    }

    diagram.dataset.interactive = "true";
    diagram.addEventListener("click", () => {
      pulseMermaidActive(diagram);
    });

    const canvas = diagram.querySelector<HTMLElement>("[data-mermaid-canvas]");
    canvas?.addEventListener("dblclick", () => {
      openMermaidDialog(diagram);
    });
    canvas?.addEventListener("pointerdown", (event) => {
      handleMermaidPointerDown(event, diagram);
    });
    canvas?.addEventListener(
      "wheel",
      (event) => {
        handleMermaidWheel(event, diagram);
      },
      { passive: false },
    );
    canvas?.addEventListener("keydown", (event) => {
      handleMermaidCanvasKeydown(event, diagram);
    });

    diagram.querySelectorAll<HTMLButtonElement>("[data-mermaid-action]").forEach((button) => {
      button.addEventListener("click", () => {
        handleMermaidAction(button.dataset.mermaidAction, diagram);
      });
    });

    updateMermaidControls(diagram);
  });
}

function handleMermaidAction(action: string | undefined, diagram: HTMLElement) {
  if (diagram.dataset.rendered !== "true" && action !== "copy") {
    return;
  }

  if (action === "zoom-out") {
    zoomMermaid(diagram, -mermaidZoomStep);
  } else if (action === "zoom-in") {
    zoomMermaid(diagram, mermaidZoomStep);
  } else if (action === "fit") {
    fitMermaid(diagram);
  } else if (action === "reset") {
    resetMermaidView(diagram);
  } else if (action === "open") {
    openMermaidDialog(diagram);
  }
}

function handleMermaidCanvasKeydown(event: KeyboardEvent, diagram: HTMLElement) {
  if (event.key === "Enter") {
    event.preventDefault();
    openMermaidDialog(diagram);
  } else if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    zoomMermaid(diagram, mermaidZoomStep);
  } else if (event.key === "-") {
    event.preventDefault();
    zoomMermaid(diagram, -mermaidZoomStep);
  } else if (event.key === "0") {
    event.preventDefault();
    resetMermaidView(diagram);
  }
}

function handleMermaidWheel(event: WheelEvent, diagram: HTMLElement) {
  if (!event.ctrlKey) {
    return;
  }

  event.preventDefault();
  const delta = event.deltaY > 0 ? -mermaidZoomStep : mermaidZoomStep;
  zoomMermaid(diagram, delta, event.clientX, event.clientY);
}

function handleMermaidPointerDown(event: PointerEvent, diagram: HTMLElement) {
  if (
    event.button !== 0 ||
    diagram.dataset.rendered !== "true" ||
    (event.target as HTMLElement | null)?.closest("button, a")
  ) {
    return;
  }

  const canvas = event.currentTarget as HTMLElement;
  const state = mermaidState(diagram);
  state.isDragging = true;
  state.pointerId = event.pointerId;
  state.startX = event.clientX;
  state.startY = event.clientY;
  state.startTranslateX = state.translateX;
  state.startTranslateY = state.translateY;
  state.moved = false;

  diagram.classList.add("is-dragging", "is-active");
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();

  const onMove = (moveEvent: PointerEvent) => {
    if (!state.isDragging || moveEvent.pointerId !== state.pointerId) {
      return;
    }

    const deltaX = moveEvent.clientX - state.startX;
    const deltaY = moveEvent.clientY - state.startY;
    state.translateX = state.startTranslateX + deltaX;
    state.translateY = state.startTranslateY + deltaY;
    state.moved ||= Math.abs(deltaX) + Math.abs(deltaY) > 2;
    applyMermaidTransform(diagram);
  };

  const endDrag = (endEvent: PointerEvent) => {
    if (endEvent.pointerId !== state.pointerId) {
      return;
    }

    state.isDragging = false;
    state.pointerId = undefined;
    diagram.classList.remove("is-dragging");
    canvas.releasePointerCapture(endEvent.pointerId);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", endDrag);
    canvas.removeEventListener("pointercancel", endDrag);
    window.setTimeout(
      () => {
        diagram.classList.remove("is-active");
      },
      state.moved ? 320 : 760,
    );
  };

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
}

function mermaidState(host: HTMLElement) {
  let state = mermaidStateByHost.get(host);
  if (!state) {
    state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0,
      moved: false,
    };
    mermaidStateByHost.set(host, state);
  }

  return state;
}

function zoomMermaid(host: HTMLElement, delta: number, clientX?: number, clientY?: number) {
  const state = mermaidState(host);
  const previousScale = state.scale;
  const nextScale = clampScale(previousScale + delta);
  if (nextScale === previousScale) {
    return;
  }

  const canvas = host.querySelector<HTMLElement>("[data-mermaid-canvas]");
  const pan = host.querySelector<HTMLElement>("[data-mermaid-pan]");
  if (canvas && pan && clientX !== undefined && clientY !== undefined) {
    const canvasRect = canvas.getBoundingClientRect();
    const originX = clientX - canvasRect.left - state.translateX;
    const originY = clientY - canvasRect.top - state.translateY;
    const ratio = nextScale / previousScale;
    state.translateX -= originX * (ratio - 1);
    state.translateY -= originY * (ratio - 1);
  }

  state.scale = nextScale;
  applyMermaidTransform(host);
  pulseMermaidActive(host);
}

function fitMermaid(host: HTMLElement, shouldPulse = true) {
  const canvas = host.querySelector<HTMLElement>("[data-mermaid-canvas]");
  const svg = host.querySelector<SVGSVGElement>("[data-mermaid-pan] svg");
  if (!canvas || !svg) {
    return;
  }

  const svgWidth = svg.getBoundingClientRect().width / mermaidState(host).scale;
  if (!Number.isFinite(svgWidth) || svgWidth <= 0) {
    return;
  }

  const availableWidth = Math.max(canvas.clientWidth - 32, 1);
  const state = mermaidState(host);
  state.scale = clampScale(Math.min(1, availableWidth / svgWidth));
  state.translateX = 0;
  state.translateY = 0;
  applyMermaidTransform(host);
  if (shouldPulse) {
    pulseMermaidActive(host);
  }
}

function resetMermaidView(host: HTMLElement) {
  const state = mermaidState(host);
  state.scale = 1;
  state.translateX = 0;
  state.translateY = 0;
  state.isDragging = false;
  state.pointerId = undefined;
  applyMermaidTransform(host);
}

function applyMermaidTransform(host: HTMLElement) {
  const state = mermaidState(host);
  const pan = host.querySelector<HTMLElement>("[data-mermaid-pan]");
  if (pan) {
    pan.style.transform = `translate3d(${state.translateX}px, ${state.translateY}px, 0) scale(${state.scale})`;
  }

  updateMermaidControls(host);
}

function updateMermaidControls(host: HTMLElement) {
  const state = mermaidState(host);
  const percentage = `${Math.round(state.scale * 100)}%`;
  const scale = host.querySelector<HTMLElement>("[data-mermaid-scale]");
  if (scale) {
    scale.textContent = percentage;
    scale.setAttribute(
      "aria-label",
      props.locale === "zh" ? `当前缩放 ${percentage}` : `Current zoom ${percentage}`,
    );
  }

  host
    .querySelectorAll<HTMLButtonElement>(
      '[data-mermaid-action="zoom-out"], [data-mermaid-action="zoom-in"], [data-mermaid-action="fit"], [data-mermaid-action="reset"], [data-mermaid-action="open"]',
    )
    .forEach((button) => {
      button.disabled = host.dataset.rendered !== "true";
    });

  const zoomOut = host.querySelector<HTMLButtonElement>('[data-mermaid-action="zoom-out"]');
  const zoomIn = host.querySelector<HTMLButtonElement>('[data-mermaid-action="zoom-in"]');
  if (zoomOut) {
    zoomOut.disabled = host.dataset.rendered !== "true" || state.scale <= mermaidMinScale;
  }
  if (zoomIn) {
    zoomIn.disabled = host.dataset.rendered !== "true" || state.scale >= mermaidMaxScale;
  }
}

function pulseMermaidActive(host: HTMLElement) {
  const state = mermaidState(host);
  host.classList.add("is-active");
  if (state.activeTimer) {
    window.clearTimeout(state.activeTimer);
  }

  state.activeTimer = window.setTimeout(() => {
    host.classList.remove("is-active");
    state.activeTimer = undefined;
  }, 1100);
}

function clampScale(value: number) {
  return Math.min(mermaidMaxScale, Math.max(mermaidMinScale, Number(value.toFixed(2))));
}

function openMermaidDialog(diagram: HTMLElement) {
  if (diagram.dataset.rendered !== "true") {
    return;
  }

  const source = diagram.querySelector<HTMLElement>("[data-mermaid-source]")?.textContent ?? "";
  const inlinePan = diagram.querySelector<HTMLElement>("[data-mermaid-pan]");
  const title = diagram.querySelector<HTMLElement>(".md-mermaid-title")?.textContent ?? "Mermaid";
  if (!inlinePan) {
    return;
  }

  closeMermaidDialog(false);
  activeMermaidDialogFocus =
    document.activeElement instanceof HTMLElement ? document.activeElement : undefined;

  const dialog = document.createElement("div");
  dialog.className = "md-mermaid-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", localeText("放大查看 Mermaid 图表", "Mermaid diagram viewer"));
  dialog.dataset.mermaid = "dialog";
  dialog.dataset.rendered = "true";

  const panel = document.createElement("div");
  panel.className = "md-mermaid-dialog-panel";

  const header = document.createElement("div");
  header.className = "md-mermaid-dialog-header";

  const heading = document.createElement("h2");
  heading.textContent = title;

  const scale = document.createElement("span");
  scale.className = "md-mermaid-scale";
  scale.dataset.mermaidScale = "";
  scale.textContent = "100%";

  const tools = document.createElement("div");
  tools.className = "md-mermaid-tools";
  tools.setAttribute("role", "toolbar");
  tools.setAttribute("aria-label", localeText("Mermaid 放大查看工具", "Mermaid viewer tools"));

  tools.append(
    createMermaidDialogButton("zoom-out", localeText("缩小", "Zoom out"), "-"),
    createMermaidDialogButton("zoom-in", localeText("放大", "Zoom in"), "+"),
    createMermaidDialogButton("fit", localeText("适应宽度", "Fit width"), "<>"),
    createMermaidDialogButton("reset", localeText("重置", "Reset"), "1:1"),
    createMermaidDialogButton("close", localeText("关闭", "Close"), "x"),
  );

  const canvas = document.createElement("div");
  canvas.className = "md-mermaid-canvas md-mermaid-dialog-canvas";
  canvas.dataset.mermaidCanvas = "";
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", title);
  canvas.innerHTML = inlinePan.outerHTML;

  const sourceNode = document.createElement("pre");
  sourceNode.className = "md-mermaid-source";
  sourceNode.dataset.mermaidSource = "";
  sourceNode.textContent = source;

  header.append(heading, scale, tools);
  panel.append(header, canvas, sourceNode);
  dialog.append(panel);
  document.body.append(dialog);

  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMermaidDialog();
    }
  };
  const overlayClickHandler = (event: MouseEvent) => {
    if (event.target === dialog) {
      closeMermaidDialog();
    }
  };
  const canvasKeydownHandler = (event: KeyboardEvent) => {
    handleMermaidCanvasKeydown(event, dialog);
  };
  const pointerDownHandler = (event: PointerEvent) => {
    handleMermaidPointerDown(event, dialog);
  };
  const wheelHandler = (event: WheelEvent) => {
    handleMermaidWheel(event, dialog);
  };

  document.addEventListener("keydown", keydownHandler);
  dialog.addEventListener("click", overlayClickHandler);
  canvas.addEventListener("keydown", canvasKeydownHandler);
  canvas.addEventListener("pointerdown", pointerDownHandler);
  canvas.addEventListener("wheel", wheelHandler, { passive: false });
  tools.querySelectorAll<HTMLButtonElement>("[data-mermaid-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mermaidAction;
      if (action === "close") {
        closeMermaidDialog();
      } else {
        handleMermaidAction(action, dialog);
      }
    });
  });

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  activeMermaidDialog = dialog;
  activeMermaidDialogCleanup = [
    () => document.removeEventListener("keydown", keydownHandler),
    () => dialog.removeEventListener("click", overlayClickHandler),
    () => canvas.removeEventListener("keydown", canvasKeydownHandler),
    () => canvas.removeEventListener("pointerdown", pointerDownHandler),
    () => canvas.removeEventListener("wheel", wheelHandler),
  ];

  sizeMermaidSvg(canvas);
  resetMermaidView(dialog);
  updateMermaidControls(dialog);
  window.setTimeout(() => {
    canvas.focus();
    fitMermaid(dialog);
  }, 0);
}

function createMermaidDialogButton(action: string, label: string, icon: string) {
  const button = document.createElement("button");
  button.className = "md-mermaid-tool";
  button.type = "button";
  button.dataset.mermaidAction = action;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);

  const iconNode = document.createElement("span");
  iconNode.className = "md-mermaid-tool-icon";
  iconNode.setAttribute("aria-hidden", "true");
  iconNode.textContent = icon;

  const text = document.createElement("span");
  text.className = "md-visually-hidden";
  text.textContent = label;

  button.append(iconNode, text);
  return button;
}

function closeMermaidDialog(restoreFocus = true) {
  if (!activeMermaidDialog) {
    return;
  }

  const dialog = activeMermaidDialog;
  activeMermaidDialogCleanup.forEach((cleanup) => cleanup());
  activeMermaidDialogCleanup = [];
  dialog.remove();
  mermaidStateByHost.delete(dialog);
  activeMermaidDialog = undefined;
  document.body.style.overflow = previousBodyOverflow;

  if (restoreFocus && activeMermaidDialogFocus?.isConnected) {
    activeMermaidDialogFocus.focus();
  }
  activeMermaidDialogFocus = undefined;
}

function localeText(zh: string, en: string) {
  return props.locale === "zh" ? zh : en;
}

async function loadMermaid() {
  mermaidRenderer ??= (await import("mermaid")).default;
  return mermaidRenderer;
}

function currentMermaidTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "base";
}

function mermaidThemeVariables() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();
  return {
    background: read("--surface"),
    primaryColor: read("--surface-raised"),
    primaryTextColor: read("--text"),
    primaryBorderColor: read("--border-strong"),
    lineColor: read("--accent"),
    secondaryColor: read("--surface-muted"),
    tertiaryColor: read("--accent-soft"),
    textColor: read("--text"),
    mainBkg: read("--surface-raised"),
    nodeBorder: read("--border-strong"),
    clusterBkg: read("--surface-muted"),
    clusterBorder: read("--border"),
    edgeLabelBackground: read("--surface"),
    fontFamily: read("--font-sans"),
  };
}

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function enhanceTabs() {
  root.value?.querySelectorAll<HTMLElement>('.md-tabs:not([data-ready="true"])').forEach((tabs) => {
    const panels = Array.from(tabs.querySelectorAll<HTMLElement>(":scope > .md-tab-panel"));
    if (panels.length === 0) {
      return;
    }

    const groupId = `md-tabs-${tabGroupCounter}`;
    tabGroupCounter += 1;
    const list = document.createElement("div");
    list.className = "md-tab-list";
    list.setAttribute("role", "tablist");

    function activateTab(activeIndex: number, shouldFocus = false) {
      const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>(".md-tab-button"));
      panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === activeIndex;
        panel.hidden = !isActive;
        buttons[panelIndex]?.setAttribute("aria-selected", isActive ? "true" : "false");
        buttons[panelIndex]?.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      if (shouldFocus) {
        buttons[activeIndex]?.focus();
      }
    }

    panels.forEach((panel, index) => {
      const tabId = `${groupId}-tab-${index}`;
      const panelId = `${groupId}-panel-${index}`;
      const button = document.createElement("button");
      button.type = "button";
      button.id = tabId;
      button.className = "md-tab-button";
      button.textContent = panel.dataset.tabTitle ?? `Tab ${index + 1}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panelId);
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");
      button.setAttribute("tabindex", index === 0 ? "0" : "-1");
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tabId);
      panel.hidden = index !== 0;
      button.addEventListener("click", () => {
        activateTab(index);
      });
      button.addEventListener("keydown", (event) => {
        const lastIndex = panels.length - 1;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          activateTab(index === lastIndex ? 0 : index + 1, true);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          activateTab(index === 0 ? lastIndex : index - 1, true);
        } else if (event.key === "Home") {
          event.preventDefault();
          activateTab(0, true);
        } else if (event.key === "End") {
          event.preventDefault();
          activateTab(lastIndex, true);
        }
      });
      list.append(button);
    });

    tabs.prepend(list);
    tabs.dataset.ready = "true";
  });
}
</script>
