"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";

type SpacePerspective = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  area: string;
  description: string;
  materials: string;
  capacity: string;
  image: string;
};

const SPACES: SpacePerspective[] = [
  {
    id: "mezzanine",
    index: "01",
    title: "The Upper Mezzanine",
    subtitle: "Quiet Seating & Reading Room",
    area: "Second Floor Loft",
    description:
      "A peaceful timber retreat tucked above the main floor, bathed in soft north-facing light with acoustic wool felt and low bespoke oak reading tables.",
    materials: "Fluted White Oak · Natural Wool Felt · Belgian Linen",
    capacity: "18 Covers",
    image: "/images/gallery/interior-loft.jpg",
  },
  {
    id: "long-bar",
    index: "02",
    title: "The Long Terrazzo Bar",
    subtitle: "Espresso Calibration & Counter Seating",
    area: "Ground Level Bar",
    description:
      "A continuous sixteen-metre monolithic counter where guests sit face-to-face with the baristas, watching lever extractions in real time.",
    materials: "Honed Carrara Marble · Hand-Beaten Brass · Solid Walnut",
    capacity: "12 Counter Stools",
    image: "/images/gallery/interior-bikes.jpg",
  },
  {
    id: "solarium",
    index: "03",
    title: "The Window Solarium",
    subtitle: "Morning Sun & Botanical Bench",
    area: "Streetfront Alcove",
    description:
      "Framed by full-height crittall steel windows overlooking Broome Street in SoHo, New York, surrounded by potted ficus trees and custom terracotta planter boxes.",
    materials: "Crittall Steel · Cast Bronze · Natural Terracotta",
    capacity: "8 Bench Seats",
    image: "/images/gallery/lattes-plants.jpg",
  },
  {
    id: "pour-bar",
    index: "04",
    title: "The Hand-Pour Station",
    subtitle: "Single-Origin Manual Filtration",
    area: "Central Coffee Bar",
    description:
      "Dedicated exclusively to pour-overs, siphons, and blind cupping sessions. Calibrated with custom mineralized water stations.",
    materials: "Brushed Copper · Ceramic Drippers · Olive Wood",
    capacity: "Standing & Flight Tasting",
    image: "/images/gallery/pour-milk.jpg",
  },
  {
    id: "cold-cellar",
    index: "05",
    title: "The Cold Brew Library",
    subtitle: "Oak Barrel Infusion & Slow Extraction",
    area: "Sub-Level Cellar",
    description:
      "Where limited reserve batches steep for eighteen hours before aging in French oak barrels. Served over single crystal ice blocks.",
    materials: "Charred French Oak · Dark Granite · Smoked Glass",
    capacity: "Private Tasting Flights",
    image: "/images/gallery/iced.jpg",
  },
  {
    id: "vitrine",
    index: "06",
    title: "The Pastry Display",
    subtitle: "Morning Pastries & Fresh Bakes",
    area: "Entrance & Bakery",
    description:
      "Laminated doughs and seasonal pastries baked fresh before dawn by our resident pastry chef, presented on chilled marble counters.",
    materials: "Chilled White Marble · Ultra-Clear Glass",
    capacity: "Daily Micro-Batch Selection",
    image: "/images/gallery/cake.jpg",
  },
];

const MATERIALITY_SPECS = [
  "40 Covers Capacity",
  "Honed Carrara Marble",
  "Fluted White Oak",
  "North-Facing Light",
  "Acoustic Wool Felt",
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentSpace = SPACES[selectedIndex];

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setSelectedIndex((i) => (i + 1) % SPACES.length);
      if (e.key === "ArrowLeft") setSelectedIndex((i) => (i - 1 + SPACES.length) % SPACES.length);
    };
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#FFF9F2] py-36 max-lg:py-28 max-sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-8 sm:px-12 lg:px-16">
        {/* ── Editorial Header with Generous Whitespace ────────── */}
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow align="center">Space & Architecture · New York, USA</Eyebrow>

          <h2
            data-reveal="up"
            className="mt-6 font-display text-[clamp(2.4rem,4.8vw,4.8rem)] font-medium leading-[1.06] tracking-[-0.015em] text-[#1C130D]"
          >
            An intentional sanctuary,{" "}
            <em className="font-serif italic font-normal text-[#966A3B]">crafted</em> for slow
            mornings &amp; unhurried conversation.
          </h2>

          <p
            data-reveal="up"
            className="mx-auto mt-6 max-w-[58ch] text-base leading-relaxed text-[#5C493B] sm:text-lg"
          >
            Forty covers across two floors, a sixteen-metre marble bar, and an
            understated mezzanine that stays tranquil even during Saturday rush.
          </p>

          {/* Minimalist Materiality Specs Strip */}
          <div
            data-reveal="up"
            className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5"
          >
            {MATERIALITY_SPECS.map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-[#E8DCCF] bg-white px-4 py-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#8C5F32] shadow-[0_2px_8px_-2px_rgba(28,19,13,0.04)]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* ── Cinematic Focal Stage (Selected Perspective) ─────── */}
        <div data-reveal="scale" className="mt-16 sm:mt-20">
          <div className="overflow-hidden rounded-3xl border border-[#E8DCCF] bg-white p-3 sm:p-5 shadow-[0_24px_55px_-18px_rgba(28,19,13,0.08)]">
            {/* Focal Viewport */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-2xl bg-[#F6ECE0] max-sm:aspect-[4/3]"
            >
              <Image
                src={currentSpace.image}
                alt={currentSpace.title}
                fill
                priority
                sizes="(max-width: 1440px) 95vw, 1360px"
                className="object-cover transition-transform duration-1000 ease-[var(--ease-silk)] group-hover:scale-[1.03]"
              />

              {/* Top Meta Badges */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7">
                <span className="rounded-full border border-white/40 bg-white/80 px-4 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#1C130D] shadow-sm backdrop-blur-md">
                  N° {currentSpace.index} / 06 · {currentSpace.area}
                </span>

                <button
                  type="button"
                  aria-label="Expand image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/80 text-[#1C130D] shadow-sm backdrop-blur-md transition-transform duration-300 hover:scale-105"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              </div>

              {/* Subtle hover trigger cue */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#1C130D] shadow-md backdrop-blur-sm">
                  Click to inspect full view
                </span>
              </div>
            </div>

            {/* Spatial Narrative Bar */}
            <div className="mt-4 flex flex-col justify-between gap-6 rounded-2xl border border-[#E8DCCF]/70 bg-[#FAF5EE] p-6 sm:p-8 lg:flex-row lg:items-center">
              <div className="max-w-3xl space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8C5F32]">
                    Perspective {currentSpace.index}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#BA8F60]" />
                  <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#7A695C]">
                    {currentSpace.capacity}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-medium text-[#1C130D] sm:text-3xl">
                  {currentSpace.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5C493B] sm:text-base">
                  {currentSpace.description}
                </p>
                <p className="pt-1 font-sans text-[0.7rem] uppercase tracking-[0.16em] text-[#8A796C]">
                  Materiality:{" "}
                  <span className="font-medium text-[#1C130D]">{currentSpace.materials}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="rounded-full border border-[#E8DCCF] bg-white px-5 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#1C130D] shadow-sm transition-all hover:border-[#BA8F60] hover:text-[#8C5F32]"
                >
                  Full Scale
                </button>
                <a
                  href="#visit"
                  className="rounded-full bg-[#BA8F60] px-6 py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-white shadow-[0_4px_16px_-2px_rgba(186,143,96,0.4)] transition-all hover:bg-[#A47748]"
                >
                  Reserve Table
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Curated Perspectives Grid with Generous Whitespace ── */}
        <div className="mt-24 sm:mt-28">
          <div className="mb-10 flex items-end justify-between border-b border-[#E8DCCF] pb-5">
            <div>
              <span className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#8C5F32]">
                Curated Perspectives
              </span>
              <p className="mt-1 font-display text-xl italic text-[#1C130D]">
                Select any view to preview the architecture
              </p>
            </div>
            <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#7A695C] max-sm:hidden">
              06 Architectural Angles
            </span>
          </div>

          <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-7">
            {SPACES.map((space, idx) => {
              const isCurrent = idx === selectedIndex;
              return (
                <article
                  key={space.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-400 ${
                    isCurrent
                      ? "border-[#BA8F60] bg-white p-4 shadow-[0_16px_36px_-10px_rgba(186,143,96,0.18)] ring-2 ring-[#BA8F60]/30"
                      : "border-[#E8DCCF] bg-white/70 p-4 hover:border-[#BA8F60]/60 hover:bg-white hover:shadow-[0_12px_28px_-8px_rgba(28,19,13,0.06)]"
                  }`}
                >
                  {/* Image Frame with Clean Ratio */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-[#F6ECE0]">
                    <Image
                      src={space.image}
                      alt={space.title}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-105"
                    />

                    {/* Minimalist selection indicator */}
                    {isCurrent && (
                      <span className="absolute right-3 top-3 rounded-full bg-[#BA8F60] px-3 py-1 font-sans text-[0.58rem] font-medium uppercase tracking-[0.18em] text-white shadow-sm">
                        Active View
                      </span>
                    )}
                  </div>

                  {/* Clean Typographic Caption Under the Photo (NO dark overlay) */}
                  <div className="mt-4 px-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[0.65rem] font-bold tracking-[0.24em] text-[#8C5F32]">
                        N° {space.index}
                      </span>
                      <span className="font-sans text-[0.62rem] uppercase tracking-[0.16em] text-[#7A695C]">
                        {space.area}
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-xl font-medium text-[#1C130D] transition-colors duration-300 group-hover:text-[#8C5F32]">
                      {space.title}
                    </h4>

                    <p className="mt-1 text-xs leading-relaxed text-[#6A5A4D]">
                      {space.subtitle}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E8DCCF]/60 pt-2.5">
                      <span className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-[#8C7A6D]">
                        {space.capacity}
                      </span>
                      <span className="font-sans text-[0.62rem] font-medium text-[#8C5F32] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View Space →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── Refined Reservation Invitation ───────────────────── */}
        <div data-reveal="up" className="mt-20 text-center sm:mt-24">
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#8C5F32]">
            Private Gatherings &amp; Tastings
          </p>
          <p className="mx-auto mt-2 max-w-lg font-display text-2xl italic text-[#1C130D]">
            The mezzanine is available for private tastings, intimate meetings, and studio sessions.
          </p>
          <div className="mt-7 flex justify-center">
            <GoldButton href="#visit" variant="solid">
              Book the mezzanine
            </GoldButton>
          </div>
        </div>
      </div>

      {/* ── High-Resolution Full-Screen Lightbox Modal ─────────── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 p-6 backdrop-blur-lg sm:p-10 animate-in fade-in duration-300"
        >
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white">
            <div>
              <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#BA8F60]">
                Space Perspective {currentSpace.index} / 06
              </span>
              <p className="font-display text-xl italic text-white sm:text-2xl">
                {currentSpace.title}
              </p>
            </div>

            <button
              type="button"
              aria-label="Close fullscreen view"
              onClick={() => setLightboxOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Lightbox Center Image with Prev / Next */}
          <div className="relative mx-auto my-auto flex h-[72vh] w-full max-w-6xl items-center justify-center">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setSelectedIndex((i) => (i - 1 + SPACES.length) % SPACES.length)}
              className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black sm:-left-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={currentSpace.image}
                alt={currentSpace.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => setSelectedIndex((i) => (i + 1) % SPACES.length)}
              className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black sm:-right-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Lightbox Bottom Info */}
          <div className="mx-auto max-w-2xl text-center text-white/80">
            <p className="text-sm leading-relaxed max-sm:text-xs">
              {currentSpace.description}
            </p>
            <p className="mt-2 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#BA8F60]">
              {currentSpace.materials} · {currentSpace.capacity}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

