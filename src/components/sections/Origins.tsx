"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import { ORIGINS } from "@/lib/site";

/** A dark parallax band that lets the page breathe between the busy sections. */
export default function Origins() {
  const root = useRef<HTMLElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);

  const ready = useLazyMotion(root);

  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return;

      /* The quote lights up word by word as it crosses the viewport. */
      const split = new SplitText(quote.current, { type: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: quote.current,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.7,
          },
        },
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[82vh] items-center overflow-hidden bg-[#FFF9F2] py-32 max-lg:py-24 max-sm:min-h-0 max-sm:py-20"
    >
      {/* Parallax ground with warm cream veil */}
      <div aria-hidden className="absolute inset-0 -top-[12%] h-[124%] opacity-25" data-speed="0.8">
        <Image
          src="/images/story/beans-slate.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[#FFF9F2]/85" />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        <Eyebrow align="center">Direct Trade · Four Countries</Eyebrow>

        <p
          ref={quote}
          className="mx-auto mt-12 max-w-[22ch] text-center font-display text-[clamp(2rem,4.6vw,4.4rem)] font-medium italic leading-[1.12] text-[#1C130D] max-sm:mt-8"
        >
          We know every farm by name, and every farmer knows ours.
        </p>

        <div
          data-reveal-group
          className="mt-16 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:mt-12 max-sm:grid-cols-1"
        >
          {ORIGINS.map((o) => (
            <div
              key={o.country}
              data-reveal-item
              className="group rounded-2xl border border-[#E8DCCF] bg-white/95 backdrop-blur-sm p-7 shadow-[0_12px_30px_-10px_rgba(28,19,13,0.06)] transition-all duration-300 hover:border-[#BA8F60] hover:-translate-y-1 max-sm:p-6"
            >
              <p className="font-display text-3xl font-medium text-[#1C130D] transition-colors duration-300 group-hover:text-[#8C5F32] max-sm:text-2xl">
                {o.country}
              </p>
              <p className="mt-1.5 font-sans text-[0.68rem] uppercase tracking-[0.2em] font-semibold text-[#8C5F32]">
                {o.region}
              </p>
              <div className="mt-6 space-y-2.5 border-t border-[#E8DCCF] pt-5">
                <p className="flex justify-between text-[0.78rem] text-[#7A695C]">
                  <span>Altitude</span>
                  <span className="text-[#1C130D] font-mono text-[0.75rem] font-medium">{o.altitude}</span>
                </p>
                <p className="flex justify-between text-[0.78rem] text-[#7A695C]">
                  <span>Process</span>
                  <span className="text-[#1C130D] font-medium">{o.process}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
