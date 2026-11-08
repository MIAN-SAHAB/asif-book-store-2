"use client";

import { useEffect } from "react";

let locks = 0;

/** Locks page scroll while `active` is true. Nested locks are reference-counted. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const root = document.documentElement;
    // Compensate for a classic (space-taking) scrollbar only; touch devices use overlay scrollbars.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scrollbar = finePointer ? Math.min(24, window.innerWidth - root.clientWidth) : 0;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    return () => {
      locks -= 1;
      if (locks === 0) {
        root.style.overflow = "";
        root.style.paddingRight = "";
      }
    };
  }, [active]);
}
