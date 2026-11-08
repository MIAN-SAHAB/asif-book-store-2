"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

const LOGO_SRC = "/assets/images/logo.jpeg";
const MIN_VISIBLE_MS = 700;
const SAFETY_TIMEOUT_MS = 8000;

function waitForWindowLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForFonts(): Promise<void> {
  return document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
}

function waitForImage(img: HTMLImageElement | null): Promise<void> {
  return new Promise((resolve) => {
    if (!img || (img.complete && img.naturalWidth > 0)) return resolve();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * Asset-aware preloader: progress advances as the window load event, web fonts and the logo
 * image actually resolve, then the overlay slides away and the page is marked ready.
 */
export function Preloader() {
  const { markReady } = useStore();
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useScrollLock(!done);

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = { value: 0 };
      let cancelled = false;

      const render = () => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress.value / 100})`;
        if (labelRef.current) labelRef.current.textContent = `${Math.round(progress.value)}%`;
      };

      gsap.from(".preloader-mark", { autoAlpha: 0, scale: 0.92, duration: reduce ? 0 : 0.7, ease: "power3.out" });

      const tasks = [waitForWindowLoad(), waitForFonts(), waitForImage(logoRef.current)];
      let completed = 0;
      const advance = contextSafe(() => {
        completed += 1;
        // Hold the last 8% for the exit so the bar never sits at 100% while waiting.
        gsap.to(progress, {
          value: (completed / tasks.length) * 92,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: render,
          overwrite: true,
        });
      });
      tasks.forEach((task) => task.then(advance));

      const finish = contextSafe(() => {
        if (cancelled) return;
        cancelled = true;
        gsap
          .timeline({
            onComplete: () => {
              setDone(true);
              markReady();
              requestAnimationFrame(() => ScrollTrigger.refresh());
            },
          })
          .to(progress, { value: 100, duration: reduce ? 0 : 0.35, ease: "power1.out", onUpdate: render, overwrite: true })
          .to(".preloader-mark", { autoAlpha: 0, y: -12, duration: reduce ? 0 : 0.35, ease: "power2.in" }, "+=0.1")
          .to(rootRef.current, { yPercent: reduce ? 0 : -100, autoAlpha: reduce ? 0 : 1, duration: reduce ? 0.2 : 0.75, ease: "power3.inOut" }, "-=0.1");
      });

      const minTime = new Promise<void>((r) => setTimeout(r, reduce ? 0 : MIN_VISIBLE_MS));
      const safety = new Promise<void>((r) => setTimeout(r, SAFETY_TIMEOUT_MS));
      Promise.race([Promise.all([...tasks, minTime]), safety]).then(finish);

      return () => {
        cancelled = true;
      };
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-cream"
      role="status"
      aria-live="polite"
      aria-label="Loading Asif Book Store"
    >
      <div className="preloader-mark flex w-56 flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-[1.75rem] bg-gold-200/50 blur-xl" aria-hidden="true" />
          <Image
            ref={logoRef}
            src={LOGO_SRC}
            alt="Asif Book Store logo"
            width={112}
            height={112}
            preload
            className="relative size-28 rounded-3xl object-cover shadow-lift"
          />
        </div>
        <p className="mt-6 font-heading text-lg font-bold tracking-tight text-brand-900">Asif Book Store</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">Books · Uniforms</p>
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            ref={barRef}
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-brand-600 to-gold-500"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <span ref={labelRef} className="mt-2 text-xs tabular-nums text-muted">
          0%
        </span>
      </div>
    </div>
  );
}
