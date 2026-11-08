"use client";

import { useRef, useState } from "react";
import { GraduationCap, Plus, School as SchoolIcon, Search, X } from "lucide-react";
import { FilterChips } from "@/components/ui/FilterChips";
import { ProductArt } from "@/components/ui/ProductArt";
import { SchoolBadge } from "@/components/ui/SchoolMark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Select } from "@/components/ui/Select";
import { useStore } from "@/context/StoreContext";
import { useReveal } from "@/hooks/useReveal";
import { BOOKS, BOOK_KIND_LABEL, GRADES, SCHOOLS, formatPrice, gradeById, schoolById } from "@/lib/data";
import type { BookKind, BookProduct, GradeId, SchoolId } from "@/lib/types";

type KindFilter = BookKind | "all";
type GradeFilter = GradeId | "all";

const KINDS: KindFilter[] = ["all", "course-pack", "o-a-level", "revision", "children"];

export function BooksCatalog() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);
  const { schoolFilter, setSchoolFilter, focusedProductId } = useStore();
  const [kind, setKind] = useState<KindFilter>("all");
  const [grade, setGrade] = useState<GradeFilter>("all");
  const [query, setQuery] = useState("");

  const matchesBase = (b: BookProduct) =>
    (schoolFilter === "all" || b.schools.length === 0 || b.schools.includes(schoolFilter)) &&
    (grade === "all" || b.grades.includes(grade)) &&
    (!query.trim() || `${b.name} ${b.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  const base = BOOKS.filter(matchesBase);
  const counts = Object.fromEntries(
    KINDS.map((k) => [k, k === "all" ? base.length : base.filter((b) => b.kind === k).length]),
  ) as Record<KindFilter, number>;

  const visible = BOOKS.filter(
    (b) => (matchesBase(b) && (kind === "all" || b.kind === kind)) || b.id === focusedProductId,
  );

  const hasFilters = kind !== "all" || grade !== "all" || schoolFilter !== "all" || query !== "";
  const reset = () => {
    setKind("all");
    setGrade("all");
    setSchoolFilter("all");
    setQuery("");
  };

  return (
    <section id="books" ref={rootRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Books"
          title="Course books & reading for every class"
          description="Official school course packs, Cambridge O & A Level texts, revision guides and children’s books."
        />

        <div data-reveal className="mt-10 space-y-3">
          <FilterChips
            label="Book type"
            value={kind}
            onChange={setKind}
            options={KINDS.map((k) => ({ value: k, label: k === "all" ? "All books" : BOOK_KIND_LABEL[k], count: counts[k] }))}
          />
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-center">
            <Select
              label="School"
              value={schoolFilter}
              onChange={setSchoolFilter}
              icon={<SchoolIcon className="size-4" />}
              options={[{ value: "all", label: "All schools" }, ...SCHOOLS.map((s) => ({ value: s.id, label: s.name }))]}
            />
            <Select
              label="Class"
              value={grade}
              onChange={setGrade}
              icon={<GraduationCap className="size-4" />}
              options={[{ value: "all", label: "All classes" }, ...GRADES.map((g) => ({ value: g.id, label: g.label }))]}
            />
            <label className="flex h-10 items-center gap-2 rounded-full bg-white px-3.5 ring-1 ring-line transition focus-within:ring-2 focus-within:ring-brand-400">
              <Search className="size-4 text-muted" aria-hidden="true" />
              <span className="sr-only">Filter books by title</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by title or subject"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted/80"
              />
            </label>
            {hasFilters ? (
              <button
                type="button"
                onClick={reset}
                data-fx="icon"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-brand-600 hover:bg-brand-50"
              >
                <X className="size-4" aria-hidden="true" /> Clear
              </button>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          Showing <span className="font-semibold text-ink">{visible.length}</span> {visible.length === 1 ? "title" : "titles"}
          {schoolFilter !== "all" ? <> for {schoolById(schoolFilter as SchoolId).name}</> : null}
        </p>

        {visible.length ? (
          <ul
            key={`${kind}-${grade}-${schoolFilter}`}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visible.map((b, i) => (
              <BookCard key={b.id} book={b} index={i} onGrade={setGrade} focused={b.id === focusedProductId} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-heading text-lg font-bold text-ink">No books match these filters</p>
            <p className="mt-1 text-sm text-muted">Try another class or school — or ask us in store, we can order it in.</p>
            <button
              type="button"
              onClick={reset}
              data-fx="primary"
              className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

interface BookCardProps {
  book: BookProduct;
  index: number;
  focused: boolean;
  onGrade: (g: GradeId) => void;
}

function BookCard({ book, index, focused, onGrade }: BookCardProps) {
  const { addToCart } = useStore();
  const schools = book.schools.map(schoolById);
  return (
    <li
      id={`product-${book.id}`}
      className={`group flex animate-fade-up flex-col overflow-hidden rounded-3xl border bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lift ${
        focused ? "border-brand-400 ring-4 ring-brand-100" : "border-line"
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div
        className="relative grid aspect-[4/3] place-items-center"
        style={{ backgroundColor: `color-mix(in srgb, ${book.tone} 9%, #fcfaf6)` }}
      >
        <ProductArt
          kind={book.kind}
          tone={book.tone}
          accent={book.accent}
          className="size-32 drop-shadow-[0_14px_14px_rgba(20,24,35,0.14)] transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-soft ring-1 ring-line backdrop-blur">
          {BOOK_KIND_LABEL[book.kind]}
        </span>
        {book.tag ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold text-brand-950">
            {book.tag}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {schools.length ? (
            schools.map((s) => <SchoolBadge key={s.id} school={s} />)
          ) : (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">All schools</span>
          )}
        </div>
        <h3 className="mt-2 font-heading text-base font-bold leading-snug text-ink">{book.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{book.description}</p>
        <div className="mt-3 flex flex-wrap gap-1" aria-label="Grades">
          {book.grades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGrade(g)}
              className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-100"
              title={`Show all ${gradeById(g).label} books`}
            >
              {gradeById(g).label}
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="font-heading text-lg font-extrabold text-ink">{formatPrice(book.price)}</p>
          <button
            type="button"
            onClick={() =>
              addToCart({ productId: book.id, name: book.name, price: book.price, kind: book.kind, tone: book.tone, accent: book.accent })
            }
            data-fx="primary"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.97]"
            aria-label={`Add ${book.name} to cart`}
          >
            <Plus className="size-4" aria-hidden="true" /> Add
          </button>
        </div>
      </div>
    </li>
  );
}
