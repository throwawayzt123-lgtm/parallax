"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { MenuItem } from "@/lib/site";

type Props = {
  item: MenuItem | null;
  onClose: () => void;
  onReserve: (item: MenuItem) => void;
  isReserved: boolean;
};

export default function TastingModal({
  item,
  onClose,
  onReserve,
  isReserved,
}: Props) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tasting-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E8DCCF] bg-[#FFF9F2] p-6 text-[#1C130D] shadow-2xl sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close tasting sheet"
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#E4D7C5] bg-white text-[#5C493B] transition-colors duration-200 hover:border-[#BA8F60] hover:text-[#1C130D]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tasting Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BA8F60]/30 bg-[#BA8F60]/10 px-3.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#7A5025]">
            {item.edition} · {item.cuppingScore}
          </span>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-[#7A6757]">
            House Tasting Profile
          </p>
          <h3
            id="tasting-modal-title"
            className="mt-1 font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1C130D]"
          >
            {item.name}
          </h3>
          <p className="font-display italic text-base text-[#8C5F32]">
            {item.artisanTitle}
          </p>
        </div>

        {/* Dual Column Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
          {/* Left Column: Image & Terroir */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl border border-[#E8DCCF] bg-gradient-to-b from-[#FAF4EC] via-[#F4EDE3] to-[#ECE0D0]">
              {/* Soft ambient center glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.75)_0%,transparent_65%)] pointer-events-none" />

              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-contain p-5 drop-shadow-[0_14px_24px_rgba(40,25,15,0.14)]"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.68rem] font-sans pointer-events-none">
                <span className="rounded-md bg-[#FFF9F2]/95 px-2.5 py-1 text-[#5C493B] border border-[#E8DCCF]/80 backdrop-blur-md shadow-sm font-medium">
                  {item.servingTemp}
                </span>
                <span className="font-display text-lg font-bold text-[#1C130D] rounded-md bg-[#FFF9F2]/95 px-2.5 py-0.5 border border-[#E8DCCF]/80 shadow-sm backdrop-blur-md">
                  {item.price}
                </span>
              </div>
            </div>

            {/* Terroir & Origin Tag */}
            <div className="mt-3.5 w-full rounded-lg border border-[#E8DCCF] bg-white p-3 text-center shadow-sm">
              <span className="block text-[0.58rem] uppercase tracking-[0.2em] text-[#7A6757]">
                Origin & Farm Location
              </span>
              <span className="mt-0.5 block font-sans text-[0.78rem] text-[#1C130D] font-medium">
                {item.originTerroir}
              </span>
            </div>
          </div>

          {/* Right Column: Flavor Profile & Extraction Details */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Blurb */}
            <p className="text-[0.88rem] leading-relaxed text-[#5C493B]">
              {item.blurb}
            </p>

            {/* Aromatic Notes */}
            <div>
              <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-[#7A6757] mb-2">
                Aromatic Notes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.notes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center rounded-md border border-[#BA8F60]/25 bg-[#BA8F60]/10 px-2.5 py-1 text-[0.66rem] tracking-wide text-[#7A5025]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sensory Spectrum Bars */}
            <div className="rounded-xl border border-[#E8DCCF] bg-white p-4 space-y-2.5 shadow-sm">
              <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-[#7A6757] mb-1">
                Sensory Balance
              </span>
              {(
                [
                  ["Sweetness", item.flavorProfile.sweetness],
                  ["Acidity", item.flavorProfile.acidity],
                  ["Body & Texture", item.flavorProfile.body],
                  ["Aroma & Finish", item.flavorProfile.aroma],
                ] as const
              ).map(([label, score]) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-[0.7rem] text-[#5C493B] font-sans w-28">{label}</span>
                  <div className="flex-1 mx-3 h-1.5 rounded-full bg-[#EADBCC] overflow-hidden">
                    <div
                      className="h-full bg-[#BA8F60] rounded-full transition-all duration-500"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[0.66rem] text-[#7A6757] font-mono">{score}/5</span>
                </div>
              ))}
            </div>

            {/* Pairing Recommendation */}
            <div className="rounded-xl border border-[#E8DCCF] bg-white p-3 flex items-start gap-3 shadow-sm">
              <span className="text-[#BA8F60] text-sm leading-none mt-0.5">•</span>
              <div>
                <span className="block text-[0.56rem] uppercase tracking-[0.18em] text-[#7A6757]">
                  Recommended Food Pairing
                </span>
                <p className="mt-0.5 text-[0.82rem] text-[#1C130D]">
                  {item.pairing}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-7 pt-4 border-t border-[#E8DCCF] flex items-center justify-between gap-4 max-sm:flex-col">
          <div className="text-[0.72rem] text-[#7A6757]">
            Extraction: <span className="text-[#1C130D] font-medium">{item.extractionRatio}</span>
          </div>

          <button
            onClick={() => onReserve(item)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.18em] font-medium transition-all duration-300 ${
              isReserved
                ? "border border-[#BA8F60]/50 bg-[#BA8F60]/15 text-[#7A5025]"
                : "bg-[#BA8F60] text-white hover:bg-[#A47748] shadow-sm"
            }`}
          >
            {isReserved ? "Reserved for Table" : `Reserve Experience (${item.price})`}
          </button>
        </div>
      </div>
    </div>
  );
}
