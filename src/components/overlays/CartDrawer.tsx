"use client";

import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash, Truck, X } from "lucide-react";
import { ProductArt } from "@/components/ui/ProductArt";
import { useStore } from "@/context/StoreContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { STORE_INFO, formatPrice } from "@/lib/data";

/** Slide-out cart with quantity controls, free-delivery progress and subtotal. */
export function CartDrawer() {
  const { cart, cartCount, cartTotal, isCartOpen, setCartOpen, updateQty, removeFromCart, notify } = useStore();
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(isCartOpen);

  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [isCartOpen, setCartOpen]);

  const threshold = STORE_INFO.freeDeliveryOver;
  const remaining = Math.max(0, threshold - cartTotal);
  const close = () => setCartOpen(false);

  return (
    <div className={`fixed inset-0 z-[80] ${isCartOpen ? "visible" : "invisible delay-500"}`} inert={!isCartOpen}>
      <div
        className={`absolute inset-0 bg-brand-950/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Your cart</h2>
            <p className="text-xs text-muted">
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            data-fx="icon"
            className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </header>

        {cart.length ? (
          <>
            <div className="border-b border-line bg-white px-5 pb-4">
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <Truck className="size-4 text-brand-600" aria-hidden="true" />
                {remaining > 0 ? (
                  <span>
                    Add <span className="font-semibold text-ink">{formatPrice(remaining)}</span> more for free delivery
                  </span>
                ) : (
                  <span className="font-semibold text-brand-700">You’ve unlocked free delivery</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-gold-500 transition-[width] duration-500"
                  style={{ width: `${Math.min(100, (cartTotal / threshold) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 space-y-3 overflow-y-auto p-5">
              {cart.map((line) => (
                <li key={line.key} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
                  <span
                    className="grid size-16 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${line.accent ?? line.tone} 10%, white)` }}
                  >
                    <ProductArt kind={line.kind} tone={line.tone} accent={line.accent} className="size-12" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug text-ink">{line.name}</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.key)}
                        data-fx="icon-soft"
                        className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${line.name}`}
                      >
                        <Trash className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted">
                      {[line.size ? `Size ${line.size}` : null, line.meta].filter(Boolean).join(" · ") || " "}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full ring-1 ring-line">
                        <button
                          type="button"
                          onClick={() => updateQty(line.key, line.qty - 1)}
                          className="grid size-8 place-items-center rounded-full text-ink-soft hover:bg-surface"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.key, line.qty + 1)}
                          className="grid size-8 place-items-center rounded-full text-ink-soft hover:bg-surface"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="font-heading text-sm font-bold text-ink">{formatPrice(line.price * line.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line bg-white p-5">
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>Subtotal</span>
                <span className="font-heading text-xl font-extrabold text-ink">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Delivery calculated at checkout. Free size exchange within 7 days.</p>
              <button
                type="button"
                onClick={() => notify("Demo store — online checkout isn’t connected yet")}
                data-fx="primary"
                className="mt-4 h-12 w-full rounded-full bg-brand-600 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(11,79,209,0.9)] transition hover:bg-brand-700"
              >
                Checkout · {formatPrice(cartTotal)}
              </button>
              <button
                type="button"
                onClick={close}
                data-fx="secondary"
                className="mt-2 h-11 w-full rounded-full text-sm font-semibold text-ink-soft transition hover:bg-surface"
              >
                Continue shopping
              </button>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
              <ShoppingBag className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 font-heading text-lg font-bold text-ink">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">Use the School Kit Finder to get your child’s full list in two clicks.</p>
            <a
              href="#schools"
              onClick={close}
              data-fx="primary"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Find my school kit
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
