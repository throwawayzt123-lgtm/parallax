"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import {
  BRAND,
  COFFEE_SEQUENCE,
  SEQUENCE_VIDEO1,
  SEQUENCE_VIDEO2,
  HERO_BEATS,
  ORIGINS,
} from "@/lib/site";

const TOTAL = COFFEE_SEQUENCE.last - COFFEE_SEQUENCE.first + 1;

/** Parallel image requests. Enough to saturate the pipe, few enough to stay polite. */
const CONCURRENCY = 8;

/* Subscribing to the media query keeps the preference live if the visitor
   changes it mid-session, and avoids a setState-in-effect cascade. */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;

/** requestIdleCallback with a Safari-safe fallback. */
const requestIdleCallbackSafe = (fn: () => void) => {
  const ric = (window as Window & typeof globalThis).requestIdleCallback;
  if (typeof ric === "function") ric(fn, { timeout: 1500 });
  else window.setTimeout(fn, 200);
};

/**
 * Scroll-scrubbed cinematic hero.
 *
 * The asset is a 240-frame image sequence rather than a video, so playback is
 * driven by painting decoded frames onto a canvas. That keeps the scrub
 * frame-accurate and avoids the seek latency and keyframe dependence of
 * `video.currentTime`, which is what makes video scrubbing feel rubbery.
 *
 * Scrub is `true` (no added inertia) on both breakpoints, for different
 * reasons. On desktop ScrollSmoother already lerps the scroll position before
 * ScrollTrigger reads it, so a scrub value would stack a second smoothing pass
 * and lag behind the wheel. On mobile the smoother is deliberately absent —
 * see MotionProvider — and native scroll wants an immediate response; the
 * frame index is rounded, so repeated deltas that land on the same frame cost
 * nothing.
 */
export default function CoffeeScrollHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const loaderBar = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);

  /* Frame store lives in refs — nothing here may trigger a React render. */
  const frames = useRef<HTMLImageElement[]>([]);
  const ready = useRef<boolean[]>([]);
  const painted = useRef(-1);

  const reduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const [loaded, setLoaded] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  /** Paints a frame, falling back to the nearest one already decoded. */
  const paint = useCallback((index: number) => {
    const el = canvas.current;
    if (!el) return;

    let i = gsap.utils.clamp(0, TOTAL - 1, Math.round(index));
    if (!ready.current[i]) {
      let found = -1;
      for (let k = i; k >= 0; k--) if (ready.current[k]) { found = k; break; }
      if (found < 0) {
        for (let k = i + 1; k < TOTAL; k++) if (ready.current[k]) { found = k; break; }
      }
      if (found < 0) return;
      i = found;
    }
    if (i === painted.current) return;

    const ctx = el.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.drawImage(frames.current[i], 0, 0, el.width, el.height);
    painted.current = i;
  }, []);

  /* Shrink the canvas backing store on phones. Every scrubbed frame is a full
     drawImage over the whole surface; at 1280×720 that is ~920k pixels of fill
     per frame for a screen barely 400px wide. Halving each axis cuts it to a
     quarter and is still well above the display resolution after the
     object-fit crop. Declared before the preload effect so it runs first and
     the opening frame is drawn at the right size. */
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    el.width = Math.round(COFFEE_SEQUENCE.width / 2);
    el.height = Math.round(COFFEE_SEQUENCE.height / 2);
    painted.current = -1; // resizing clears the surface
  }, []);

  /* ── Preload ───────────────────────────────────────────────────────────
     Two stages, because LCP depends on it. The opening frame is fetched alone
     and at high priority; as soon as it paints the veil lifts and the headline
     can be measured. Only then does the remaining sequence start downloading,
     so ~8 MB of WebP never competes with CSS, JS and the LCP paint. */
  useEffect(() => {
    frames.current = [];
    ready.current = [];
    painted.current = -1;
    setLoaded(false);
    setFirstFrameReady(false);

    /* Tracked locally so teardown never has to read a ref that may have moved
       on by the time cleanup runs. */
    const opened: HTMLImageElement[] = [];
    let cancelled = false;
    let cursor = 0;
    let done = 0;

    /* Frame budget. Phones take every sixth frame (40 frames, ~1.4 MB rather
       than the full ~8 MB); a connection reporting 2G or Save-Data takes far
       fewer still, because on those links the sequence is the difference
       between a usable page and an unusable one. `paint` snaps to the nearest
       decoded frame, so a sparser set still runs end to end — it simply steps
       in larger increments. */
    const phone = window.matchMedia("(max-width: 640px)").matches;
    const conn = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;
    const frugal = Boolean(
      conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType ?? "")),
    );

    const step = frugal ? 20 : phone ? 6 : 1;

    const picked: number[] = [];
    for (let i = 0; i < TOTAL; i += step) picked.push(i);
    if (picked[picked.length - 1] !== TOTAL - 1) picked.push(TOTAL - 1);

    /* Fetch order matters as much as frame count on a slow link. Loading
       sequentially means that after N frames you hold the first N — so
       scrolling to the middle of the scrub shows the opening frame and the
       animation appears stuck. Bisecting instead (ends first, then midpoints,
       then quarters…) keeps whatever has arrived spread evenly across the
       whole timeline, so every scroll position has a near neighbour and the
       sequence degrades into a coarser version of itself rather than a
       frozen one. */
    const queue: number[] = [];
    {
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
    }

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
        img.src = COFFEE_SEQUENCE.path(COFFEE_SEQUENCE.first + i);
        frames.current[i] = img;
        opened.push(img);
      });

    const pump = () => {
      if (cancelled || cursor >= queue.length) return;
      const i = queue[cursor++];
      if (ready.current[i] !== undefined) return pump();
      void load(i, "low").then(pump);
    };

    /* Stage 1 — the opening frame, on its own. */
    void load(queue[0], "high").then(() => {
      if (cancelled) return;
      setFirstFrameReady(true);
      cursor = 1;

      /* Stage 2 — the rest, once the browser is past the critical work. */
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

    return () => {
      cancelled = true;
      opened.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [paint]);

  /* Lift the veil as soon as the FIRST frame is on the canvas — not when all
     240 have decoded. The veil is opaque and covers the headline, so gating it
     on the full sequence made LCP wait for ~8 MB of WebP. Scrubbing degrades
     gracefully meanwhile: `paint` falls back to the nearest decoded frame. */
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

  /* The progress hairline retires once the sequence is complete. */
  useGSAP(
    () => {
      if (!loaded || !loader.current) return;
      gsap.to(loader.current, { autoAlpha: 0, duration: 0.5, ease: "power2.out" });
    },
    { dependencies: [loaded] },
  );

  /* Once the whole sequence is in, re-measure: the pin distance is derived
     from element geometry that may have settled since. */
  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  /* ── The scroll timeline ──────────────────────────────────────────────── */
  useGSAP(
    () => {
      /* `reduced` comes from a store that reports `false` during hydration to
         match the server render, so the media query is re-read here. Without
         this, a pinned trigger is briefly created for reduced-motion visitors
         and its pin transform survives the revert. */
      if (reduced || prefersReducedMotion()) return;

      /* Rebuilt per breakpoint: the portrait crop needs its own treatment, and
         matchMedia tears the old timeline down cleanly when you cross over. */
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
              /* Fixed pixel distance, NOT "bottom bottom".
                 When mobile browser chrome slides away, innerHeight grows and
                 an svh-sized section grows with it — by 3x the change, since
                 it is 300svh — while the pinned stage keeps its measured pixel
                 height. Deriving the end from the section therefore moved the
                 whole pin range mid-scroll and the page lurched. Pinning for a
                 distance that does not depend on the section's height keeps
                 the two in agreement. */
              end: () =>
                "+=" + Math.round(window.innerHeight * (phone ? 2 : 3.2)),
              pin: stage.current,
              pinSpacing: false, // the section already reserves the scroll length
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onRefresh: () => {
                painted.current = -1;
                paint(playhead.frame);
              },
            },
          });

          /* Frame playback occupies the whole timeline; beats ride on top. */
          tl.to(
            playhead,
            {
              frame: TOTAL - 1,
              duration: 1,
              onUpdate: () => paint(playhead.frame),
            },
            0,
          );

          /* Portrait shows only ~26% of a 16:9 frame's width. With the new
             Frames2 asset, the subject (can and splash) is centered right down
             the middle (50% horizontal) across all 240 frames. Keeping
             objectPosition centered ensures the animation stays perfectly
             centralized on mobile throughout the scrub. */
          if (phone) {
            /* Hand the readable band from the top of the frame to the bottom,
               following the subject rather than covering it. */
            tl.to(
              "[data-scrim-intro]",
              { autoAlpha: 0, duration: 0.08, ease: "power1.in" },
              0.13,
            );
            tl.to(
              "[data-scrim-beats]",
              { autoAlpha: 1, duration: 0.08, ease: "power1.out" },
              0.19,
            );
          }

          /* Opening lockup clears out as the cup leaves the table. */
          tl.to("[data-beat='intro']", { autoAlpha: 0, y: -30, duration: 0.07 }, 0.14);

          HERO_BEATS.forEach((beat) => {
            const [inStart, inEnd, outStart, outEnd] = beat.window;
            const el = `[data-beat='${beat.id}']`;

            tl.fromTo(
              el,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: inEnd - inStart, ease: "power2.out" },
              inStart,
            );
            if (outStart < 1) {
              tl.to(
                el,
                { autoAlpha: 0, y: -26, duration: outEnd - outStart, ease: "power2.in" },
                outStart,
              );
            }
          });

          /* A brand veil rises over the last stretch: it buys contrast for the
             closing line and hands off into the section below without a cut. */
          tl.fromTo(
            "[data-veil]",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12, ease: "power1.in" },
            0.88,
          );

          /* Restrained entrance for the opening lockup, matching the home hero. */
          const split = new SplitText(heading.current, {
            type: "lines",
            mask: "lines",
          });

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from("[data-intro-eyebrow]", { y: 22, opacity: 0, duration: 0.9 }, 0.15)
            .from(split.lines, { yPercent: 115, opacity: 0, duration: 1.2, stagger: 0.11 }, 0.3)
            .from("[data-intro-lede]", { y: 26, opacity: 0, duration: 1 }, 0.8)
            .from("[data-intro-cta]", { y: 22, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.95)
            .from("[data-intro-meta]", { y: 18, opacity: 0, duration: 0.9 }, 1.1);

          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced, paint] },
  );

  /* In reduced-motion the sequence is presented as a held frame, so park the
     canvas on the pour rather than the empty opening table. */
  useEffect(() => {
    if (reduced && loaded) paint(Math.round(TOTAL * 0.72));
  }, [reduced, loaded, paint]);

  const beatCopy = (beat: (typeof HERO_BEATS)[number], stacked: boolean) => (
    <>
      <Eyebrow reveal={false} className="max-sm:text-[0.55rem] max-sm:justify-center">
        {beat.eyebrow}
      </Eyebrow>
      <h2
        className={`mt-6 font-display text-[clamp(2.2rem,4.4vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.015em] text-cream ${
          stacked ? "" : "drop-shadow-[0_4px_26px_rgb(8_5_3/0.95)]"
        } max-sm:text-[1.65rem] max-sm:leading-[1.1] max-sm:mt-1.5`}
      >
        {beat.title} <em className="text-gilded italic">{beat.titleAccent}</em>
        {beat.titleTail}
      </h2>
      {beat.body && (
        <p className="mt-6 max-w-[42ch] leading-relaxed text-sand max-sm:mt-1.5 max-sm:text-[0.8rem] max-sm:line-clamp-2 max-sm:mx-auto">
          {beat.body}
        </p>
      )}
      {beat.id === "yours" && (
        <div className="mt-9 flex items-center gap-4 max-sm:mt-3 max-sm:gap-2 max-sm:justify-center">
          <GoldButton href="#menu" className="max-sm:text-[0.68rem] max-sm:py-1.5 max-sm:px-3.5">
            Explore Menu
          </GoldButton>
          <GoldButton href="#visit" variant="ghost" className="max-sm:hidden">
            Get Delivery
          </GoldButton>
        </div>
      )}
    </>
  );

  return (
    <section
      ref={root}
      id="home"
      /* The tall track is what the pinned stage scrubs against. Phones get a
         shorter throw so the sequence does not overstay its welcome.
         `lvh` (large viewport height) is deliberate: it is the one viewport
         unit that does NOT change when mobile browser chrome slides in and
         out, so this track stays the same height as the pin distance measured
         above. `vh`/`svh` here caused the page to lurch on every chrome
         transition. The 1x stage height is added on top of the pin distance. */
      className={
        reduced
          ? "relative bg-ink"
          : "relative h-[420lvh] bg-ink max-lg:h-[420lvh] max-sm:h-[300lvh]"
      }
    >
      <div
        ref={stage}
        className="grain relative h-[100lvh] w-full overflow-hidden bg-ink"
      >
        {/* ── The sequence ────────────────────────────────────────────── */}
        <div className="absolute inset-0">
          <canvas
            ref={canvas}
            width={COFFEE_SEQUENCE.width}
            height={COFFEE_SEQUENCE.height}
            aria-label="A cup of coffee lifting from a café table and pouring toward the viewer"
            role="img"
            /* Starts transparent: on a slow link there is nothing to show for
               a while, and an empty canvas over the section gradient is less
               jarring than a black rectangle. Faded in by the effect below.

               Framing: `object-cover` so the frame always fills the stage
               edge to edge — no letterbox bands. An earlier attempt used
               `object-contain` to pull the camera back off the can, but
               contain fits the whole 16:9 frame inside the box, so on a
               viewport that is not exactly 16:9 the image ends up shorter
               than the stage and leaves dark bands above and below. Cover
               crops instead of shrinking, which is what a full-bleed
               background needs. */
            style={{ opacity: 0, objectPosition: "50% 50%" }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        {/* Readability scrims.
            Tuned for the Frames3 sequence, which is LIGHT — a cream backdrop
            and pale milk splash — where the previous footage was a dark café.
            The old values (ink/72 fading out by 58%) were calibrated against
            that dark plate and left the eyebrow and the ghost CTA almost
            invisible here, so the left wash is both stronger and carried
            further across. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-ink/95 via-ink/55 to-transparent max-sm:h-24 max-sm:from-ink/70 max-sm:via-transparent"
        />
        {/* Desktop reads left-to-right into the negative space. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[72%] bg-gradient-to-r from-ink/92 via-ink/60 to-transparent max-sm:hidden"
        />

        {/* Portrait reads vertically at bottom. */}
        <div
          data-scrim-intro
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-20 bg-gradient-to-b from-ink/50 to-transparent opacity-0 max-sm:block"
        />
        <div
          data-scrim-beats
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[44%] bg-gradient-to-t from-ink via-ink/80 to-transparent max-sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink via-ink/60 to-transparent"
        />

        {/* Closing veil — rises only over the last 12% of the scroll. */}
        {!reduced && (
          <div
            data-veil
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink/48 opacity-0"
          />
        )}

        {/* ── Copy, held in the negative space on the left ─────────────── */}
        {/* The header is fixed and overlays the stage, so the copy centres in
            the space *below* it rather than in the raw viewport. Without the
            top inset, a short landscape window (e.g. 1913x833) pushes the
            eyebrow up under the logo and nav. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[104px] z-10 flex items-center max-sm:top-0 max-sm:items-end max-sm:pb-12">
          <div className="mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
            {/* Opening lockup — the home hero's own content and hierarchy. */}
            <div
              data-beat="intro"
              className="pointer-events-auto max-w-[54ch] max-sm:max-w-[340px] max-sm:mx-auto max-sm:text-center"
            >
              <div data-intro-eyebrow className="max-sm:justify-center">
                <Eyebrow reveal={false} className="max-sm:justify-center max-sm:text-[0.58rem]">
                  {BRAND.tagline} · New York, USA
                </Eyebrow>
              </div>

              <h1
                ref={heading}
                /* Sized against height as well as width: on a wide-but-short
                   window (1913x833) a pure vw scale produced a four-line
                   headline that crowded the header and the origin line. */
                className="mt-8 max-w-[16ch] font-display text-[clamp(2.6rem,min(7vw,10.5vh),7.5rem)] font-medium leading-[0.96] tracking-[-0.02em] text-cream drop-shadow-[0_4px_26px_rgb(8_5_3/0.95)] max-sm:mx-auto max-sm:mt-2 max-sm:text-[1.65rem] max-sm:leading-[1.12] max-sm:max-w-[13ch]"
              >
                A slow ritual, <em className="text-gilded italic">poured</em> with
                intent.
              </h1>

              <p
                data-intro-lede
                className="mt-8 max-w-[46ch] leading-relaxed text-sand max-sm:hidden"
              >
                A speciality coffee house hand-roasting single-origin lots in
                small batches — pulled to the second, poured with patience.
              </p>

              <div className="mt-10 flex items-center gap-4 max-sm:mt-3 max-sm:justify-center max-sm:gap-2">
                <span data-intro-cta>
                  <GoldButton href="#menu" className="max-sm:text-[0.68rem] max-sm:py-1.5 max-sm:px-3.5">
                    Explore Menu
                  </GoldButton>
                </span>
                <span data-intro-cta className="max-sm:hidden">
                  <GoldButton href="#visit" variant="ghost">
                    Get Delivery
                  </GoldButton>
                </span>
              </div>

              <p
                data-intro-meta
                className="mt-10 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-sand drop-shadow-[0_2px_12px_rgb(8_5_3/0.95)] max-sm:hidden"
              >
                {ORIGINS.slice(0, 3)
                  .map((o) => o.country)
                  .join(" · ")}
              </p>
            </div>

            {/* Story beats — stacked in the same slot, cross-faded by scroll. */}
            {!reduced &&
              HERO_BEATS.map((beat) => (
                <div
                  key={beat.id}
                  data-beat={beat.id}
                  /* Phones anchor the copy to the bottom veil, matching where
                     the opening lockup sits. */
                  className="pointer-events-auto absolute inset-y-0 left-0 flex w-full max-w-[1440px] flex-col justify-center px-12 opacity-0 max-lg:px-8 max-sm:justify-end max-sm:px-5 max-sm:pb-12 max-sm:text-center"
                >
                  <div className="max-w-[46ch] max-sm:mx-auto">
                    {beatCopy(beat, false)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── Loading state ───────────────────────────────────────────────
            Deliberately NOT an opaque veil over the whole stage. That version
            hid the headline and CTAs — server-rendered text that is ready in
            well under a second — behind a black panel until the first frame
            arrived: 11s of nothing on a slow connection. Now the copy is
            readable immediately over the section's own gradient, and only a
            hairline of progress sits at the foot of the stage. The canvas
            fades itself in when it has something to show. */}
        <div
          ref={loader}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 pb-8 max-sm:pb-2.5"
        >
          <div className="h-px w-40 overflow-hidden bg-bark/70 max-sm:w-28">
            <div
              ref={loaderBar}
              className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary-deep via-primary to-primary-soft"
            />
          </div>
          {/* The sequence is a chilled canned iced coffee — anything about
              warming reads as the wrong product. */}
          <p className="font-sans text-[0.52rem] uppercase tracking-[0.32em] text-muted">
            Pouring over ice
          </p>
        </div>
      </div>

      {/* Reduced motion: the beats become ordinary reading matter beneath the
          held frame, so no copy is lost with the animation switched off. */}
      {reduced && (
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-12 px-12 py-24 max-lg:grid-cols-1 max-lg:gap-16 max-lg:px-8 max-sm:px-5 max-sm:py-16">
          {HERO_BEATS.map((beat) => (
            <div key={beat.id}>{beatCopy(beat, true)}</div>
          ))}
        </div>
      )}
    </section>
  );
}
