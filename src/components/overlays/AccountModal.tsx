"use client";

import { useState } from "react";
import { ArrowRight, ClipboardList, Heart, LogIn, Phone, Ruler, School as SchoolIcon, UserRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/context/StoreContext";
import { STORE_INFO } from "@/lib/data";

const PHONE_PATTERN = /^(\+92|0)3\d{2}[\s-]?\d{7}$/;

const PERKS = [
  "Save your child’s school & class for one-tap reorders",
  "Track every order and exchange in one place",
  "Get notified when next year’s book lists arrive",
];

/** Demo account panel — sign-in UI and shortcuts. Accounts aren't connected to a backend yet. */
export function AccountModal() {
  const { isAccountOpen, setAccountOpen, setTrackOpen, openSizeGuide, notify } = useStore();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const close = () => setAccountOpen(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PHONE_PATTERN.test(phone.trim())) {
      setError("Enter a mobile number like 0300 1234567.");
      return;
    }
    setError(null);
    notify("Demo store — customer accounts aren’t connected yet");
  };

  const links = [
    {
      icon: ClipboardList,
      label: "Track an order",
      onClick: () => {
        close();
        setTrackOpen(true);
      },
    },
    {
      icon: SchoolIcon,
      label: "Find my school kit",
      onClick: () => {
        close();
        document.getElementById("schools")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: Ruler,
      label: "Uniform size guide",
      onClick: () => {
        close();
        openSizeGuide("shirts");
      },
    },
  ];

  return (
    <Modal open={isAccountOpen} onClose={close} title="Your account" subtitle="Sign in to save your school list and orders.">
      <div className="flex items-center gap-4 rounded-2xl bg-brand-900 p-4 text-white">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold-400 text-brand-950">
          <UserRound className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-heading text-base font-bold">Welcome, parent!</p>
          <p className="text-sm text-white/70">One login for books, uniforms and exchanges.</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="mt-5">
        <label htmlFor="account-phone" className="text-sm font-medium text-ink">
          Mobile number
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-full border border-line bg-white pl-4 transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
          <Phone className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="account-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0300 1234567"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "account-phone-error" : undefined}
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/80"
          />
        </div>
        {error ? (
          <p id="account-phone-error" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          data-fx="primary"
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <LogIn className="size-4" aria-hidden="true" /> Send login code
        </button>
        <p className="mt-2 text-center text-xs text-muted">New here? We’ll create your account automatically.</p>
      </form>

      <ul className="mt-5 space-y-2 rounded-2xl bg-cream p-4 ring-1 ring-line">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <Heart className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden="true" />
            {perk}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-2">
        {links.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-ink ring-1 ring-line transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-white">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            {label}
            <ArrowRight className="ml-auto size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-muted">
        Need help? Call{" "}
        <a href={`tel:${STORE_INFO.phone.replace(/\s/g, "")}`} className="font-semibold text-brand-700 hover:underline">
          {STORE_INFO.phone}
        </a>
      </p>
    </Modal>
  );
}
