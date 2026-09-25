"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import GoldButton from "@/components/ui/GoldButton";
import { BRAND, ORIGINS } from "@/lib/site";

/* Deterministic bean positions — random values would break hydration. */
const MOTES = [
  { left: "8%", top: "24%", size: 7, delay: 0, drift: -26 },
  { left: "17%", top: "68%", size: 4, delay: 0.6, drift: 20 },
  { left: "31%", top: "16%", size: 5, delay: 1.2, drift: -18 },
  { left: "44%", top: "80%", size: 8, delay: 0.3, drift: 24 },
  { left: "62%", top: "12%", size: 5, delay: 1.6, drift: -22 },
  { left: "73%", top: "58%", size: 6, delay: 0.9, drift: 18 },
  { left: "86%", top: "30%", size: 4, delay: 2.1, drift: -20 },
  { left: "92%", top: "72%", size: 7, delay: 1.4, drift: 22 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const cupWrap = useRef<HTMLDivElement>(null);
  const cup = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const q = gsap.utils.selector(root);

      if (reduced) {
        gsap.set(q("[data-hero]"), { opacity: 1, clearProps: "all" });
        return;
      }

      /* ── Opening sequence ─────────────────────────────────────── */
      const split = new SplitText(heading.current, {
        type: "lines",
        mask: "lines",
        linesClass: "hero-line",
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(q("[data-hero-glow]"), {
        scale: 0.55,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      })
        .from(
          cup.current,
          { yPercent: 14, scale: 1.14, rotate: -7, opacity: 0, duration: 1.8 },
          0.1,
        )
        .from(q("[data-hero-eyebrow]"), { y: 24, opacity: 0, duration: 1 }, 0.35)
        .from(
          split.lines,
          { yPercent: 115, opacity: 0, duration: 1.35, stagger: 0.12 },
          0.5,
        )
        .from(q("[data-hero-lede]"), { y: 30, opacity: 0, duration: 1.1 }, 1.05)
        .from(
          q("[data-hero-cta]"),
          { y: 26, opacity: 0, duration: 1, stagger: 0.1 },
          1.2,
        )
        .from(
          q("[data-hero-meta]"),
          { y: 20, opacity: 0, duration: 1, stagger: 0.08 },
          1.35,
        )
        .from(q("[data-hero-mote]"), { opacity: 0, duration: 1.2, stagger: 0.05 }, 1);

      /* ── Perpetual float, so the cup never feels pasted on ───── */
      tl.add(() => {
        gsap.to(cup.current, {
          yPercent: -2.2,
          rotate: 1.1,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      MOTES.forEach((m, i) => {
        gsap.to(q("[data-hero-mote]")[i], {
          y: m.drift,
          x: m.drift * 0.4,
          duration: 6 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: m.delay,
        });
      });

      /* ── Scroll exit: the cup keeps growing as the copy lifts ── */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(q("[data-hero-copy]"), { yPercent: -26, opacity: 0, ease: "none" }, 0)
        .to(cup.current, { scale: 1.16, ease: "none" }, 0)
        .to(q("[data-hero-glow]"), { opacity: 0.25, scale: 1.3, ease: "none" }, 0);

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      /* Below 640px the composition flips: the cup takes the top half and the
         copy sits beneath it, rather than everything fighting for the middle. */
      className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-32 pb-16 max-lg:pt-36 max-sm:pt-[43vh] max-sm:pb-10"
    >
      {/* ── Layer 1 · the big coloured ground ───────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_8%,#3a2517_0%,#1d130c_38%,#0d0805_68%,#080503_100%)]"
      />

      {/* ── Layer 2 · roasted-bean texture, barely there ────────── */}
      <div aria-hidden className="absolute inset-0 opacity-[0.16] mix-blend-soft-light">
        <Image
          src="/images/story/beans-texture.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* ── Layer 3 · the gold light source behind the cup ──────── */}
      <div
        data-hero-glow
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[74vw] w-[74vw] max-w-[1150px] -translate-x-1/2 -translate-y-[54%] rounded-full bg-[radial-gradient(circle,rgb(228_199_159/0.34)_0%,rgb(198_140_66/0.16)_38%,transparent_68%)] blur-[70px]"
      />

      {/* ── Layer 4 · the hero object ───────────────────────────── */}
      <div
        ref={cupWrap}
        data-speed="0.82"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center max-sm:items-start"
      >
        <div ref={cup} className="relative will-change-transform">
          <Image
            src="/images/webimages/Herobg-Photoroom.png"
            alt="Porcelain cup tipping a ribbon of espresso through the air"
            width={682}
            height={365}
            priority
            /* On narrow screens the cup is nudged left so its body — not the
               empty splash tail — sits behind the headline. */
            className="h-auto w-[min(1080px,104vw)] max-w-none -translate-y-[6%] drop-shadow-[0_60px_70px_rgb(0_0_0/0.75)] max-lg:w-[130vw] max-sm:w-[124vw] max-sm:translate-x-0 max-sm:translate-y-[13vh]"
          />
          {/* warm bounce light pooling beneath the pour */}
          <div className="absolute bottom-[8%] left-[16%] h-24 w-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(198_112_31/0.4),transparent_70%)] blur-2xl" />
        </div>
      </div>

      {/* ── Layer 5 · drifting motes ────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 z-10">
        {MOTES.map((m, i) => (
          <span
            key={i}
            data-hero-mote
            style={{ left: m.left, top: m.top, width: m.size, height: m.size }}
            className="absolute rounded-full bg-primary/45 blur-[1px]"
          />
        ))}
      </div>

      {/* ── Layer 6 · legibility scrim, focused on the copy ─────── */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 bg-[radial-gradient(760px_420px_at_50%_44%,rgb(8_5_3/0.66)_0%,rgb(8_5_3/0.34)_52%,rgb(8_5_3/0.1)_76%,transparent_92%)] max-sm:bg-[radial-gradient(120%_46%_at_50%_74%,rgb(8_5_3/0.9)_0%,rgb(8_5_3/0.6)_55%,transparent_92%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-64 bg-gradient-to-t from-ink via-ink/70 to-transparent max-sm:h-36"
      />

      {/* ── Layer 7 · the words ─────────────────────────────────── */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] flex-col items-center px-12 max-lg:px-8 max-sm:px-5">
        <div data-hero-copy className="flex flex-col items-center text-center">
          <div
            data-hero-eyebrow
            className="flex items-center gap-4 max-sm:gap-2.5"
          >
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-primary max-sm:w-8" />
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.46em] text-primary max-sm:text-[0.55rem] max-sm:tracking-[0.3em]">
              {BRAND.tagline} · New York, USA
            </span>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-primary max-sm:w-8" />
          </div>

          <h1
            ref={heading}
            className="mt-8 max-w-[16ch] font-display text-[clamp(3.2rem,9.2vw,10rem)] font-medium leading-[0.92] tracking-[-0.02em] text-cream drop-shadow-[0_4px_26px_rgb(8_5_3/0.95)] max-sm:mt-6"
          >
            A slow ritual, <em className="text-gilded italic">poured</em> with
            intent.
          </h1>

          <p
            data-hero-lede
            className="mt-8 max-w-[52ch] text-[1.02rem] leading-relaxed text-sand max-sm:mt-6 max-sm:text-[0.92rem]"
          >
            A speciality coffee house hand-roasting single-origin lots in small
            batches — pulled to the second, poured with patience, and served in a
            room nobody will ask you to leave.
          </p>

          <div className="mt-11 flex items-center gap-4 max-sm:mt-7 max-sm:gap-2.5">
            <span data-hero-cta>
              <GoldButton href="#menu">Explore Menu</GoldButton>
            </span>
            <span data-hero-cta>
              <GoldButton href="#visit" variant="ghost">
                Get Delivery
              </GoldButton>
            </span>
          </div>
        </div>
      </div>

      {/* ── Layer 8 · the ledger along the bottom ───────────────── */}
      <div className="relative z-30 mx-auto mt-16 flex w-full max-w-[1440px] items-end justify-between px-12 max-lg:px-8 max-md:mt-12 max-md:flex-col max-md:items-center max-md:gap-8 max-sm:mt-9 max-sm:flex-row max-sm:items-center max-sm:justify-between max-sm:gap-4 max-sm:px-5">
        <div data-hero-meta className="flex items-center gap-4">
          <div className="flex -space-x-3 max-sm:hidden">
            {["E", "C", "K"].map((c) => (
              <span
                key={c}
                className="grid h-9 w-9 place-items-center rounded-full border border-primary/30 bg-mocha font-display text-sm text-primary"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="leading-tight">
            <p className="font-sans text-[0.72rem] tracking-[0.16em] text-cream max-sm:text-[0.64rem]">
              4.9 ★ · 1,240 reviews
            </p>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-muted max-sm:text-[0.52rem] max-sm:tracking-[0.14em]">
              Loved across New York
            </p>
          </div>
        </div>

        <div
          data-hero-meta
          className="flex flex-col items-center gap-2 max-md:order-last max-sm:hidden"
        >
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.34em] text-muted">
            Scroll
          </span>
          <span className="relative h-14 w-px overflow-hidden bg-bark">
            <span className="absolute inset-x-0 top-0 h-6 animate-[drop_2.2s_ease-in-out_infinite] bg-primary" />
          </span>
        </div>

        <div data-hero-meta className="text-right max-md:text-center">
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.32em] text-primary max-sm:text-[0.5rem] max-sm:tracking-[0.2em]">
            Origin
          </p>
          <p className="mt-1.5 font-display text-lg italic text-sand max-sm:mt-0.5 max-sm:text-sm">
            {ORIGINS.slice(0, 3)
              .map((o) => o.country)
              .join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
