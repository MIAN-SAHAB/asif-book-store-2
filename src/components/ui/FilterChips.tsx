"use client";

interface Option<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

/** Horizontally scrollable single-select chip row. */
export function FilterChips<T extends string>({ options, value, onChange, label }: FilterChipsProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${
              selected
                ? "bg-ink text-white"
                : "bg-white text-ink-soft ring-1 ring-line hover:text-ink hover:ring-ink/20"
            }`}
          >
            {o.label}
            {typeof o.count === "number" ? (
              <span
                className={`rounded-full px-1.5 text-[11px] tabular-nums ${selected ? "bg-white/15 text-white" : "bg-surface text-muted"}`}
              >
                {o.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
