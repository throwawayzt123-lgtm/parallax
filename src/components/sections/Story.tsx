"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import { BRAND, STATS } from "@/lib/site";

type StoryChapter = {
  index: string;
  tag: string;
  title: string;
  quote: string;
  body1: string;
  body2: string;
  image: string;
  imageAlt: string;
  location: string;
  meta: string;
};

const CHAPTERS: StoryChapter[] = [
  {
    index: "01",
    tag: "The Foundation",
    title: "A Nine-Metre Room & A Lever Machine",
    quote: "Coffee is a quiet craft, not a rushed transaction.",
    body1:
      "PARALLAX began in 2016 in a sunlit loft on Broome Street, SoHo, New York. We had one second-hand Italian spring-lever machine, two sacks of Ethiopian heirloom beans, and an unwavering idea: that a proper cup of coffee deserves patience, precision, and an unhurried room.",
    body2:
      "We turned away automated batch brewers. Every extraction was pulled entirely by hand, listening to the boiler pressure, measuring every dose to the tenth of a gram, and refusing to rush even during the busiest morning hours.",
    image: "/images/story/pour-over.jpg",
    imageAlt: "Barista hand-filtering a single-origin pour over",
    location: "Broome St, SoHo · 2016",
    meta: "Hand-pulled lever extractions",
  },
  {
    index: "02",
    tag: "Direct Provenance",
    title: "Eleven Family Farms, Zero Middlemen",
    quote: "We know every farmer by name, and every farmer knows ours.",
    body1:
      "Rather than buying through opaque commodity brokers, we contract directly with eleven family-run smallholders across Colombia, Ethiopia, Kenya, and Guatemala. We pay between two and three times the commodity rate to guarantee fair living wages.",
    body2:
      "Every single lot is shipped in hermetic GrainPro bags, and our roasters cup each arrival blind three times before a single bean is cleared for service. If a harvest does not meet our 88+ speciality benchmark, we never serve it.",
    image: "/images/craft/source.jpg",
    imageAlt: "Freshly harvested coffee cherries held in hands at source farm",
    location: "Direct Origin Partnerships · 4 Continents",
    meta: "100% Direct Trade · 2.5× Commodity Pay",
  },
  {
    index: "03",
    tag: "The Morning Ritual",
    title: "Roasted Daily Before the City Wakes",
    quote: "What reaches your porcelain cup was still green yesterday.",
    body1:
      "At 5:30 AM each morning, well before New York opens its doors, our head roasters fire up the twelve-kilo cast-iron drum. We roast in ultra-small batches, profiling each origin by ear, smell, and crack progression rather than relying on computer presets.",
    body2:
      "We aim for clarity, sweetness, and terroir preservation rather than bitter caramelisation. After roasting, beans are rested precisely for degassing, paired with remineralised water, and served at exact cupping temperatures.",
    image: "/images/craft/roast.jpg",
    imageAlt: "Small-batch drum roasting fresh coffee beans",
    location: "The SoHo Roastery · New York, USA",
    meta: "Small-batch 12kg Cast-Iron Drum",
  },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const seal = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const ready = useLazyMotion(root);
  const currentChapter = CHAPTERS[activeChapter];

  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return;

      /* Line-by-line rise for headline */
      const split = new SplitText(heading.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.from(split.lines, {
        yPercent: 118,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: heading.current, start: "top 85%", once: true },
      });

      /* Slow rotational drift for stamp seal */
      if (seal.current) {
        gsap.to(seal.current, {
          rotate: 360,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* Counting the ledger figures up as they arrive */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.countSuffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString() + suffix;
          },
        });
      });

      ScrollTrigger.refresh();
      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="story"
      className="relative overflow-hidden bg-[#FFF9F2] py-36 max-lg:py-28 max-sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-8 sm:px-12 lg:px-16">
        {/* ── Editorial Header with Generous Whitespace ────────── */}
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow align="center">Our Heritage · Founded 2016</Eyebrow>

          <h2
            ref={heading}
            className="mt-6 font-display text-[clamp(2.4rem,4.8vw,4.8rem)] font-medium leading-[1.05] tracking-[-0.015em] text-[#1C130D]"
          >
            Crafted for the{" "}
            <em className="font-serif italic font-normal text-[#966A3B]">quiet</em> hours
            between everything else.
          </h2>

          <p
            data-reveal="up"
            className="mx-auto mt-6 max-w-[58ch] text-base leading-relaxed text-[#5C493B] sm:text-lg"
          >
            We started with one second-hand lever machine and a stubborn belief:
            that coffee is a human craft, not a rushed transaction.
          </p>

          {/* Interactive Chapter Selector Pills */}
          <div
            data-reveal="up"
            className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {CHAPTERS.map((chap, idx) => {
              const active = idx === activeChapter;
              return (
                <button
                  key={chap.index}
                  type="button"
                  onClick={() => setActiveChapter(idx)}
                  className={`rounded-full px-5 py-2.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                    active
                      ? "bg-[#BA8F60] text-white shadow-[0_4px_14px_-2px_rgba(186,143,96,0.4)]"
                      : "border border-[#E8DCCF] bg-white text-[#5C493B] hover:border-[#BA8F60]/60 hover:text-[#1C130D]"
                  }`}
                >
                  Chapter {chap.index} · {chap.tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── The Master Craftsman's Diptych ────────────────────── */}
        <div className="mt-16 sm:mt-20 grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Archival Photography Frame */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#E8DCCF] bg-white p-3 sm:p-4 shadow-[0_24px_55px_-18px_rgba(28,19,13,0.08)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F6ECE0] sm:aspect-[16/11]">
                <Image
                  key={currentChapter.image}
                  src={currentChapter.image}
                  alt={currentChapter.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 45vw"
                  className="object-cover transition-all duration-700 ease-[var(--ease-silk)]"
                />

                {/* Top Archival Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="rounded-full border border-white/40 bg-white/85 px-3.5 py-1 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#1C130D] shadow-sm backdrop-blur-md">
                    Archive N° {currentChapter.index} · {currentChapter.location}
                  </span>
                </div>

                {/* Subtle bottom gradient for image readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                {/* Bottom Meta */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-white/90">
                    {currentChapter.meta}
                  </span>
                </div>
              </div>

              {/* Rotating Artisanal Seal Stamp */}
              <div
                ref={seal}
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 max-sm:hidden"
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path
                      id="stamp-path"
                      d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                      fill="none"
                    />
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="27"
                    fill="#FFF9F2"
                    stroke="#BA8F60"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                  <text
                    fill="#8C5F32"
                    fontSize="7"
                    letterSpacing="2.2"
                    className="font-sans uppercase font-semibold"
                  >
                    <textPath href="#stamp-path" startOffset="0">
                      · Pure Human Craft · Small Batch ·
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Right: The Human Craftsman's Manifesto */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-[#E8DCCF] bg-white p-8 sm:p-10 shadow-[0_20px_45px_-15px_rgba(28,19,13,0.06)]">
              <div className="flex items-center gap-3">
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8C5F32]">
                  Chapter {currentChapter.index}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#BA8F60]" />
                <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#7A695C]">
                  {currentChapter.tag}
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-medium text-[#1C130D] leading-tight">
                {currentChapter.title}
              </h3>

              {/* Artisanal Quote Callout */}
              <div className="mt-5 border-l-2 border-[#BA8F60] pl-4 py-1">
                <p className="font-display italic text-lg text-[#3B2A1E]">
                  &ldquo;{currentChapter.quote}&rdquo;
                </p>
              </div>

              {/* Narrative Story */}
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#5C493B]">
                {currentChapter.body1}
              </p>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#7A695C]">
                {currentChapter.body2}
              </p>

              {/* Craftsman Guarantee Signature Line */}
              <div className="mt-8 flex items-center justify-between border-t border-[#E8DCCF] pt-6">
                <div>
                  <span className="block font-sans text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[#8C5F32]">
                    Craftsman Guarantee
                  </span>
                  <p className="mt-0.5 font-display text-base italic text-[#1C130D]">
                    {BRAND.name} Roasting Guild · New York, USA
                  </p>
                </div>

                <GoldButton href="#craft" variant="ghost">
                  See how we work
                </GoldButton>
              </div>
            </div>
          </div>
        </div>

        {/* ── The Master Craftsman's Ledger ────────────────────── */}
        <div
          data-reveal-group
          className="mt-20 sm:mt-24 rounded-3xl border border-[#E8DCCF] bg-white p-8 sm:p-10 shadow-[0_20px_45px_-15px_rgba(28,19,13,0.06)]"
        >
          <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-8 divide-x divide-[#E8DCCF] max-lg:divide-x-0">
            {STATS.map((s, i) => {
              const numeric = s.value.replace(/[^0-9]/g, "");
              const suffix = s.value.replace(/[0-9]/g, "");
              const labels = [
                "Founded in SoHo, New York, USA",
                "Direct-trade family farms",
                "Certified Q-Graders on bar",
                "Speciality cupping grade benchmark",
              ];
              return (
                <div
                  key={s.label}
                  data-reveal-item
                  className={`${i !== 0 ? "lg:pl-8" : ""} space-y-1.5`}
                >
                  <p className="font-display text-4xl sm:text-5xl font-medium leading-none text-[#1C130D]">
                    <span data-count={numeric} data-count-suffix={suffix}>
                      {s.value}
                    </span>
                  </p>
                  <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8C5F32]">
                    {s.label}
                  </p>
                  <p className="text-xs text-[#7A695C] leading-normal pt-1">
                    {labels[i]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

