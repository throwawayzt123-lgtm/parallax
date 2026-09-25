"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import { CRAFT_STEPS } from "@/lib/site";

/**
 * The set piece: on desktop the four stages are pinned and dragged sideways by
 * the wheel, with a gold rule tracking progress. Below 1024px it collapses to
 * an ordinary stack so nothing gets trapped.
 */
export default function Craft() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  const ready = useLazyMotion(root);

  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const el = track.current;
        const holder = pin.current;
        if (!el || !holder) return;

        const distance = () => el.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: holder,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(el, { x: () => -distance(), ease: "none" }, 0);
        if (bar.current) tl.to(bar.current, { scaleX: 1, ease: "none" }, 0);

        /* Each frame drifts within its panel for a little depth. */
        gsap.utils.toArray<HTMLElement>("[data-craft-art]").forEach((art, i) => {
          tl.fromTo(
            art,
            { yPercent: i % 2 ? 5 : -5 },
            { yPercent: i % 2 ? -5 : 5, ease: "none" },
            0,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} id="craft" className="relative bg-[#F8F0E5]">
      <div
        ref={pin}
        data-craft-rig
        className="relative h-[100svh] overflow-hidden max-lg:h-auto max-lg:overflow-visible"
      >
        {/* Section label, held above the moving panels */}
        <div data-craft-label className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-12 pt-28 max-lg:relative max-lg:pt-20 max-lg:pb-4 max-lg:px-8 max-sm:px-5 max-sm:pt-16">
          <Eyebrow>The Craft</Eyebrow>
          <p className="font-display text-2xl italic text-[#5C493B] max-lg:hidden">
            Four stages, one cup
          </p>
        </div>

        {/* The moving strip */}
        <div
          ref={track}
          data-craft-track
          className="flex h-full w-max items-center max-lg:w-full max-lg:flex-col max-lg:gap-16 max-lg:py-8"
        >
          {CRAFT_STEPS.map((step) => (
            <article
              key={step.index}
              data-craft-panel
              className="flex h-full w-[100vw] shrink-0 items-center px-12 max-lg:h-auto max-lg:w-full max-lg:px-8 max-sm:px-5"
            >
              <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 items-center gap-20 max-xl:gap-12 max-lg:grid-cols-1 max-lg:gap-8">
                {/* Words */}
                <div className="relative max-lg:order-2">
                  <span className="pointer-events-none absolute -left-6 -top-24 select-none font-display text-[12rem] font-light leading-none text-[#BA8F60]/15 max-xl:text-[9rem] max-lg:-top-14 max-lg:text-[6.5rem]">
                    {step.index}
                  </span>
                  <div className="relative">
                    <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.34em] text-[#8C5F32]">
                      Stage {step.index}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-medium leading-none text-[#1C130D]">
                      {step.title}
                    </h3>
                    <div className="rule-gold mt-6 w-20" />
                    <p className="mt-6 max-w-[46ch] leading-relaxed text-[#4A3B32] max-sm:text-[0.94rem]">
                      {step.body}
                    </p>
                    <p className="mt-7 font-display text-xl italic text-[#966A3B]">
                      {step.meta}
                    </p>
                  </div>
                </div>

                {/* Photograph */}
                <div className="max-lg:order-1">
                  <div
                    data-craft-art
                    className="relative mx-auto aspect-[4/5] w-full max-w-[48vh] overflow-hidden max-lg:max-w-none rounded-2xl border border-[#E8DCCF] shadow-[0_24px_55px_-15px_rgba(28,19,13,0.12)] max-lg:aspect-[16/10] max-lg:max-h-none"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 1024px) 92vw, 42vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress rule */}
        <div data-craft-progress className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1440px] px-12 pb-14 max-lg:hidden">
          <div className="flex items-center gap-6">
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] font-medium text-[#7A695C]">
              Source
            </span>
            <div className="relative h-px flex-1 bg-[#E8DCCF]">
              <div
                ref={bar}
                className="absolute inset-0 origin-left scale-x-0 bg-[#BA8F60]"
              />
            </div>
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] font-medium text-[#7A695C]">
              Serve
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
