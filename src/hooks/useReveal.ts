"use client";

import type { RefObject } from "react";
import { FULL_MOTION, REDUCED_MOTION, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * Gentle fade-up for every static `[data-reveal]` element inside `scope`.
 * Elements entering together are staggered. All triggers are reverted on unmount by useGSAP.
 * Only use `data-reveal` on elements that are rendered once (not on filtered lists).
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (!targets.length) return;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        gsap.set(targets, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(targets, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      });
    },
    { scope },
  );
}
