"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import { TESTIMONIALS } from "@/lib/site";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const slide = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  /* Auto-advance, paused while the pointer rests on the card. */
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      6500,
    );
    return () => clearInterval(id);
  }, [paused]);

  useGSAP(
    () => {
      if (!slide.current || prefersReducedMotion()) return;
      gsap.fromTo(
        slide.current.children,
        { y: 26, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.07,
        },
      );
    },
    { dependencies: [index] },
  );

  const t = TESTIMONIALS[index];

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[#FFF9F2] py-36 max-lg:py-28 max-sm:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1100px] px-12 text-center max-lg:px-8 max-sm:px-5">
        <Eyebrow align="center">Kind Words</Eyebrow>

        {/* Oversized quotation mark */}
        <p
          aria-hidden
          data-reveal="fade"
          className="mt-10 select-none font-display text-[7rem] leading-[0.4] text-[#BA8F60]/30 max-sm:text-[5rem]"
        >
          &ldquo;
        </p>

        <div
          ref={slide}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-10 max-sm:mt-8"
        >
          <blockquote className="mx-auto max-w-[26ch] font-display text-[clamp(1.6rem,3.1vw,2.9rem)] font-medium italic leading-[1.28] text-[#1C130D]">
            {t.quote}
          </blockquote>

          <div className="mt-10 flex flex-col items-center gap-1 max-sm:mt-8">
            <span className="rule-gold mb-6 w-16" />
            <p className="font-sans text-[0.8rem] font-medium uppercase tracking-[0.22em] text-[#1C130D]">
              {t.name}
            </p>
            <p className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#8C5F32]">
              {t.role}
            </p>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 w-12 origin-left rounded-full transition-[transform,background-color] duration-500 ease-[var(--ease-silk)] ${
                i === index
                  ? "scale-x-100 bg-[#BA8F60]"
                  : "scale-x-[0.42] bg-[#E8DCCF] hover:bg-[#BA8F60]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
