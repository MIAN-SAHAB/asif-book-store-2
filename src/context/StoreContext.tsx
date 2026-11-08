"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CartLineInput, SchoolId } from "@/lib/types";
import type { SizeGuideTab } from "@/lib/data";

interface Toast {
  id: number;
  message: string;
}

interface StoreState {
  /** True once the preloader has finished and the page is revealed. */
  isReady: boolean;
  markReady: () => void;

  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartLineInput, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  sizeGuideTab: SizeGuideTab | null;
  openSizeGuide: (tab?: SizeGuideTab) => void;
  closeSizeGuide: () => void;

  isTrackOpen: boolean;
  setTrackOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  isAccountOpen: boolean;
  setAccountOpen: (open: boolean) => void;

  /** School filter shared by the finder and both catalogs. */
  schoolFilter: SchoolId | "all";
  setSchoolFilter: (id: SchoolId | "all") => void;

  toast: Toast | null;
  notify: (message: string) => void;

  /** Product briefly highlighted after picking it from search. */
  focusedProductId: string | null;
  focusProduct: (id: string) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const lineKey = (productId: string, size?: string) => (size ? `${productId}__${size}` : productId);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isReady, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<SizeGuideTab | null>(null);
  const [isTrackOpen, setTrackOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [schoolFilter, setSchoolFilter] = useState<SchoolId | "all">("all");
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [focusedProductId, setFocusedProductId] = useState<string | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusProduct = useCallback((id: string) => {
    if (focusTimer.current) clearTimeout(focusTimer.current);
    setFocusedProductId(id);
    // Wait for catalogs to re-render with the product visible, then bring it into view.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(`product-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }),
    );
    focusTimer.current = setTimeout(() => setFocusedProductId(null), 3200);
  }, []);

  const notify = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (item: CartLineInput, qty = 1) => {
      const key = lineKey(item.productId, item.size);
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { ...item, key, qty }];
      });
      notify(`Added ${item.name}${item.size ? ` · Size ${item.size}` : ""}`);
    },
    [notify],
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const markReady = useCallback(() => setReady(true), []);
  const openSizeGuide = useCallback((tab: SizeGuideTab = "shirts") => setSizeGuideTab(tab), []);
  const closeSizeGuide = useCallback(() => setSizeGuideTab(null), []);

  const value = useMemo<StoreState>(() => {
    const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
    const cartTotal = cart.reduce((sum, l) => sum + l.qty * l.price, 0);
    return {
      isReady,
      markReady,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      isCartOpen,
      setCartOpen,
      sizeGuideTab,
      openSizeGuide,
      closeSizeGuide,
      isTrackOpen,
      setTrackOpen,
      isSearchOpen,
      setSearchOpen,
      isAccountOpen,
      setAccountOpen,
      schoolFilter,
      setSchoolFilter,
      toast,
      notify,
      focusedProductId,
      focusProduct,
    };
  }, [
    isReady,
    markReady,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    isCartOpen,
    sizeGuideTab,
    openSizeGuide,
    closeSizeGuide,
    isTrackOpen,
    isSearchOpen,
    isAccountOpen,
    schoolFilter,
    toast,
    notify,
    focusedProductId,
    focusProduct,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
