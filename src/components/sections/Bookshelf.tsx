"use client";

import { useRef, type CSSProperties } from "react";
import { ArrowRight, Check, GraduationCap, Library, PencilRuler, type LucideIcon } from "lucide-react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

type ItemType = "spine" | "flat" | "cup" | "cover" | "box" | "tin";

interface ShelfItem {
  id: string;
  row: 0 | 1 | 2;
  type: ItemType;
  /** Position & size as % of the shelf row. */
  left: number;
  width: number;
  height: number;
  color: string;
  accent?: string;
  label?: string;
  /** Final resting rotation in degrees. */
  tilt?: number;
  dark?: boolean;
}

const ITEMS: ShelfItem[] = [
  // Row 0 — Course sets
  { id: "eng", row: 0, type: "spine", left: 5, width: 8, height: 80, color: "#0b4fd1", accent: "#fcc81f", label: "English" },
  { id: "math", row: 0, type: "spine", left: 13.5, width: 8.5, height: 86, color: "#f2b705", accent: "#0b2a66", label: "Maths", dark: true },
  { id: "sci", row: 0, type: "spine", left: 22.5, width: 7.5, height: 76, color: "#0f7a5c", accent: "#c9f2e2", label: "Science" },
  { id: "urdu", row: 0, type: "spine", left: 30.5, width: 8, height: 82, color: "#b4232c", accent: "#ffe0e0", label: "Urdu" },
  { id: "isl", row: 0, type: "spine", left: 39, width: 7, height: 72, color: "#0e7490", accent: "#cffafe", label: "Islamiat" },
  { id: "sst", row: 0, type: "spine", left: 46.5, width: 8, height: 84, color: "#5b2a86", accent: "#e9d8ff", label: "Social St." },
  { id: "comp", row: 0, type: "spine", left: 55, width: 7.5, height: 78, color: "#1e293b", accent: "#fcc81f", label: "Computer" },
  { id: "lean0", row: 0, type: "spine", left: 64.5, width: 7.5, height: 74, color: "#0a3fa8", accent: "#ffe68a", label: "Atlas", tilt: 14 },
  { id: "pack", row: 0, type: "box", left: 77, width: 19, height: 46, color: "#d9b88a", accent: "#0b4fd1", label: "Class 5 Pack" },

  // Row 1 — O / A Level
  { id: "phy", row: 1, type: "spine", left: 5, width: 9.5, height: 88, color: "#0e7490", accent: "#fcc81f", label: "Physics" },
  { id: "chem", row: 1, type: "spine", left: 15, width: 9, height: 82, color: "#7c2d12", accent: "#fed7aa", label: "Chemistry" },
  { id: "bio", row: 1, type: "spine", left: 24.5, width: 9.5, height: 90, color: "#15803d", accent: "#dcfce7", label: "Biology" },
  { id: "mathd", row: 1, type: "spine", left: 34.5, width: 9, height: 80, color: "#141823", accent: "#fcc81f", label: "Maths D" },
  { id: "engl", row: 1, type: "spine", left: 44, width: 8.5, height: 84, color: "#be123c", accent: "#ffe4e6", label: "English" },
  { id: "flat1", row: 1, type: "flat", left: 60, width: 34, height: 40, color: "#f2b705", accent: "#0b4fd1", label: "Past Papers" },

  // Row 2 — Stationery & early readers
  { id: "cup", row: 2, type: "cup", left: 5, width: 13, height: 62, color: "#0b4fd1", accent: "#fcc81f" },
  { id: "cov1", row: 2, type: "cover", left: 21, width: 15, height: 70, color: "#f97316", accent: "#fff7ed", label: "Phonics", tilt: -4 },
  { id: "cov2", row: 2, type: "cover", left: 36.5, width: 14, height: 64, color: "#9333ea", accent: "#faf5ff", label: "Stories" },
  { id: "tin", row: 2, type: "tin", left: 54, width: 18, height: 20, color: "#0b4fd1", accent: "#fcc81f" },
  { id: "notes", row: 2, type: "flat", left: 74, width: 21, height: 34, color: "#0891b2", accent: "#ffffff", label: "Notebooks" },
];

const ROWS = [
  { label: "Course Sets" },
  { label: "O / A Level" },
  { label: "Stationery & Readers" },
] as const;

interface Callout {
  icon: LucideIcon;
  title: string;
  text: string;
}

const CALLOUTS: Callout[] = [
  { icon: Library, title: "Course Sets", text: "Class-wise packs from Playgroup to Class 8, packed to each school’s official list." },
  { icon: GraduationCap, title: "Academic Levels", text: "O & A Level textbooks, topical past papers and revision guides." },
  { icon: PencilRuler, title: "Stationery & Readers", text: "Geometry boxes, notebooks and early readers to complete the shelf." },
];

export function Bookshelf() {
  const rootRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>(".shelf-item");
        const callouts = gsap.utils.toArray<HTMLElement>(".shelf-callout");
        const plaques = gsap.utils.toArray<HTMLElement>(".shelf-plaque");
        const total = items.length;

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const filled = Math.min(total, Math.floor(self.progress * 1.08 * total));
              if (countRef.current) countRef.current.textContent = String(filled);
              if (barRef.current) barRef.current.style.transform = `scaleX(${filled / total})`;
            },
          },
        });

        let cursor = 0;
        ([0, 1, 2] as const).forEach((row) => {
          const rowItems = items.filter((el) => el.dataset.row === String(row));
          const fromSide = row === 1 ? 1 : -1;

          tl.fromTo(callouts[row], { opacity: 0.4, x: -10 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, cursor);
          tl.fromTo(
            callouts[row].querySelector(".callout-check"),
            { scale: 0.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" },
            cursor + rowItems.length * 0.55,
          );
          tl.fromTo(plaques[row], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5 }, cursor + 0.2);

          rowItems.forEach((el, i) => {
            const tilt = Number(el.dataset.tilt ?? 0);
            tl.fromTo(
              el,
              {
                x: () => fromSide * window.innerWidth * 0.65,
                y: -60,
                rotation: fromSide * -22,
                autoAlpha: 0,
              },
              { x: 0, y: 0, rotation: tilt, autoAlpha: 1, duration: 1 },
              cursor + i * 0.55,
            );
          });
          cursor += rowItems.length * 0.55 + 0.9;
        });

        tl.fromTo(".shelf-cta", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, cursor - 0.3);
        // Small hold at the end so the finished shelf rests before the section releases.
        tl.to({}, { duration: 0.8 });
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set([".shelf-callout", ".shelf-plaque", ".shelf-cta", ".callout-check"], {
          opacity: 1,
          autoAlpha: 1,
          x: 0,
          scale: 1,
        });
        gsap.set(".shelf-item", { autoAlpha: 1, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.tilt ?? 0) });
        if (countRef.current) countRef.current.textContent = String(ITEMS.length);
        if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="shelf-title"
      className="relative h-[300vh] bg-surface motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        {/* soft backdrop geometry */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-surface-2/70 to-transparent" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-4 pt-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8 lg:pt-12">
          <div className="lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Build your study shelf</p>
            <h2 id="shelf-title" className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-4xl">
              Everything for the year, <span className="text-brand-600">one shelf at a time.</span>
            </h2>
            <p className="mt-3 hidden max-w-md text-base text-ink-soft sm:block">
              Scroll to stock the shelf — the same way we pack your order: complete, labelled and checked against the
              school list.
            </p>

            <div className="mt-4 flex items-center gap-3 sm:mt-6">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
                <div
                  ref={barRef}
                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-brand-600 to-gold-500"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <p className="text-sm font-medium tabular-nums text-muted">
                <span ref={countRef} className="font-bold text-ink">
                  0
                </span>{" "}
                / {ITEMS.length} on the shelf
              </p>
            </div>

            <ol className="mt-4 grid grid-cols-3 gap-2 sm:mt-8 lg:grid-cols-1 lg:gap-3">
              {CALLOUTS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="shelf-callout relative flex flex-col gap-2 rounded-2xl border border-line bg-white/80 p-3 opacity-40 shadow-soft lg:flex-row lg:items-start lg:gap-4 lg:p-4 motion-reduce:opacity-100"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 lg:size-10">
                    <Icon className="size-4 lg:size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-ink sm:text-sm lg:text-base">{title}</span>
                    <span className="mt-0.5 hidden text-sm text-ink-soft lg:block">{text}</span>
                  </span>
                  <span className="callout-check invisible absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-gold-400 text-brand-950 lg:right-4 lg:top-4">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ol>

            <a
              href="#books"
              className="shelf-cta invisible mt-6 hidden items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800 lg:inline-flex"
            >
              Shop the full book list <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="lg:order-2">
            <Shelf />
          </div>
        </div>
      </div>
    </section>
  );
}

const WOOD = "linear-gradient(180deg,#c99566 0%,#b07c4c 55%,#946238 100%)";

function Shelf() {
  return (
    <div
      className="relative mx-auto aspect-[6/5] w-full"
      style={{ maxWidth: "min(36rem, calc((100svh - 22rem) * 1.2), 100%)", minWidth: "min(18rem, 100%)" } as CSSProperties}
      role="img"
      aria-label="A wooden bookshelf being filled with course books, O and A Level books, stationery and early readers"
    >
      {/* Outer frame */}
      <div className="absolute inset-0 rounded-[1.4rem] p-[3.2%] shadow-lift" style={{ background: WOOD }}>
        {/* Back panel with soft grain */}
        <div
          className="relative flex size-full flex-col overflow-hidden rounded-[0.8rem]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(150,105,60,0.05) 0 2px, transparent 2px 38px), linear-gradient(180deg,#f6ead7,#efdfc6)",
            boxShadow: "inset 0 10px 24px -12px rgba(80,50,20,0.35), inset 0 -4px 12px -8px rgba(80,50,20,0.25)",
          }}
        >
          {ROWS.map((row, r) => (
            <div key={row.label} className="relative flex-1">
              {/* Books in this row */}
              <div className="absolute inset-x-[2%] bottom-[14px] top-[8%]">
                {ITEMS.filter((it) => it.row === r).map((it) => (
                  <ShelfThing key={it.id} item={it} />
                ))}
              </div>
              {/* Board */}
              <div
                className="absolute inset-x-0 bottom-0 h-[14px]"
                style={{ background: WOOD, boxShadow: "0 6px 10px -4px rgba(60,35,10,0.45)" }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
                <span className="shelf-plaque absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-gold-300 px-1.5 text-[7px] font-extrabold uppercase leading-[10px] tracking-[0.14em] text-brand-950 sm:text-[8px]">
                  {row.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Feet */}
      <div className="absolute -bottom-2 left-[6%] h-3 w-[8%] rounded-b-md" style={{ background: "#8a5a32" }} />
      <div className="absolute -bottom-2 right-[6%] h-3 w-[8%] rounded-b-md" style={{ background: "#8a5a32" }} />
    </div>
  );
}

function ShelfThing({ item }: { item: ShelfItem }) {
  const style: CSSProperties = {
    left: `${item.left}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    transformOrigin: "bottom center",
  };
  const common = "shelf-item absolute bottom-0 invisible motion-reduce:visible";
  const data = { "data-row": item.row, "data-tilt": item.tilt ?? 0 };

  switch (item.type) {
    case "spine":
      return (
        <div
          {...data}
          className={`${common} overflow-hidden rounded-[3px] shadow-[inset_-3px_0_0_rgba(0,0,0,0.18),inset_2px_0_0_rgba(255,255,255,0.18),2px_2px_4px_rgba(0,0,0,0.12)]`}
          style={{ ...style, backgroundColor: item.color, transformOrigin: item.tilt ? "bottom left" : "bottom center" }}
        >
          <span className="absolute inset-x-0 top-[9%] h-[5%] min-h-[3px]" style={{ backgroundColor: item.accent }} />
          <span className="absolute inset-x-0 bottom-[10%] h-[4%] min-h-[2px]" style={{ backgroundColor: item.accent }} />
          <span
            className={`absolute inset-0 grid place-items-center text-[7px] font-bold uppercase tracking-[0.12em] sm:text-[9px] ${
              item.dark ? "text-brand-950/80" : "text-white/85"
            }`}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {item.label}
          </span>
        </div>
      );
    case "flat":
      return (
        <div {...data} className={`${common} flex flex-col justify-end gap-[3%]`} style={style}>
          {[0.92, 1, 0.96].map((w, i) => (
            <span
              key={i}
              className="relative block h-[30%] rounded-[3px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15),1px_2px_3px_rgba(0,0,0,0.12)]"
              style={{
                width: `${w * 100}%`,
                marginLeft: i === 1 ? "0" : "4%",
                backgroundColor: i === 1 ? item.accent : item.color,
                outline: i === 1 ? `1px solid ${item.color}` : undefined,
              }}
            >
              {i === 2 ? (
                <span className="absolute inset-0 grid place-items-center text-[6px] font-bold uppercase tracking-wider text-brand-950/80 sm:text-[8px]">
                  {item.label}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      );
    case "cover":
      return (
        <div
          {...data}
          className={`${common} overflow-hidden rounded-[4px] shadow-[3px_3px_6px_rgba(0,0,0,0.18)]`}
          style={{ ...style, backgroundColor: item.color }}
        >
          <span className="absolute inset-y-0 left-0 w-[10%] bg-black/15" />
          <span className="absolute left-1/2 top-[22%] grid aspect-square w-[46%] -translate-x-1/2 place-items-center rounded-full" style={{ backgroundColor: item.accent }}>
            <svg viewBox="0 0 24 24" className="w-[60%]" aria-hidden="true">
              <path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17l-6 3.3 1.3-6.7-5-4.6 6.8-.8z" fill={item.color} />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-[12%] text-center text-[7px] font-extrabold uppercase tracking-wider text-white sm:text-[9px]">
            {item.label}
          </span>
        </div>
      );
    case "box":
      return (
        <div
          {...data}
          className={`${common} rounded-[4px] shadow-[3px_3px_8px_rgba(0,0,0,0.18)]`}
          style={{ ...style, backgroundColor: item.color }}
        >
          <span className="absolute inset-x-0 top-0 h-[16%] rounded-t-[4px] bg-black/10" />
          <span className="absolute inset-y-0 left-1/2 w-[14%] -translate-x-1/2" style={{ backgroundColor: item.accent, opacity: 0.85 }} />
          <span className="absolute inset-x-[8%] bottom-[14%] rounded-sm bg-white/90 px-0.5 py-0.5 text-center text-[6px] font-bold uppercase leading-tight text-brand-900 sm:text-[8px]">
            {item.label}
          </span>
        </div>
      );
    case "tin":
      return (
        <div
          {...data}
          className={`${common} rounded-[5px] shadow-[2px_3px_6px_rgba(0,0,0,0.2)]`}
          style={{ ...style, backgroundColor: item.color }}
        >
          <span className="absolute inset-x-[6%] top-[18%] h-[22%] rounded-sm" style={{ backgroundColor: item.accent }} />
          <svg viewBox="0 0 40 10" className="absolute inset-x-[10%] bottom-[14%] w-[80%]" aria-hidden="true">
            <path d="M2 8 L38 8 M8 8 V4 M14 8 V5 M20 8 V3 M26 8 V5 M32 8 V4" stroke="white" strokeWidth="1.4" opacity="0.8" />
          </svg>
        </div>
      );
    case "cup":
      return (
        <div {...data} className={common} style={style}>
          <svg viewBox="0 0 40 60" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <rect x="11" y="2" width="4" height="34" rx="1" fill="#fcc81f" transform="rotate(-10 13 36)" />
            <path d="M11.4 1.6 L13 -2 L14.6 1.6Z" fill="#141823" transform="rotate(-10 13 36)" />
            <rect x="19" y="6" width="4" height="30" rx="1" fill="#ef4444" />
            <rect x="26" y="0" width="3" height="36" rx="1" fill="#0b2a66" transform="rotate(9 27 36)" />
            <rect x="15" y="10" width="2" height="26" fill="#94a3b8" transform="rotate(4 16 36)" />
            <path d="M6 26 H34 L31 58 H9 Z" fill={item.color} />
            <rect x="6" y="26" width="28" height="4" fill="rgba(255,255,255,0.25)" />
            <rect x="12" y="38" width="16" height="8" rx="1.5" fill={item.accent} />
          </svg>
        </div>
      );
  }
}
