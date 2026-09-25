"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import { SEQUENCE_VIDEO2, RITUAL_BEATS } from "@/lib/site";

const TOTAL = SEQUENCE_VIDEO2.last - SEQUENCE_VIDEO2.first + 1;
const CONCURRENCY = 8;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;

const requestIdleCallbackSafe = (fn: () => void) => {
  const ric = (window as Window & typeof globalThis).requestIdleCallback;
  if (typeof ric === "function") ric(fn, { timeout: 1500 });
  else window.setTimeout(fn, 200);
};

export default function PourRitualSection() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const loaderBar = useRef<HTMLDivElement>(null);

  /* Frame stores in refs to keep render cycles decoupled */
  const frames = useRef<HTMLImageElement[]>([]);
  const ready = useRef<boolean[]>([]);
  const painted = useRef(-1);

  const reduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  /** Paints frame to 2D canvas with nearest neighbor fallback */
  const paint = useCallback((index: number) => {
    const el = canvas.current;
    if (!el) return;

    let i = gsap.utils.clamp(0, TOTAL - 1, Math.round(index));
    if (!ready.current[i]) {
      let found = -1;
      for (let k = i; k >= 0; k--) {
        if (ready.current[k]) {
          found = k;
          break;
        }
      }
      if (found < 0) {
        for (let k = i + 1; k < TOTAL; k++) {
          if (ready.current[k]) {
            found = k;
            break;
          }
        }
      }
      if (found < 0) return;
      i = found;
    }
    if (i === painted.current) return;

    const ctx = el.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.drawImage(frames.current[i], 0, 0, el.width, el.height);
    painted.current = i;

    // Update active step indicator
    const progress = i / (TOTAL - 1);
    if (progress < 0.35) setActiveStep(0);
    else if (progress < 0.7) setActiveStep(1);
    else setActiveStep(2);
  }, []);

  /* Adapt canvas resolution on mobile for high frame rate */
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    el.width = Math.round(SEQUENCE_VIDEO2.width / 2);
    el.height = Math.round(SEQUENCE_VIDEO2.height / 2);
    painted.current = -1;
  }, []);

  /* Lazy-loaded sequence: only downloads when user is near this section */
  useEffect(() => {
    const section = root.current;
    if (!section) return;

    let started = false;
    let cancelled = false;
    const opened: HTMLImageElement[] = [];

    const startLoading = () => {
      if (started) return;
      started = true;

      const phone = window.matchMedia("(max-width: 640px)").matches;
      const step = phone ? 4 : 1;

      const picked: number[] = [];
      for (let i = 0; i < TOTAL; i += step) picked.push(i);
      if (picked[picked.length - 1] !== TOTAL - 1) picked.push(TOTAL - 1);

      // Bisecting order for optimal scrub coverage while downloading
      const queue: number[] = [];
      const seen = new Set<number>();
      const push = (k: number) => {
        if (k >= 0 && k < picked.length && !seen.has(k)) {
          seen.add(k);
          queue.push(picked[k]);
        }
      };

      push(0);
      push(picked.length - 1);
      let spans: Array<[number, number]> = [[0, picked.length - 1]];
      while (spans.length) {
        const next: Array<[number, number]> = [];
        for (const [lo, hi] of spans) {
          if (hi - lo < 2) continue;
          const mid = (lo + hi) >> 1;
          push(mid);
          next.push([lo, mid], [mid, hi]);
        }
        spans = next;
      }

      let cursor = 0;
      let done = 0;

      const load = (i: number, priority: "high" | "low") =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.fetchPriority = priority;

          const settle = () => {
            if (!cancelled) {
              ready.current[i] = img.naturalWidth > 0;
              done += 1;
              if (loaderBar.current) {
                loaderBar.current.style.transform = `scaleX(${done / queue.length})`;
              }
              if (ready.current[i] && painted.current < 0) paint(i);
              if (done >= queue.length) setLoaded(true);
            }
            resolve();
          };

          img.onload = settle;
          img.onerror = settle;
          img.src = SEQUENCE_VIDEO2.path(SEQUENCE_VIDEO2.first + i);
          frames.current[i] = img;
          opened.push(img);
        });

      const pump = () => {
        if (cancelled || cursor >= queue.length) return;
        const i = queue[cursor++];
        if (ready.current[i] !== undefined) return pump();
        void load(i, "low").then(pump);
      };

      // Load initial frame at high priority
      void load(queue[0], "high").then(() => {
        if (cancelled) return;
        setFirstFrameReady(true);
        cursor = 1;

        const startBulk = () => {
          if (cancelled) return;
          for (let c = 0; c < CONCURRENCY; c++) pump();
        };

        if (document.readyState === "complete") {
          requestIdleCallbackSafe(startBulk);
        } else {
          window.addEventListener("load", () => requestIdleCallbackSafe(startBulk), {
            once: true,
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(section);

    return () => {
      cancelled = true;
      observer.disconnect();
      opened.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [paint]);

  /* Fade canvas in once first frame is ready */
  useGSAP(
    () => {
      if (!firstFrameReady || !canvas.current) return;
      gsap.to(canvas.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { dependencies: [firstFrameReady] },
  );

  /* ScrollTrigger scrub timeline */
  useGSAP(
    () => {
      if (reduced || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add(
        { phone: "(max-width: 640px)", wide: "(min-width: 641px)" },
        (ctx) => {
          const phone = Boolean(ctx.conditions?.phone);
          const playhead = { frame: 0 };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + Math.round(window.innerHeight * (phone ? 2.2 : 3)),
              pin: stage.current,
              pinSpacing: false,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onRefresh: () => {
                painted.current = -1;
                paint(playhead.frame);
              },
            },
          });

          // Scrub frame index across full timeline
          tl.to(
            playhead,
            {
              frame: TOTAL - 1,
              duration: 1,
              onUpdate: () => paint(playhead.frame),
            },
            0,
          );

          // Synchronize story cards with footage milestones
          RITUAL_BEATS.forEach((beat) => {
            const [inStart, inEnd, outStart, outEnd] = beat.window;
            const el = `[data-ritual-card='${beat.id}']`;

            tl.fromTo(
              el,
              { autoAlpha: 0, y: 30, scale: 0.96 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: inEnd - inStart,
                ease: "power2.out",
              },
              inStart,
            );

            if (outStart < 1) {
              tl.to(
                el,
                {
                  autoAlpha: 0,
                  y: -24,
                  scale: 0.98,
                  duration: outEnd - outStart,
                  ease: "power2.in",
                },
                outStart,
              );
            }
          });

          // Soft bottom vignette transitions
          tl.fromTo(
            "[data-ritual-footer]",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" },
            0.88,
          );

          return () => {};
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced, paint] },
  );

  /* Fallback static frame for reduced motion visitors */
  useEffect(() => {
    if (reduced && firstFrameReady) paint(Math.round(TOTAL * 0.75));
  }, [reduced, firstFrameReady, paint]);

  const jumpToStep = (index: number) => {
    const targetProgress = index === 0 ? 0.15 : index === 1 ? 0.55 : 0.85;
    paint(Math.round(targetProgress * (TOTAL - 1)));
  };

  return (
    <section
      ref={root}
      id="ritual"
      className={
        reduced
          ? "relative bg-[#1C130D] text-[#FFF9F2]"
          : "relative h-[400lvh] bg-[#1C130D] max-lg:h-[380lvh] max-sm:h-[320lvh]"
      }
    >
      <div
        ref={stage}
        className="relative h-[100lvh] w-full overflow-hidden bg-[#1C130D]"
      >
        {/* ── Background Sequence Canvas ──────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <canvas
            ref={canvas}
            width={SEQUENCE_VIDEO2.width}
            height={SEQUENCE_VIDEO2.height}
            aria-label="Tabletop iced coffee pour sequence into crystal goblet"
            role="img"
            style={{ opacity: 0, objectPosition: "50% 50%" }}
            className="h-full w-full object-cover object-center max-sm:object-center transition-opacity duration-700"
          />
        </div>

        {/* ── Cinematic Studio Ambient Vignettes ──────────────────────── */}
        {/* Soft top gradient blend */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#1C130D]/90 via-[#1C130D]/40 to-transparent"
        />
        {/* Soft bottom gradient blend */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#1C130D]/95 via-[#1C130D]/50 to-transparent"
        />
        {/* Left readable side wash on desktop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#1C130D]/85 via-[#1C130D]/35 to-transparent max-lg:hidden"
        />

        {/* ── Top Header Bar ─────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-10 sm:px-12 sm:pt-14 max-sm:pt-20 max-sm:px-4">
          <div className="pointer-events-auto max-sm:text-center max-sm:w-full">
            <Eyebrow className="max-sm:justify-center max-sm:text-[0.55rem]">Tabletop Craft · The Cold Pour</Eyebrow>
            <h2 className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl md:text-3xl font-medium tracking-tight text-[#FFF9F2]">
              The Dark Elixir <span className="italic text-[#BA8F60]">Ritual</span>
            </h2>
          </div>

          {/* Quick Step Indicators */}
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-[#1C130D]/75 p-1 backdrop-blur-md max-sm:hidden">
            {RITUAL_BEATS.map((beat, idx) => (
              <button
                key={beat.id}
                type="button"
                onClick={() => jumpToStep(idx)}
                className={`rounded-full px-3.5 py-1 text-[0.68rem] font-sans font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                  activeStep === idx
                    ? "bg-[#BA8F60] text-white shadow-sm"
                    : "text-[#D8C7B5] hover:text-white"
                }`}
              >
                {beat.step} · {beat.eyebrow}
              </button>
            ))}
          </div>
        </div>

        {/* ── Floating Narrative Cards ────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 sm:px-12">
          {RITUAL_BEATS.map((beat) => (
            <div
              key={beat.id}
              data-ritual-card={beat.id}
              className="pointer-events-auto absolute max-w-[400px] rounded-2xl border border-[#BA8F60]/30 bg-[#1C130D]/88 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 max-sm:inset-x-4 max-sm:bottom-4 max-sm:max-w-none max-sm:p-3.5 max-sm:rounded-xl max-sm:border-[#BA8F60]/20 max-sm:bg-[#1C130D]/90"
              style={{
                left: beat.id === "cascade" ? "auto" : "3rem",
                right: beat.id === "cascade" ? "3rem" : "auto",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[#BA8F60]/40 bg-[#BA8F60]/15 px-3 py-0.5 font-mono text-[0.62rem] max-sm:text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[#E0B888]">
                  Phase {beat.step}
                </span>
                <span className="font-sans text-[0.62rem] max-sm:text-[0.55rem] uppercase tracking-[0.2em] text-[#A6917E]">
                  {beat.eyebrow}
                </span>
              </div>

              <h3 className="mt-1 sm:mt-3.5 font-display text-base sm:text-2xl md:text-3xl font-medium tracking-tight text-[#FFF9F2]">
                {beat.title}{" "}
                <span className="italic text-[#BA8F60]">{beat.titleAccent}</span>
              </h3>

              <p className="mt-3 font-sans text-[0.84rem] leading-relaxed text-[#D2C2B2] max-sm:hidden">
                {beat.body}
              </p>

              {/* Mobile compact inline spec summary */}
              <div className="mt-1 sm:hidden flex items-center gap-2 font-mono text-[0.62rem] text-[#CDB99D]/90">
                <span>{beat.specs[0].label}: <strong className="text-white font-semibold">{beat.specs[0].value}</strong></span>
                <span className="text-[#BA8F60]/60">·</span>
                <span>{beat.specs[1].label}: <strong className="text-white font-semibold">{beat.specs[1].value}</strong></span>
              </div>

              {/* Desktop Technical Specs Grid */}
              <div className="mt-5 hidden sm:grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {beat.specs.map((spec) => (
                  <div key={spec.label}>
                    <span className="block text-[0.58rem] uppercase tracking-[0.18em] text-[#8C7B6D]">
                      {spec.label}
                    </span>
                    <span className="font-mono text-[0.78rem] font-semibold text-[#FFF9F2]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Call To Action (Bottom Bar) ───────────────────────── */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-5 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-end px-6 sm:px-12 max-sm:justify-center">
          <div
            data-ritual-footer
            className="flex items-center gap-3 max-sm:w-full max-sm:justify-center"
          >
            <GoldButton href="#menu" className="max-sm:text-[0.72rem] max-sm:py-2 max-sm:px-5">
              Taste Dark Elixir
            </GoldButton>
            <GoldButton href="#visit" variant="ghost" className="max-sm:hidden">
              Order Delivery
            </GoldButton>
          </div>
        </div>

        {/* Hairline loader */}
        {!loaded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-0.5 bg-white/10"
          >
            <div
              ref={loaderBar}
              className="h-full origin-left scale-x-0 bg-[#BA8F60] transition-transform duration-150"
            />
          </div>
        )}
      </div>

      {/* Reduced-motion static presentation */}
      {reduced && (
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-8 px-6 py-20 sm:px-12 max-lg:grid-cols-1">
          {RITUAL_BEATS.map((beat) => (
            <div
              key={beat.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#BA8F60]">
                Phase {beat.step} · {beat.eyebrow}
              </span>
              <h3 className="mt-3 font-display text-2xl font-medium text-white">
                {beat.title} {beat.titleAccent}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#D2C2B2]">
                {beat.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
