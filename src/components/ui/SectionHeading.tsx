import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", action }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        <p data-reveal className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p data-reveal className="mt-3 text-base leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div data-reveal>{action}</div> : null}
    </div>
  );
}
