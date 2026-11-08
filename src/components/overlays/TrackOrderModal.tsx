"use client";

import { useState } from "react";
import { Check, PackageSearch, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/context/StoreContext";
import { STORE_INFO } from "@/lib/data";

const STEPS = ["Order received", "Books & uniforms packed", "Out for delivery", "Delivered"] as const;
const ORDER_PATTERN = /^ABS-?\d{4,6}$/i;

/** Demo order tracker — validates the order number format and shows a sample timeline. */
export function TrackOrderModal() {
  const { isTrackOpen, setTrackOpen } = useStore();
  const [orderNo, setOrderNo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; step: number } | null>(null);

  const close = () => setTrackOpen(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderNo.trim().toUpperCase();
    if (!ORDER_PATTERN.test(id)) {
      setError("Enter the order number from your receipt, e.g. ABS-10482.");
      setResult(null);
      return;
    }
    setError(null);
    const digits = Number(id.replace(/\D/g, ""));
    setResult({ id: id.includes("-") ? id : `ABS-${id.slice(3)}`, step: digits % STEPS.length });
  };

  return (
    <Modal open={isTrackOpen} onClose={close} title="Track your order" subtitle="Use the order number on your receipt or SMS.">
      <form onSubmit={submit} noValidate>
        <label htmlFor="order-no" className="text-sm font-medium text-ink">
          Order number
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="order-no"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="ABS-10482"
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "order-error" : undefined}
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm uppercase outline-none transition placeholder:normal-case focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="submit"
            data-fx="primary"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <PackageSearch className="size-4" aria-hidden="true" /> Track
          </button>
        </div>
        {error ? (
          <p id="order-error" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </form>

      {result ? (
        <div key={result.id} className="mt-6 animate-fade-up rounded-2xl bg-cream p-5 ring-1 ring-line" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Order {result.id}</p>
          <ol className="mt-4 space-y-0">
            {STEPS.map((label, i) => {
              const done = i <= result.step;
              const current = i === result.step;
              return (
                <li key={label} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[11px] top-6 h-[calc(100%-1rem)] w-0.5 ${i < result.step ? "bg-brand-500" : "bg-line"}`}
                    />
                  ) : null}
                  <span
                    className={`relative grid size-6 shrink-0 place-items-center rounded-full ${
                      done ? "bg-brand-600 text-white" : "bg-white text-muted ring-1 ring-line"
                    } ${current ? "ring-4 ring-brand-100" : ""}`}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-line" />}
                  </span>
                  <span className={`text-sm ${done ? "font-semibold text-ink" : "text-muted"}`}>
                    {label}
                    {current ? <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-700">Now</span> : null}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-xs text-muted">Demo tracker — sample status shown for illustration.</p>
        </div>
      ) : null}

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
        <Phone className="size-4 text-brand-600" aria-hidden="true" />
        Need help? Call{" "}
        <a href={`tel:${STORE_INFO.phone.replace(/\s/g, "")}`} className="font-semibold text-brand-700 hover:underline">
          {STORE_INFO.phone}
        </a>
      </p>
    </Modal>
  );
}
