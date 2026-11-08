"use client";

import { useRef, useState } from "react";
import { Plus, Ruler } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { ProductArt } from "@/components/ui/ProductArt";
import { SchoolBadge, SchoolMark } from "@/components/ui/SchoolMark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SizePills } from "@/components/ui/SizePills";
import { useStore } from "@/context/StoreContext";
import { useReveal } from "@/hooks/useReveal";
import { SCHOOLS, UNIFORMS, UNIFORM_KIND_LABEL, formatPrice, schoolById, type SizeGuideTab } from "@/lib/data";
import type { SchoolId, UniformKind, UniformProduct } from "@/lib/types";

type KindFilter = UniformKind | "all";
const KINDS: KindFilter[] = ["all", "shirt", "trousers", "blazer", "sash", "tie", "pe-kit"];

const guideTabFor = (kind: UniformKind): SizeGuideTab =>
  kind === "trousers" ? "trousers" : kind === "pe-kit" ? "pe" : "shirts";

export function UniformsCatalog() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);
  const { schoolFilter, setSchoolFilter, openSizeGuide, focusedProductId } = useStore();
  const [kind, setKind] = useState<KindFilter>("all");

  const bySchool = UNIFORMS.filter((u) => schoolFilter === "all" || u.schools.includes(schoolFilter));
  const visible = UNIFORMS.filter(
    (u) => (bySchool.includes(u) && (kind === "all" || u.kind === kind)) || u.id === focusedProductId,
  );

  return (
    <section id="uniforms" ref={rootRef} className="border-t border-line/70 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Official Uniforms"
          title="Authentic uniforms, the right fit"
          description="Genuine school-approved fabrics and crests. Not sure about size? Check the guide — exchanges are free."
          action={
            <button
              type="button"
              onClick={() => openSizeGuide("shirts")}
              data-fx="secondary"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-cream px-5 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700"
            >
              <Ruler className="size-4" aria-hidden="true" /> Size guide
            </button>
          }
        />

        <div data-reveal className="mt-10 space-y-3">
          <div
            role="radiogroup"
            aria-label="School"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <SchoolChip selected={schoolFilter === "all"} onClick={() => setSchoolFilter("all")} label="All schools" />
            {SCHOOLS.map((s) => (
              <SchoolChip
                key={s.id}
                selected={schoolFilter === s.id}
                onClick={() => setSchoolFilter(s.id)}
                label={s.short}
                schoolId={s.id}
              />
            ))}
          </div>
          <FilterChips
            label="Uniform item"
            value={kind}
            onChange={setKind}
            options={KINDS.map((k) => ({
              value: k,
              label: k === "all" ? "All items" : UNIFORM_KIND_LABEL[k],
              count: k === "all" ? bySchool.length : bySchool.filter((u) => u.kind === k).length,
            }))}
          />
        </div>

        {visible.length ? (
          <ul key={`${kind}-${schoolFilter}`} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((u, i) => (
              <UniformCard
                key={u.id}
                item={u}
                index={i}
                focused={u.id === focusedProductId}
                onSizeGuide={() => openSizeGuide(guideTabFor(u.kind))}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-cream p-10 text-center">
            <p className="font-heading text-lg font-bold text-ink">Nothing in this category yet</p>
            <p className="mt-1 text-sm text-muted">We stock more pieces in store — call us and we’ll check your size.</p>
            <button
              type="button"
              onClick={() => setKind("all")}
              data-fx="primary"
              className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
            >
              Show all items
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SchoolChip({
  selected,
  onClick,
  label,
  schoolId,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  schoolId?: SchoolId;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full pr-4 text-sm font-medium transition ${schoolId ? "pl-1.5" : "pl-4"} ${
        selected ? "bg-brand-600 text-white" : "bg-cream text-ink-soft ring-1 ring-line hover:text-ink hover:ring-brand-200"
      }`}
    >
      {schoolId ? <SchoolMark school={schoolById(schoolId)} className="size-7 text-[9px] ring-2 ring-white" /> : null}
      {label}
    </button>
  );
}

interface UniformCardProps {
  item: UniformProduct;
  index: number;
  focused: boolean;
  onSizeGuide: () => void;
}

function UniformCard({ item, index, focused, onSizeGuide }: UniformCardProps) {
  const { addToCart } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const school = schoolById(item.schools[0]);

  const add = () => {
    if (!size) {
      setNudge(true);
      return;
    }
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      size,
      kind: item.kind,
      tone: item.tone,
      accent: item.accent,
    });
  };

  return (
    <li
      id={`product-${item.id}`}
      className={`group flex animate-fade-up flex-col overflow-hidden rounded-3xl border bg-cream transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lift ${
        focused ? "border-brand-400 ring-4 ring-brand-100" : "border-line"
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div
        className="relative grid aspect-[4/3] place-items-center"
        style={{ backgroundColor: `color-mix(in srgb, ${item.accent ?? item.tone} 8%, #f5f2ec)` }}
      >
        <ProductArt
          kind={item.kind}
          tone={item.tone}
          accent={item.accent}
          className="size-32 drop-shadow-[0_14px_14px_rgba(20,24,35,0.14)] transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3">
          <SchoolBadge school={school} />
        </span>
        {item.tag ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold text-brand-950">
            {item.tag}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{UNIFORM_KIND_LABEL[item.kind]}</p>
        <h3 className="mt-1 font-heading text-base font-bold leading-snug text-ink">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className={`text-xs font-semibold ${nudge && !size ? "text-red-600" : "text-ink-soft"}`}>
              {size ? `Size ${size}` : nudge ? "Please choose a size" : "Choose size"}
            </p>
            <button
              type="button"
              onClick={onSizeGuide}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
            >
              <Ruler className="size-3.5" aria-hidden="true" /> Size guide
            </button>
          </div>
          <SizePills
            sizes={item.sizes}
            value={size}
            onChange={(s) => {
              setSize(s);
              setNudge(false);
            }}
            label={`Size for ${item.name}`}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="font-heading text-lg font-extrabold text-ink">{formatPrice(item.price)}</p>
          <button
            type="button"
            onClick={add}
            aria-disabled={!size}
            data-fx="primary"
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition active:scale-[0.97] ${
              size ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-surface-2 text-ink-soft hover:bg-line"
            }`}
          >
            <Plus className="size-4" aria-hidden="true" /> Add
          </button>
        </div>
      </div>
    </li>
  );
}
