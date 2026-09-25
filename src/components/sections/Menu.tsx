"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import ProductCard from "@/components/ui/ProductCard";
import TastingModal from "@/components/ui/TastingModal";
import { MENU, MENU_CATEGORIES, type MenuCategory, type MenuItem } from "@/lib/site";

export default function Menu() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<MenuCategory | "All">("All");

  // State for tasting modal and table reservations
  const [inspectingItem, setInspectingItem] = useState<MenuItem | null>(null);
  const [reservedItems, setReservedItems] = useState<Record<string, number>>({});
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  const items = MENU.filter((m) => filter === "All" || m.category === filter);

  // Reservation Handlers
  const handleReserve = (item: MenuItem) => {
    setReservedItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    setOrderNotice(`Reserved "${item.name}" for your table flight.`);
    setTimeout(() => setOrderNotice(null), 3500);
  };

  const handleRemoveReserve = (itemId: string) => {
    setReservedItems((prev) => {
      const next = { ...prev };
      if (next[itemId] > 1) {
        next[itemId] -= 1;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const totalReservedCount = Object.values(reservedItems).reduce((sum, count) => sum + count, 0);

  const totalReservedPrice = Object.entries(reservedItems).reduce((sum, [id, count]) => {
    const item = MENU.find((m) => m.id === id);
    if (!item) return sum;
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return sum + priceNum * count;
  }, 0);

  /* Cards fly in on first sight, and re-deal whenever the filter changes. */
  const ready = useLazyMotion(root);

  useGSAP(
    () => {
      if (!ready) return;
      if (!grid.current || prefersReducedMotion()) return;
      const cards = grid.current.querySelectorAll("[data-card]");

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: grid.current, start: "top 85%" },
        },
      );
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [filter, ready] },
  );

  return (
    <section
      ref={root}
      id="menu"
      className="relative overflow-hidden bg-[#FFF9F2] py-36 max-lg:py-28 max-sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-12 max-lg:flex-col max-lg:items-start max-lg:gap-8">
          <div>
            <Eyebrow>The House Collection</Eyebrow>
            <h2
              data-reveal="up"
              className="mt-6 max-w-[20ch] font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.015em] text-[#1C130D]"
            >
              Single origin pours, <em className="text-[#966A3B] italic">crafted</em> for slow mornings.
            </h2>
          </div>
          <p
            data-reveal="up"
            className="max-w-[42ch] pb-3 leading-relaxed text-[#6A5A4D] max-sm:text-[0.93rem]"
          >
            A bespoke selection roasted daily in micro-batches. Calibrated against
            daylight refractometer curves, served at precise tasting temperatures,
            and paired with fresh artisan pastries.
          </p>
        </div>

        {/* ── Clean Modern Filters & Flight Status ───────────────── */}
        <div
          data-reveal="fade"
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DCCF] pb-6 max-sm:mt-10"
        >
          <div className="flex flex-wrap items-center gap-2">
            {MENU_CATEGORIES.map((c) => {
              const active = c === filter;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-5 py-2 font-sans text-[0.66rem] uppercase tracking-[0.2em] font-medium transition-all duration-300 max-sm:px-4 max-sm:py-1.5 max-sm:text-[0.6rem] ${
                    active
                      ? "bg-[#BA8F60] text-white shadow-sm"
                      : "border border-[#E8DCCF] bg-white text-[#5C493B] hover:border-[#BA8F60]/50 hover:text-[#1C130D]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#7A695C] max-sm:w-full max-sm:justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BA8F60]" />
              {items.length} Offerings
            </span>
            {totalReservedCount > 0 && (
              <span className="rounded-full border border-[#BA8F60]/30 bg-[#BA8F60]/10 px-3 py-1 font-medium text-[#7A5025]">
                Table Flight: {totalReservedCount} items (£{totalReservedPrice.toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* ── Product Cards Grid ───────────────────────────────── */}
        <div
          ref={grid}
          className="mt-12 grid grid-cols-3 gap-8 max-xl:gap-6 max-lg:grid-cols-2 max-sm:mt-10 max-sm:grid-cols-1 max-sm:gap-6"
        >
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onInspect={(selected) => setInspectingItem(selected)}
              onReserve={handleReserve}
              onRemoveReserve={handleRemoveReserve}
              reservedCount={reservedItems[item.id] || 0}
            />
          ))}
        </div>

        {/* ── Table Flight Notification Toast ────────────────────── */}
        {orderNotice && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-full border border-[#BA8F60]/30 bg-white px-5 py-2.5 text-xs text-[#1C130D] shadow-[0_16px_36px_rgba(28,19,13,0.12)] animate-in fade-in slide-in-from-bottom-5 duration-300"
          >
            <span className="text-[#BA8F60] text-xs font-bold">•</span>
            <span>{orderNotice}</span>
            <button
              onClick={() => setOrderNotice(null)}
              className="ml-2 text-[#7A695C] hover:text-[#1C130D]"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </aside>
        )}

        {/* ── Tasting Flight Floating Action Bar (When items reserved) ─── */}
        {totalReservedCount > 0 && (
          <div className="mt-12 mx-auto max-w-xl rounded-2xl border border-[#E8DCCF] bg-white p-5 text-center shadow-[0_18px_45px_rgba(28,19,13,0.08)]">
            <div className="flex items-center justify-between gap-4 max-sm:flex-col">
              <div className="text-left max-sm:text-center">
                <span className="block text-[0.6rem] uppercase tracking-[0.2em] font-semibold text-[#8C5F32]">
                  Tasting Flight Configured
                </span>
                <span className="font-display text-lg text-[#1C130D]">
                  {totalReservedCount} {totalReservedCount === 1 ? "Item" : "Items"} · £{totalReservedPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReservedItems({})}
                  className="rounded-full border border-[#E8DCCF] px-3.5 py-1.5 text-[0.62rem] uppercase tracking-wider text-[#5C493B] transition-colors hover:border-[#BA8F60]/50 hover:text-[#1C130D]"
                >
                  Reset
                </button>
                <a
                  href="#visit"
                  className="rounded-full bg-[#BA8F60] hover:bg-[#A47748] px-5 py-2 font-sans text-[0.64rem] font-medium uppercase tracking-[0.18em] text-white shadow-sm transition-all"
                >
                  Reserve Table
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer CTA ──────────────────────────────────────── */}
        <div data-reveal="up" className="mt-16 flex justify-center max-sm:mt-12">
          <GoldButton href="#visit">Explore the seasonal card</GoldButton>
        </div>
      </div>

      {/* ── Royal Sensory Tasting Modal ────────────────────────── */}
      <TastingModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onReserve={(item) => handleReserve(item)}
        isReserved={inspectingItem ? (reservedItems[inspectingItem.id] || 0) > 0 : false}
      />
    </section>
  );
}
