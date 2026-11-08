"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CornerDownLeft,
  Flame,
  Plus,
  School as SchoolIcon,
  Search,
  Shirt,
  TrendingUp,
  X,
} from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import { useStore } from "@/context/StoreContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ALL_PRODUCTS, BOOK_KIND_LABEL, UNIFORM_KIND_LABEL, formatPrice, schoolById } from "@/lib/data";
import type { Product } from "@/lib/types";

const POPULAR_SEARCHES = ["City School", "Class 5", "Blazer", "O Level", "Past papers", "P.E. Kit", "Phonics"];
const POPULAR_IDS = ["bk-tcs-c1", "un-tcs-shirt", "bk-rev-maths", "un-tcs-blazer", "bk-ch-phonics", "un-tcs-pe"];

const kindLabel = (p: Product) => (p.category === "books" ? BOOK_KIND_LABEL[p.kind] : UNIFORM_KIND_LABEL[p.kind]);

const INDEX = ALL_PRODUCTS.map((p) => ({
  product: p,
  text: [p.name, p.description, kindLabel(p), p.category, ...p.schools.map((id) => schoolById(id).name)]
    .join(" ")
    .toLowerCase(),
}));

const POPULAR = POPULAR_IDS.map((id) => ALL_PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

const SHORTCUTS = [
  { href: "#books", label: "All books", icon: BookOpen },
  { href: "#uniforms", label: "All uniforms", icon: Shirt },
  { href: "#schools", label: "School kit finder", icon: SchoolIcon },
] as const;

/** Full search dialog: live results, popular searches and popular items. Opens with the header icon, "/" or Ctrl/⌘+K. */
export function SearchModal() {
  const { isSearchOpen, setSearchOpen, addToCart, focusProduct } = useStore();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  useScrollLock(isSearchOpen);

  const trimmed = query.trim();
  const results = useMemo(() => {
    const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return INDEX.filter(({ text }) => terms.every((t) => text.includes(t)))
      .slice(0, 8)
      .map(({ product }) => product);
  }, [trimmed]);

  const close = () => {
    setSearchOpen(false);
    setQuery("");
    setActive(0);
  };

  // Global shortcuts to open search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el?.closest("input, textarea, select, [contenteditable='true']");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  // Focus the field on open and restore focus on close.
  useEffect(() => {
    if (!isSearchOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    // Escape anywhere in the dialog closes it (the input handles its own Escape first).
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      setSearchOpen(false);
      setQuery("");
      setActive(0);
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onEscape);
      previous?.focus?.();
    };
  }, [isSearchOpen, setSearchOpen]);

  const go = (p: Product) => {
    close();
    focusProduct(p.id);
  };

  const quickAdd = (p: Product) =>
    addToCart({ productId: p.id, name: p.name, price: p.price, kind: p.kind, tone: p.tone, accent: p.accent });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[75] flex justify-center sm:items-start sm:px-6 sm:pt-[9vh] ${
        isSearchOpen ? "visible" : "invisible delay-300"
      }`}
      inert={!isSearchOpen}
    >
      <div
        className={`absolute inset-0 bg-brand-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the store"
        className={`relative flex h-dvh w-full flex-col overflow-hidden bg-cream shadow-lift transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-auto sm:max-h-[80vh] sm:max-w-[46rem] sm:rounded-3xl ${
          isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        {/* Search field */}
        <div className="border-b border-line bg-white px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-cream px-4 ring-1 ring-line transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-400">
              <Search className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
              <span className="sr-only">Search books, uniforms and schools</span>
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search books, uniforms, schools…"
                className="w-full min-w-0 bg-transparent text-base text-ink outline-none focus-visible:outline-none placeholder:text-muted/80 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  data-fx="icon"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
            <button
              type="button"
              onClick={close}
              className="h-10 shrink-0 rounded-full px-3 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-ink"
            >
              <span className="sm:hidden">Cancel</span>
              <kbd className="hidden rounded-md border border-line bg-white px-1.5 py-0.5 font-sans text-xs text-muted sm:inline">
                Esc
              </kbd>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          {trimmed ? (
            results.length ? (
              <section aria-label="Results">
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </p>
                <ul id={listId} role="listbox" className="space-y-1.5">
                  {results.map((p, i) => (
                    <li
                      key={p.id}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      className={`flex animate-fade-up items-center gap-3 rounded-2xl p-2 pr-3 transition-colors ${
                        i === active ? "bg-white ring-1 ring-brand-200" : ""
                      }`}
                      style={{ animationDelay: `${i * 25}ms` }}
                    >
                      <button type="button" onClick={() => go(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <ProductThumb product={p} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">
                            <Highlight text={p.name} query={trimmed} />
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {kindLabel(p)} · {p.schools.length ? schoolById(p.schools[0]).short : "All schools"} ·{" "}
                            {formatPrice(p.price)}
                          </span>
                        </span>
                      </button>
                      <ResultAction product={p} onAdd={quickAdd} onGo={go} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <div className="animate-fade-up py-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Search className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-4 font-heading text-lg font-bold text-ink">No matches for “{trimmed}”</p>
                <p className="mt-1 text-sm text-muted">Try a school name, a class, or an item like “blazer”.</p>
                <PopularSearches onPick={setQuery} className="mt-6 justify-center" />
              </div>
            )
          ) : (
            <div className="animate-fade-up space-y-7">
              <section>
                <h3 className="mb-3 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  <TrendingUp className="size-4 text-brand-600" aria-hidden="true" /> Popular searches
                </h3>
                <PopularSearches onPick={setQuery} />
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  <Flame className="size-4 text-gold-600" aria-hidden="true" /> Popular items
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {POPULAR.map((p) => (
                    <li
                      key={p.id}
                      className="group flex items-center gap-3 rounded-2xl bg-white p-2 pr-3 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-soft hover:ring-brand-200"
                    >
                      <button type="button" onClick={() => go(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <ProductThumb product={p} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-700">
                            {p.name}
                          </span>
                          <span className="block text-xs text-muted">
                            {kindLabel(p)} · <span className="font-semibold text-ink-soft">{formatPrice(p.price)}</span>
                          </span>
                        </span>
                      </button>
                      <ResultAction product={p} onAdd={quickAdd} onGo={go} />
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Browse</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {SHORTCUTS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={close}
                      className="group flex items-center gap-3 rounded-2xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                    >
                      <Icon className="size-4 text-gold-300" aria-hidden="true" />
                      {label}
                      <ArrowRight className="ml-auto size-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-line bg-white px-5 py-2.5 text-xs text-muted sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line px-1 font-sans">↑</kbd>
            <kbd className="rounded border border-line px-1 font-sans">↓</kbd> to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="grid place-items-center rounded border border-line px-1">
              <CornerDownLeft className="size-3" aria-hidden="true" />
            </kbd>
            to open
          </span>
          <span className="ml-auto">
            Press <kbd className="rounded border border-line px-1 font-sans">/</kbd> anywhere to search
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <span
      className="grid size-12 shrink-0 place-items-center rounded-xl"
      style={{ backgroundColor: `color-mix(in srgb, ${product.accent ?? product.tone} 11%, white)` }}
    >
      <ProductArt kind={product.kind} tone={product.tone} accent={product.accent} className="size-10" />
    </span>
  );
}

function ResultAction({
  product,
  onAdd,
  onGo,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onGo: (p: Product) => void;
}) {
  return product.category === "books" ? (
    <button
      type="button"
      onClick={() => onAdd(product)}
      data-fx="primary"
      className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
      aria-label={`Add ${product.name} to cart`}
    >
      <Plus className="size-4" />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onGo(product)}
      data-fx="secondary"
      className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-700"
    >
      Pick size
    </button>
  );
}

function PopularSearches({ onPick, className = "" }: { onPick: (q: string) => void; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {POPULAR_SEARCHES.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onPick(term)}
          className="h-9 rounded-full bg-white px-3.5 text-sm font-medium text-ink-soft ring-1 ring-line transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
        >
          {term}
        </button>
      ))}
    </div>
  );
}

/** Bolds the parts of `text` that match any search term. */
function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${terms.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-gold-100 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
