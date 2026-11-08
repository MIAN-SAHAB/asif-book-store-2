"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import { HeroBackground } from "./HeroBackground";
import { useStore } from "@/context/StoreContext";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

const POINTS = ["Official school book lists", "Free size exchange", "Home delivery & pickup"];

export function Hero() {
  const { isReady } = useStore();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!isReady) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-hero='copy']", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 })
          .fromTo(
            "[data-hero='stage']",
            { autoAlpha: 0, scale: 0.96, y: 24 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1 },
            0.15,
          )
          .fromTo(
            "[data-hero='float']",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 },
            0.45,
          );
      });
      mm.add(REDUCED_MOTION, () => {
        gsap.set("[data-hero]", { autoAlpha: 1 });
      });
    },
    { scope: rootRef, dependencies: [isReady] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-4.5rem-1px)] lg:items-center"
    >
      {/* Decorative background geometry */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -left-32 top-1/2 size-[26rem] rounded-full bg-gold-100/70 blur-3xl" />
        <HeroBackground />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:py-12">
        <div>
          <p
            data-hero="copy"
            className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-brand-900 sm:text-sm"
          >
            <span className="grid size-6 place-items-center rounded-full bg-brand-600 text-gold-300">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
            </span>
            Authorized Dealer for The City School
          </p>

          <h1
            data-hero="copy"
            className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]"
          >
            School books &amp; uniforms,{" "}
            <span className="text-brand-600 underline decoration-gold-400 decoration-[0.12em] underline-offset-[0.18em] [text-decoration-skip-ink:none]">
              sorted in two clicks.
            </span>
          </h1>

          <p data-hero="copy" className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Official course packs, O &amp; A Level books and authentic uniforms for The City School and other reputed
            schools — matched to your child&apos;s class and ready for pickup or delivery.
          </p>

          <div data-hero="copy" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#books"
              data-fx="primary"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(11,79,209,0.9)] transition hover:bg-brand-700"
            >
              Shop School Books
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href="#uniforms"
              data-fx="secondary"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700"
            >
              Shop Uniforms
            </a>
          </div>

          <ul data-hero="copy" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-ink-soft">
                <span className="grid size-5 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Layered visual showcase */}
        <div className="relative mx-auto aspect-square w-full max-w-[30rem] sm:max-w-[34rem] lg:max-w-[min(34rem,calc(100svh-12rem))]">
          <div data-hero="stage" className="absolute inset-[9%] overflow-hidden rounded-[2.25rem] shadow-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800" />
            <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-0 size-full text-white/10">
              <circle cx="170" cy="30" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="170" cy="30" r="90" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="20" cy="190" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-gold-300/30 blur-2xl" aria-hidden="true" />
                <Image
                  src="/assets/images/logo.jpeg"
                  alt="Asif Book Store emblem"
                  width={240}
                  height={240}
                  preload
                  className="relative size-40 rounded-[2rem] object-cover ring-4 ring-white/15 sm:size-52"
                />
              </div>
            </div>
          </div>

          {/* Authorized seal */}
          <div data-hero="float" className="absolute right-0 top-[2%] sm:right-[2%]">
            <div className="animate-float grid size-24 place-items-center rounded-full bg-gold-400 text-center shadow-lift ring-4 ring-cream sm:size-28 [animation-delay:-1s]">
              <div>
                <ShieldCheck className="mx-auto size-6 text-brand-900" aria-hidden="true" />
                <p className="mt-1 font-heading text-[10px] font-extrabold uppercase leading-tight tracking-wider text-brand-950 sm:text-[11px]">
                  Authorized
                  <br />
                  Dealer
                </p>
              </div>
            </div>
          </div>

          {/* Course pack card */}
          <div data-hero="float" className="absolute -left-1 top-[22%] sm:-left-6">
            <div className="animate-float flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 pr-5 shadow-lift backdrop-blur">
              <span className="grid size-14 place-items-center rounded-xl bg-brand-50">
                <ProductArt kind="course-pack" tone="#0b4fd1" accent="#fcc81f" className="size-12" />
              </span>
              <span>
                <span className="block text-xs font-medium text-muted">The City School</span>
                <span className="block font-heading text-sm font-bold text-ink">Class 5 Course Pack</span>
                <span className="block text-xs font-semibold text-brand-600">7 books · ready to collect</span>
              </span>
            </div>
          </div>

          {/* Uniform card */}
          <div data-hero="float" className="absolute -right-1 bottom-[8%] sm:-right-4">
            <div className="animate-float rounded-2xl border border-white/60 bg-white/95 p-3 shadow-lift backdrop-blur [animation-delay:-3s]">
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-xl bg-surface">
                  <ProductArt kind="shirt" tone="#ffffff" accent="#0b4fd1" className="size-12" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold text-ink">Official White Shirt</span>
                  <span className="block text-xs text-muted">Pick a size</span>
                </span>
              </div>
              <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
                {["24", "26", "28", "30"].map((s) => (
                  <span
                    key={s}
                    className={`grid h-7 w-9 place-items-center rounded-lg text-xs font-semibold ${
                      s === "26" ? "bg-brand-600 text-white" : "border border-line text-ink-soft"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Gold arc accent */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute -bottom-2 left-[4%] size-24 text-gold-400 sm:size-28"
          >
            <path d="M10 90 A 80 80 0 0 1 90 10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <circle cx="10" cy="90" r="5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
