"use client";

import Image from "next/image";
import { BadgeCheck, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SCHOOLS, STORE_INFO } from "@/lib/data";

export function Footer() {
  const { setTrackOpen, openSizeGuide } = useStore();
  return (
    <footer className="bg-brand-950 text-white/75">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/assets/images/logo.jpeg" alt="" width={48} height={48} className="size-12 rounded-2xl object-cover" />
              <div>
                <p className="font-heading text-lg font-extrabold text-white">{STORE_INFO.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Books · Uniforms</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Authorized Dealer for Uniforms &amp; Course Books of The City School and other reputed schools.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-gold-300 ring-1 ring-white/10">
              <BadgeCheck className="size-4" aria-hidden="true" /> Authorized Dealer · The City School
            </p>
          </div>

          <nav aria-label="Shop">
            <p className="font-heading text-sm font-bold text-white">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-white" href="#books">School books</a></li>
              <li><a className="hover:text-white" href="#uniforms">Uniforms</a></li>
              <li><a className="hover:text-white" href="#schools">School kit finder</a></li>
              <li>
                <button type="button" className="hover:text-white" onClick={() => openSizeGuide("shirts")}>
                  Size guide
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-white" onClick={() => setTrackOpen(true)}>
                  Track order
                </button>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-heading text-sm font-bold text-white">Schools we serve</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SCHOOLS.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </div>

          <address className="not-italic">
            <p className="font-heading text-sm font-bold text-white">Visit the store</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                <span>
                  {STORE_INFO.address}, {STORE_INFO.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                <a className="hover:text-white" href={`tel:${STORE_INFO.phone.replace(/\s/g, "")}`}>
                  {STORE_INFO.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                <a className="hover:text-white" href={`mailto:${STORE_INFO.email}`}>
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                <span>{STORE_INFO.hours}</span>
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.</p>
          <p>School names are used to identify the uniforms and course books we supply.</p>
        </div>
      </div>
    </footer>
  );
}
