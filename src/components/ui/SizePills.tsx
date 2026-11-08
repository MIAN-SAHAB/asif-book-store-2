"use client";

import { useId } from "react";

interface SizePillsProps {
  sizes: readonly string[];
  value: string | null;
  onChange: (size: string) => void;
  label: string;
  compact?: boolean;
}

/** Accessible single-choice size selector rendered as pills (radio group semantics). */
export function SizePills({ sizes, value, onChange, label, compact }: SizePillsProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((size) => {
          const selected = value === size;
          return (
            <label
              key={size}
              className={`relative grid cursor-pointer place-items-center rounded-lg border text-xs font-semibold tabular-nums transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-400 ${
                compact ? "h-7 min-w-8 px-2" : "h-8 min-w-10 px-2.5"
              } ${
                selected
                  ? "border-brand-600 bg-brand-600 text-white shadow-[0_6px_14px_-8px_rgba(11,79,209,0.9)]"
                  : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={size}
                checked={selected}
                onChange={() => onChange(size)}
                className="sr-only"
              />
              {size}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
