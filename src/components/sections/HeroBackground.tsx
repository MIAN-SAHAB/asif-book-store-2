"use client";

import { useEffect, useRef } from "react";

const SPACING = 26;
const BASE_RADIUS = 1.5;
const BASE_ALPHA = 0.28;
const POINTER_RADIUS = 150;
const POINTER_PUSH = 7;
const GLOW_SPAWN_MS = 110;
const MAX_GLOWS = 34;

const BLUE = "11, 79, 209";
const GOLD = "242, 183, 5";

interface Glow {
  index: number;
  start: number;
  duration: number;
  rgb: string;
  size: number;
}

/**
 * Interactive dot field for the hero:
 * - a visible grid of brand-blue points
 * - random points softly glow gold / blue and fade out
 * - points near the cursor brighten and drift away, with a warm spotlight following the pointer
 * Pauses when off-screen or the tab is hidden; static grid for reduced-motion users.
 */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;
    let glows: Glow[] = [];
    let lastSpawn = 0;
    let raf = 0;
    let visible = true;

    // Pointer position (target + smoothed), relative to the canvas.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, target: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;
      offsetX = (width - (cols - 1) * SPACING) / 2;
      offsetY = (height - (rows - 1) * SPACING) / 2;
      glows = glows.filter((g) => g.index < cols * rows);
      if (reduceMotion) draw(performance.now());
    };

    const spawnGlow = (now: number) => {
      if (glows.length >= MAX_GLOWS) return;
      glows.push({
        index: Math.floor(Math.random() * cols * rows),
        start: now,
        duration: 1400 + Math.random() * 1800,
        rgb: Math.random() < 0.6 ? GOLD : BLUE,
        size: 8 + Math.random() * 8,
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Ease the pointer for a soft, trailing feel.
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      pointer.strength += (pointer.target - pointer.strength) * 0.08;

      if (pointer.strength > 0.01) {
        const spot = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, POINTER_RADIUS * 1.6);
        spot.addColorStop(0, `rgba(${GOLD}, ${0.16 * pointer.strength})`);
        spot.addColorStop(1, `rgba(${GOLD}, 0)`);
        ctx.fillStyle = spot;
        ctx.fillRect(pointer.x - POINTER_RADIUS * 1.6, pointer.y - POINTER_RADIUS * 1.6, POINTER_RADIUS * 3.2, POINTER_RADIUS * 3.2);
      }

      // Grid points
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let x = offsetX + c * SPACING;
          let y = offsetY + r * SPACING;
          let radius = BASE_RADIUS;
          let alpha = BASE_ALPHA;

          if (pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < POINTER_RADIUS) {
              const f = (1 - dist / POINTER_RADIUS) ** 2 * pointer.strength;
              const push = (POINTER_PUSH * f) / (dist || 1);
              x += dx * push;
              y += dy * push;
              radius += 1.3 * f;
              alpha += 0.55 * f;
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${BLUE}, ${alpha})`;
          ctx.fill();
        }
      }

      // Random glowing points
      glows = glows.filter((g) => now - g.start < g.duration);
      for (const g of glows) {
        const t = (now - g.start) / g.duration;
        const intensity = Math.sin(Math.PI * t);
        const c = g.index % cols;
        const r = Math.floor(g.index / cols);
        const x = offsetX + c * SPACING;
        const y = offsetY + r * SPACING;

        const halo = ctx.createRadialGradient(x, y, 0, x, y, g.size * 1.6);
        halo.addColorStop(0, `rgba(${g.rgb}, ${0.55 * intensity})`);
        halo.addColorStop(1, `rgba(${g.rgb}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, g.size * 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, BASE_RADIUS + 1.6 * intensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${g.rgb}, ${0.35 + 0.65 * intensity})`;
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      if (now - lastSpawn > GLOW_SPAWN_MS) {
        spawnGlow(now);
        lastSpawn = now;
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.tx = x;
      pointer.ty = y;
      if (inside && pointer.target === 0) {
        // Snap on entry so the spotlight doesn't sweep in from far away.
        pointer.x = x;
        pointer.y = y;
      }
      pointer.target = inside && e.pointerType === "mouse" ? 1 : 0;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    resize();
    start();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_120%_90%_at_50%_30%,black_45%,transparent_100%)]"
    />
  );
}
