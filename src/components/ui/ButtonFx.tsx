"use client";

import { useEffect } from "react";

const FX_SELECTOR = '[data-fx="primary"], [data-fx="secondary"]';

/**
 * Mounted once. Uses event delegation so every current and future
 * `[data-fx="primary" | "secondary"]` button gets a click ripple.
 * Respects reduced motion; the listener is removed on unmount.
 */
export function ButtonFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(FX_SELECTOR);
      if (!target || target.matches(":disabled")) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;
      const ripple = document.createElement("span");
      ripple.className = "fx-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
