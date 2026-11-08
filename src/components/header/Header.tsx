"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { gsap, useGSAP } from "@/lib/gsap";

const LINKS = [
  { href: "#books", label: "Books" },
  { href: "#uniforms", label: "Uniforms" },
  { href: "#schools", label: "Schools" },
] as const;

export function Header() {
  const { cartCount, setCartOpen, setTrackOpen, setSearchOpen, setAccountOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Subtle bump on the cart badge whenever the count changes.
  useGSAP(
    () => {
      if (!cartCount || !badgeRef.current) return;
      gsap.fromTo(badgeRef.current, { scale: 1.45 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
    },
    { dependencies: [cartCount] },
  );

  const closeAll = () => setMenuOpen(false);
  const iconBtn =
    "grid size-9 place-items-center rounded-full sm:size-11 text-ink-soft transition hover:bg-white hover:text-brand-700 hover:shadow-soft";

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || menuOpen ? "border-b border-line/80 bg-cream/90 shadow-[0_6px_24px_-18px_rgba(11,42,102,0.35)] backdrop-blur-md" : "border-b border-transparent bg-cream/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-[4.5rem] sm:gap-3 sm:px-6 lg:gap-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" onClick={closeAll} aria-label="Asif Book Store home">
          <Image
            src="/assets/images/logo.jpeg"
            alt=""
            width={40}
            height={40}
            className="size-9 rounded-xl object-cover ring-1 ring-brand-900/10 sm:size-10"
          />
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-heading text-[14px] font-extrabold tracking-tight text-brand-900 sm:text-base">
              Asif Book Store
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-muted sm:block">
              Books · Uniforms
            </span>
          </span>
        </a>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setTrackOpen(true)}
            className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-brand-700"
          >
            Track Order
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
            data-fx="icon-soft"
            className={iconBtn}
            aria-label="Search books, uniforms and schools"
            aria-keyshortcuts="/ Control+K"
            title="Search ( / )"
          >
            <Search className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setAccountOpen(true);
            }}
            data-fx="icon-soft"
            className={iconBtn}
            aria-label="Account"
            title="Account"
          >
            <UserRound className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            data-fx="primary"
            className="relative ml-1 flex h-10 items-center gap-2 rounded-full bg-brand-600 pl-3 pr-3 sm:h-11 sm:pl-3.5 sm:pr-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(11,79,209,0.8)] transition hover:bg-brand-700 active:scale-[0.98]"
            aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="size-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              ref={badgeRef}
              className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1.5 text-[11px] font-bold tabular-nums text-brand-950"
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            data-fx="icon-soft"
            className={`${iconBtn} lg:hidden`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" className="animate-fade-up border-t border-line/70 px-4 pb-5 pt-2 lg:hidden" aria-label="Mobile">
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={closeAll}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-ink transition hover:bg-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  setTrackOpen(true);
                }}
                className="block w-full rounded-xl px-3 py-3 text-left text-base font-medium text-ink transition hover:bg-white"
              >
                Track Order
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
