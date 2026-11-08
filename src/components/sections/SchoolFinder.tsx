"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpen, Check, Plus, Shirt } from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import { SchoolMark } from "@/components/ui/SchoolMark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SizePills } from "@/components/ui/SizePills";
import { useStore } from "@/context/StoreContext";
import { useReveal } from "@/hooks/useReveal";
import {
  BOOKS,
  GRADES,
  SCHOOLS,
  STAGE_LABEL,
  UNIFORMS,
  UNIFORM_KIND_LABEL,
  formatPrice,
  getCourseBundle,
  schoolById,
} from "@/lib/data";
import type { GradeId, SchoolId, Stage, UniformProduct } from "@/lib/types";

const STAGES: Stage[] = ["early", "primary", "middle", "senior"];

export function SchoolFinder() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);
  const { addToCart, setSchoolFilter } = useStore();
  const [schoolId, setSchoolId] = useState<SchoolId>("city-school");
  const [gradeId, setGradeId] = useState<GradeId>("c1");

  const school = schoolById(schoolId);
  const bundle = useMemo(() => getCourseBundle(schoolId, gradeId), [schoolId, gradeId]);
  const uniforms = useMemo(
    () => UNIFORMS.filter((u) => u.schools.includes(schoolId) && u.stages.includes(bundle.grade.stage)),
    [schoolId, bundle.grade.stage],
  );
  const extraBooks = useMemo(
    () => BOOKS.filter((b) => b.grades.includes(gradeId) && (b.schools.length === 0 || b.schools.includes(schoolId))),
    [schoolId, gradeId],
  );

  const viewInCatalog = (anchor: "#books" | "#uniforms") => {
    setSchoolFilter(schoolId);
    document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="schools" ref={rootRef} className="relative border-y border-line/70 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="School Kit Finder"
          title="Your child’s official kit, in two clicks"
          description="Choose the school, then the class. We’ll show the prescribed course pack and the matching uniform pieces."
        />

        {/* Step 1 — Authorized schools bar */}
        <div data-reveal className="mt-10">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="grid size-6 place-items-center rounded-full bg-brand-600 text-xs text-white">1</span>
            Select school
          </p>
          <div
            role="radiogroup"
            aria-label="School"
            className="no-scrollbar -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6"
          >
            {SCHOOLS.map((s) => {
              const selected = s.id === schoolId;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSchoolId(s.id)}
                  className={`relative flex min-w-[11.5rem] snap-start items-center gap-3 rounded-2xl border p-3 text-left transition sm:min-w-0 ${
                    selected
                      ? "border-brand-500 bg-brand-50/70 ring-4 ring-brand-100"
                      : "border-line bg-cream hover:border-brand-200 hover:bg-white"
                  }`}
                >
                  <SchoolMark school={s} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{s.short}</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
                      {s.featured ? (
                        <>
                          <BadgeCheck className="size-3 text-gold-600" aria-hidden="true" /> Authorized dealer
                        </>
                      ) : (
                        "Official supplier"
                      )}
                    </span>
                  </span>
                  {selected ? (
                    <Check className="absolute right-2.5 top-2.5 size-4 text-brand-600" strokeWidth={3} aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — Grade */}
        <div data-reveal className="mt-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="grid size-6 place-items-center rounded-full bg-brand-600 text-xs text-white">2</span>
            Select class
          </p>
          <div role="radiogroup" aria-label="Class" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((stage) => (
              <div key={stage} className="rounded-2xl border border-line bg-cream p-3">
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted">{STAGE_LABEL[stage]}</p>
                <div className="flex flex-wrap gap-1.5">
                  {GRADES.filter((g) => g.stage === stage).map((g) => {
                    const selected = g.id === gradeId;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setGradeId(g.id)}
                        className={`h-9 rounded-xl px-3 text-sm font-medium transition ${
                          selected
                            ? "bg-brand-600 text-white shadow-[0_8px_18px_-10px_rgba(11,79,209,0.9)]"
                            : "bg-white text-ink-soft ring-1 ring-line hover:text-brand-700 hover:ring-brand-200"
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div key={`${schoolId}-${gradeId}`} className="mt-10 grid animate-fade-up grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" aria-live="polite">
          <article className="relative overflow-hidden rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full border border-white/10" />
            <div aria-hidden="true" className="absolute -right-4 -top-4 size-40 rounded-full border border-white/10" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="grid size-28 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <ProductArt kind="bundle" tone={school.color === "#0b4fd1" ? "#3b7bff" : school.color} accent="#fcc81f" className="size-24" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-950">
                  <BookOpen className="size-3.5" aria-hidden="true" /> Official course pack
                </p>
                <h3 className="mt-3 text-2xl font-bold">{bundle.name}</h3>
                <p className="mt-1 text-sm text-white/70">
                  {school.name} · {bundle.grade.label} · {bundle.subjects.length} subjects
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {bundle.subjects.map((s) => (
                    <li key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/90">
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <p className="font-heading text-2xl font-extrabold">{formatPrice(bundle.price)}</p>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        productId: bundle.id,
                        name: bundle.name,
                        price: bundle.price,
                        kind: "bundle",
                        tone: school.color,
                        accent: "#fcc81f",
                        meta: `${bundle.subjects.length} subjects`,
                      })
                    }
                    data-fx="primary"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-900 transition hover:bg-gold-100"
                  >
                    <Plus className="size-4" aria-hidden="true" /> Add course pack
                  </button>
                </div>
                {extraBooks.length ? (
                  <p className="mt-5 text-sm text-white/70">
                    + {extraBooks.length} recommended {extraBooks.length === 1 ? "title" : "titles"} for {bundle.grade.label}.{" "}
                    <button
                      type="button"
                      onClick={() => viewInCatalog("#books")}
                      className="font-semibold text-gold-300 underline-offset-4 hover:underline"
                    >
                      View books
                    </button>
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-line bg-cream p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                <Shirt className="size-5 text-brand-600" aria-hidden="true" /> Matching uniform
              </h3>
              <button
                type="button"
                onClick={() => viewInCatalog("#uniforms")}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
                aria-label={`See all ${school.short} uniform items`}
              >
                See all <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
            {uniforms.length ? (
              <ul className="mt-4 flex flex-col gap-2.5">
                {uniforms.map((u) => (
                  <UniformRow key={u.id} item={u} />
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                No uniform pieces listed for {school.short} {STAGE_LABEL[bundle.grade.stage]} yet — visit the store and
                we&apos;ll order them in for you.
              </p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function UniformRow({ item }: { item: UniformProduct }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState<string | null>(null);
  return (
    <li className="rounded-2xl bg-white p-3 ring-1 ring-line">
      <div className="flex items-center gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: `color-mix(in srgb, ${item.accent ?? item.tone} 10%, white)` }}
        >
          <ProductArt kind={item.kind} tone={item.tone} accent={item.accent} className="size-10" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
          <p className="text-xs text-muted">
            {UNIFORM_KIND_LABEL[item.kind]} · {formatPrice(item.price)}
          </p>
        </div>
        <button
          type="button"
          disabled={!size}
          onClick={() =>
            size &&
            addToCart({
              productId: item.id,
              name: item.name,
              price: item.price,
              size,
              kind: item.kind,
              tone: item.tone,
              accent: item.accent,
            })
          }
          data-fx="primary"
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-brand-600 px-3.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
          title={size ? undefined : "Select a size first"}
        >
          <Plus className="size-3.5" aria-hidden="true" /> {size ? "Add" : "Size?"}
        </button>
      </div>
      <div className="mt-2.5 pl-[3.75rem]">
        <SizePills sizes={item.sizes} value={size} onChange={setSize} label={`Size for ${item.name}`} compact />
      </div>
    </li>
  );
}
