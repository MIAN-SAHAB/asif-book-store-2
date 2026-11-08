"use client";

import { useRef } from "react";
import { RefreshCw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReveal } from "@/hooks/useReveal";

const POINTS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "100% Authorized Stock",
    text: "Authorized dealer for The City School and other reputed schools — genuine course books, crests and fabrics only.",
  },
  {
    icon: RefreshCw,
    title: "Easy Size Exchange",
    text: "Kids grow fast. Swap any uniform size free within 7 days — tags on, receipt in hand, no questions asked.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Complete class packs packed and delivered to your door, or ready for same-day pickup from the store.",
  },
];

export function TrustSection() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);
  return (
    <section id="trust" ref={rootRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Why parents trust us"
          title="Back-to-school, without the running around"
          description="One counter for books and uniforms — checked against your school’s official list."
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              data-reveal
              className="relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div aria-hidden="true" className="absolute -right-10 -top-10 size-32 rounded-full bg-gold-100/60" />
              <span className="relative grid size-12 place-items-center rounded-2xl bg-brand-600 text-gold-300 shadow-[0_10px_22px_-12px_rgba(11,79,209,0.9)]">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 text-xl font-bold text-ink">{title}</h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
