<template>
  <div ref="aura" class="pointer-aura" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const aura = ref<HTMLElement>();

let finePointerQuery: MediaQueryList | undefined;
let reducedMotionQuery: MediaQueryList | undefined;
let enabled = false;
let visible = false;
let hasPosition = false;
let frame = 0;
let hideTimer: number | undefined;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

onMounted(() => {
  finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  syncEnabled();
  finePointerQuery.addEventListener("change", syncEnabled);
  reducedMotionQuery.addEventListener("change", syncEnabled);
});

onBeforeUnmount(() => {
  finePointerQuery?.removeEventListener("change", syncEnabled);
  reducedMotionQuery?.removeEventListener("change", syncEnabled);
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", hideAura);
  window.removeEventListener("blur", hideAura);
  cancelFrame();
  clearHideTimer();
});

function syncEnabled() {
  const shouldEnable = Boolean(finePointerQuery?.matches && !reducedMotionQuery?.matches);
  if (shouldEnable === enabled) {
    return;
  }

  enabled = shouldEnable;
  if (enabled) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", hideAura);
    window.addEventListener("blur", hideAura);
    return;
  }

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", hideAura);
  window.removeEventListener("blur", hideAura);
  hideAura();
  cancelFrame();
  clearHideTimer();
  hasPosition = false;
}

function handlePointerMove(event: PointerEvent) {
  if (!enabled) {
    return;
  }

  if (event.pointerType && event.pointerType !== "mouse") {
    hideAura();
    return;
  }

  targetX = event.clientX;
  targetY = event.clientY;

  if (isReadingTarget(event.target)) {
    hideAura();
    return;
  }

  if (!hasPosition) {
    currentX = targetX;
    currentY = targetY;
    hasPosition = true;
    moveAura();
  }

  showAura();
  scheduleMove();
}

function showAura() {
  clearHideTimer();
  if (visible) {
    return;
  }

  visible = true;
  const element = aura.value;
  element?.classList.add("is-mounted");
  window.requestAnimationFrame(() => {
    if (visible) {
      element?.classList.add("is-visible");
    }
  });
}

function hideAura() {
  if (!visible && !aura.value?.classList.contains("is-mounted")) {
    return;
  }

  visible = false;
  aura.value?.classList.remove("is-visible");
  clearHideTimer();
  hideTimer = window.setTimeout(() => {
    if (!visible) {
      aura.value?.classList.remove("is-mounted");
    }
    hideTimer = undefined;
  }, 240);
}

function isReadingTarget(target: EventTarget | null) {
  return target instanceof Element
    ? Boolean(target.closest(".reading-column, .markdown-body"))
    : false;
}

function scheduleMove() {
  if (!frame) {
    frame = window.requestAnimationFrame(animate);
  }
}

function animate() {
  frame = 0;
  currentX += (targetX - currentX) * 0.18;
  currentY += (targetY - currentY) * 0.18;
  moveAura();

  if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
    scheduleMove();
  }
}

function moveAura() {
  const element = aura.value;
  if (!element) {
    return;
  }

  element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
}

function cancelFrame() {
  if (!frame) {
    return;
  }

  window.cancelAnimationFrame(frame);
  frame = 0;
}

function clearHideTimer() {
  if (hideTimer === undefined) {
    return;
  }

  window.clearTimeout(hideTimer);
  hideTimer = undefined;
}
</script>
