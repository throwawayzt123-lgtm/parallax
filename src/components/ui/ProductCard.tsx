"use client";

import Image from "next/image";
import { useState } from "react";
import type { MenuItem } from "@/lib/site";
import TiltCard from "@/components/ui/TiltCard";

type Props = {
  item: MenuItem;
  onInspect: (item: MenuItem) => void;
  onReserve: (item: MenuItem) => void;
  onRemoveReserve: (itemId: string) => void;
  reservedCount: number;
};

export default function ProductCard({
  item,
  onInspect,
  onReserve,
  onRemoveReserve,
  reservedCount,
}: Props) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div data-card className="h-full">
      <TiltCard max={4} lift={12}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DCCF] bg-white transition-all duration-500 hover:border-[#BA8F60] hover:shadow-[0_20px_45px_-12px_rgba(50,35,20,0.1)]">
          {/* ── Visual Media ─────────────────────────────────────── */}
          <div className="relative aspect-[16/11] w-full overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#F4EDE3] to-[#ECE0D0]">
            {/* Soft ambient center pedestal glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.75)_0%,transparent_65%)] pointer-events-none" />

            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              className="object-contain p-3.5 drop-shadow-[0_12px_20px_rgba(40,25,15,0.14)] transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-108"
            />

            {/* Top Bar Badges */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
              <span className="rounded-full border border-[#E4D7C5] bg-[#FFF9F2]/95 px-3 py-1 font-sans text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[#5C493B] backdrop-blur-md shadow-sm">
                {item.category}
              </span>

              {/* Minimal Clean Bookmark */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-md shadow-sm ${
                  isFavorited
                    ? "border-[#BA8F60] bg-[#BA8F60] text-white"
                    : "border-[#E4D7C5] bg-white/90 text-[#5C493B] hover:border-[#BA8F60] hover:text-[#BA8F60]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill={isFavorited ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            {/* Bottom Metadata in Image */}
            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between z-10 pointer-events-none">
              <span className="rounded-md border border-[#E8DCCF]/80 bg-[#FFF9F2]/90 px-2.5 py-0.5 text-[0.6rem] font-sans tracking-wide text-[#5C493B] backdrop-blur-md shadow-sm">
                {item.servingTemp}
              </span>
              <span className="rounded-md border border-[#E8DCCF]/80 bg-[#FFF9F2]/90 px-2.5 py-0.5 font-mono text-[0.62rem] text-[#8C5F32] font-semibold backdrop-blur-md shadow-sm">
                {item.cuppingScore}
              </span>
            </div>
          </div>

          {/* ── Content Details ──────────────────────────────────── */}
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            {/* Header: Product Name & Price */}
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl font-medium text-[#1C130D] transition-colors duration-300 group-hover:text-[#8C5F32]">
                {item.name}
              </h3>
              <span className="font-display text-xl font-bold tracking-tight text-[#1C130D]">
                {item.price}
              </span>
            </div>

            {/* Real Coffee Shop Specification / Subtitle */}
            <p className="mt-1 font-display italic text-[0.84rem] tracking-wide text-[#8C5F32]">
              {item.artisanTitle}
            </p>

            {/* Origin & Elevation */}
            <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-[#7A6757] font-sans">
              {item.originTerroir}
            </p>

            {/* Blurb */}
            <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-[#5C493B] line-clamp-2">
              {item.blurb}
            </p>

            {/* Sensory Tasting Notes */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.notes.map((note) => (
                <span
                  key={note}
                  className="inline-flex items-center rounded-md border border-[#BA8F60]/25 bg-[#BA8F60]/10 px-2.5 py-0.5 font-sans text-[0.62rem] tracking-wide text-[#7A5025]"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Roast Intensity & Extraction */}
            <div className="mt-4 flex items-center justify-between border-t border-[#E8DCCF] pt-3 text-[0.65rem] text-[#7A6757]">
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-wider">Roast</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <span
                      key={lvl}
                      className={`h-1.5 w-1.5 rounded-full ${
                        lvl <= item.roastIntensity
                          ? "bg-[#BA8F60]"
                          : "bg-[#E5D7C7]"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="font-sans text-[0.62rem] text-[#7A6757]">
                {item.extractionRatio}
              </span>
            </div>

            {/* ── Actions ────────────────────────────────────────── */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E8DCCF] pt-4">
              <button
                type="button"
                onClick={() => onInspect(item)}
                className="flex items-center gap-1.5 rounded-full border border-[#BA8F60]/35 px-3.5 py-2 font-sans text-[0.62rem] uppercase tracking-[0.16em] text-[#5C493B] transition-colors duration-300 hover:border-[#BA8F60] hover:bg-[#BA8F60]/10 hover:text-[#1C130D]"
              >
                <span>Tasting Notes</span>
                <svg className="h-3 w-3 text-[#8C5F32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {reservedCount === 0 ? (
                <button
                  type="button"
                  onClick={() => onReserve(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#BA8F60] px-4 py-2 font-sans text-[0.64rem] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#A47748] active:scale-[0.98] shadow-sm"
                >
                  <span>Reserve</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              ) : (
                <div className="flex flex-1 items-center justify-between rounded-full border border-[#BA8F60]/30 bg-[#BA8F60]/10 px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => onRemoveReserve(item.id)}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#7A5025] hover:bg-[#BA8F60]/20 transition-colors text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="font-sans text-[0.62rem] uppercase tracking-wider text-[#7A5025] font-semibold">
                    {reservedCount} at table
                  </span>
                  <button
                    type="button"
                    onClick={() => onReserve(item)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BA8F60] text-white hover:bg-[#A47748] transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </div>
  );
}
