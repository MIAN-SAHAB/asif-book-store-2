import type { School } from "@/lib/types";

/** Monogram roundel for a school (no third-party logos are reproduced). */
export function SchoolMark({ school, className = "size-10" }: { school: School; className?: string }) {
  const initials = school.short
    .replace(/^The\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-heading text-[11px] font-extrabold tracking-tight text-white ${className}`}
      style={{ backgroundColor: school.color }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function SchoolBadge({ school }: { school: School }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: `color-mix(in srgb, ${school.color} 10%, white)`, color: school.color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: school.color }} />
      {school.short}
    </span>
  );
}
