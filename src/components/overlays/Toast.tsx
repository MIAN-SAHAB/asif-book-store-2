"use client";

import { CircleCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Toast() {
  const { toast, setCartOpen } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4" aria-live="polite" role="status">
      {toast ? (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-md animate-fade-up items-center gap-3 rounded-full bg-ink py-2 pl-3 pr-2 text-sm text-white shadow-lift"
        >
          <CircleCheck className="size-5 shrink-0 text-gold-300" aria-hidden="true" />
          <span className="truncate">{toast.message}</span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            data-fx="secondary"
            className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
          >
            View cart
          </button>
        </div>
      ) : null}
    </div>
  );
}
