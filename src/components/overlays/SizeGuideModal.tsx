"use client";

import { RefreshCw, Ruler } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/context/StoreContext";
import { SIZE_GUIDE, type SizeGuideTab } from "@/lib/data";

const TABS = Object.keys(SIZE_GUIDE) as SizeGuideTab[];

export function SizeGuideModal() {
  const { sizeGuideTab, openSizeGuide, closeSizeGuide } = useStore();
  const tab: SizeGuideTab = sizeGuideTab ?? "shirts";
  const guide = SIZE_GUIDE[tab];
  const activeIndex = TABS.indexOf(tab);

  return (
    <Modal
      open={sizeGuideTab !== null}
      onClose={closeSizeGuide}
      title="Uniform size guide"
      subtitle="Measurements in inches, taken over light clothing."
      size="lg"
    >
      <div role="tablist" aria-label="Garment type" className="relative grid grid-cols-3 rounded-full bg-surface p-1">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-full bg-white shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: "calc((100% - 0.5rem) / 3)", transform: `translateX(${activeIndex * 100}%)` }}
        />
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === tab}
            aria-controls="size-guide-panel"
            onClick={() => openSizeGuide(t)}
            className={`relative z-10 h-9 rounded-full text-xs font-semibold transition-colors sm:text-sm ${
              t === tab ? "text-brand-700" : "text-muted hover:text-ink"
            }`}
          >
            {SIZE_GUIDE[t].label}
          </button>
        ))}
      </div>

      <div id="size-guide-panel" role="tabpanel" key={tab} className="mt-5 animate-fade-up">
        <p className="flex gap-2 text-sm text-ink-soft">
          <Ruler className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
          {guide.note}
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[22rem] text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
              <tr>
                {guide.columns.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {guide.rows.map((row) => (
                <tr key={row[0]} className="transition-colors hover:bg-brand-50/50">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-2.5 font-heading font-bold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-2.5 tabular-nums text-ink-soft">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-2xl bg-gold-50 p-4 text-sm text-ink-soft ring-1 ring-gold-200">
        <RefreshCw className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden="true" />
        <span>
          <span className="font-semibold text-ink">Wrong size? Exchange it free.</span> Bring it back within 7 days with
          tags on and receipt, and we’ll swap it on the spot.
        </span>
      </p>
    </Modal>
  );
}
