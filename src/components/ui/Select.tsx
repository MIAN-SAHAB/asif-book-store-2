"use client";

import { ChevronDown } from "lucide-react";

interface SelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  icon?: React.ReactNode;
}

/** Native select styled to match the chip toolbar (native keeps it accessible on mobile). */
export function Select<T extends string>({ label, value, onChange, options, icon }: SelectProps<T>) {
  return (
    <label className="relative flex h-10 min-w-0 items-center rounded-full bg-white pl-3.5 pr-9 ring-1 ring-line transition focus-within:ring-2 focus-within:ring-brand-400 hover:ring-ink/20">
      {icon ? <span className="mr-2 text-muted">{icon}</span> : null}
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent text-sm font-medium text-ink outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted" aria-hidden="true" />
    </label>
  );
}
