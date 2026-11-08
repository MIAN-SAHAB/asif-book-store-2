"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: "md" | "lg";
}

/** Accessible centred dialog with overlay, Escape-to-close and scroll lock. */
export function Modal({ open, onClose, title, subtitle, children, size = "md" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center p-0 transition-[visibility] sm:items-center sm:p-6 ${
        open ? "visible" : "invisible delay-300"
      }`}
      inert={!open}
    >
      <div
        className={`absolute inset-0 bg-brand-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift outline-none transition duration-300 ease-out sm:rounded-3xl ${
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
        } ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            data-fx="icon"
            className="-mr-2 grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
