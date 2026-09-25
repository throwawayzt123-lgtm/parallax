"use client";

import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  scrollToSection,
} from "@/lib/gsap";
import { BRAND, NAV_LINKS } from "@/lib/site";

function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-[1.55rem] font-medium tracking-[0.14em] text-cream max-sm:text-[1.35rem]">
        {BRAND.name}
      </span>
      <span className="mt-1 font-sans text-[0.5rem] uppercase tracking-[0.36em] text-primary/70 max-sm:text-[0.45rem]">
        {BRAND.established}
      </span>
    </span>
  );
}

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  /* Glass-morph the bar once the hero starts leaving, and tuck the header
     away while scrolling down so the reading column stays clear. */
  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;

      const morph = gsap.to(el, {
        backgroundColor: "rgb(28 19 13 / 0.85)",
        borderColor: "rgb(186 143 96 / 0.25)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 16px 36px -16px rgb(28 19 13 / 0.25)",
        paddingTop: "0.7rem",
        paddingBottom: "0.7rem",
        duration: 0.5,
        ease: "power2.out",
        paused: true,
      });

      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => (self.isActive ? morph.play() : morph.reverse()),
        onUpdate: (self) => {
          if (open) return;
          gsap.to(root.current, {
            yPercent: self.direction === 1 && self.scroll() > 620 ? -140 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
    },
    { scope: root, dependencies: [open] },
  );

  /* Full-bleed mobile menu. */
  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const items = el.querySelectorAll("[data-m-item]");

      /* Freeze the page behind the sheet. The smoother only exists on
         desktop now, so mobile — where this menu actually appears — needs the
         plain overflow lock. */
      const sm = ScrollSmoother.get();
      if (sm) sm.paused(open);
      else document.body.style.overflow = open ? "hidden" : "";

      if (open) {
        gsap.set(el, { display: "flex" });
        gsap
          .timeline()
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.5,
              ease: "power3.inOut",
            },
          )
          .fromTo(
            items,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power3.out" },
            "-=0.22",
          );
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [open] },
  );

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    /* Closing releases the scroll freeze in the effect above. Travel on the
       next frame so that has already run — scrolling into a body still set to
       `overflow: hidden` would go nowhere. */
    requestAnimationFrame(() => scrollToSection(href));
  };

  return (
    <>
      {/* The overlay lives OUTSIDE <header>: GSAP puts a transform on the
          header to tuck it away on scroll, and a transformed ancestor becomes
          the containing block for `position: fixed` children — which would
          clip this to the height of the bar. */}
      <div
        ref={overlay}
        style={{ display: "none" }}
        className="grain fixed inset-0 z-[85] flex flex-col justify-between overflow-y-auto bg-[#120B07]/98 px-6 pb-6 pt-[88px] backdrop-blur-2xl max-sm:px-5 max-sm:pb-6 max-sm:pt-[84px] sm:px-12 sm:pb-8 sm:pt-28"
      >
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#BA8F60]/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-12 h-64 w-64 rounded-full bg-[#BA8F60]/8 blur-[90px]" />

        <div className="relative mx-auto flex w-full max-w-[540px] flex-1 flex-col justify-between">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                data-m-item
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group flex items-center justify-between border-b border-[#BA8F60]/15 py-3 transition-all duration-300 hover:border-[#BA8F60]/40 max-sm:py-2.5 sm:py-3.5"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-[0.62rem] font-medium tracking-[0.25em] text-[#BA8F60]/60 transition-colors group-hover:text-[#BA8F60]">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[1.45rem] font-light tracking-wide text-[#FFF9F2] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#BA8F60] max-sm:text-[1.3rem] sm:text-2xl">
                    {link.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[0.52rem] uppercase tracking-[0.2em] text-[#8C7B6D] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#BA8F60]/80 max-sm:hidden">
                    Discover
                  </span>
                  <span className="font-sans text-xs text-[#BA8F60]/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#BA8F60]">
                    →
                  </span>
                </div>
              </a>
            ))}
          </nav>

          {/* Concierge & Roastery Info Card */}
          <div
            data-m-item
            className="mt-6 rounded-2xl border border-[#BA8F60]/20 bg-[#1C130D]/75 p-4 backdrop-blur-md max-sm:mt-4 max-sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-sans text-[0.54rem] font-semibold uppercase tracking-[0.24em] text-[#BA8F60]">
                  SoHo Roastery · New York, USA
                </span>
                <p className="mt-0.5 font-display text-sm text-[#FFF9F2] max-sm:text-xs">
                  {BRAND.address}
                </p>
              </div>
              <a
                href="#visit"
                onClick={(e) => go(e, "#visit")}
                className="shrink-0 rounded-full border border-[#BA8F60]/50 bg-[#BA8F60]/15 px-3.5 py-1.5 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#E0B888] transition-colors hover:bg-[#BA8F60] hover:text-[#120B07] max-sm:text-[0.58rem] max-sm:px-3 max-sm:py-1"
              >
                Reserve
              </a>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 font-sans text-[0.6rem] text-[#A6917E] max-sm:text-[0.56rem]">
              <span>Mon–Sun · 07:00–19:00</span>
              <span className="font-mono text-[#CDB99D]/90">{BRAND.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <header ref={root} className="fixed inset-x-0 top-0 z-[90]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-5 max-lg:px-4 max-sm:px-3 max-sm:pt-3">
        <div
          ref={bar}
          className="flex items-center justify-between rounded-full border border-transparent px-7 py-4 max-lg:px-5 max-sm:px-4 max-sm:py-3"
        >
          <a href="#home" onClick={(e) => go(e, "#home")} className="shrink-0">
            <Wordmark />
          </a>

          {/* Desktop navigation */}
          <nav className="flex items-center gap-9 max-lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group relative font-sans text-[0.78rem] uppercase tracking-[0.18em] text-sand transition-colors duration-300 hover:text-cream"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-500 ease-[var(--ease-silk)] group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-sand transition-all duration-300 hover:border-primary/50 hover:text-primary max-sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6" strokeLinecap="round" />
              </svg>
            </button>

            <button
              aria-label="Order bag"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-sand transition-all duration-300 hover:border-primary/50 hover:text-primary max-sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" strokeLinecap="round" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[0.55rem] font-medium text-white">
                2
              </span>
            </button>

            <a
              href="#visit"
              onClick={(e) => go(e, "#visit")}
              className="rounded-full bg-primary hover:bg-primary-deep px-5 py-2.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_-2px_rgba(186,143,96,0.4)] transition-all max-lg:hidden"
            >
              Reserve
            </a>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`hidden h-10 w-10 place-items-center rounded-full border transition-all duration-300 max-lg:grid ${
                open
                  ? "border-[#BA8F60]/60 bg-[#BA8F60]/15 text-[#BA8F60] shadow-[0_0_16px_rgba(186,143,96,0.25)]"
                  : "border-primary/25 text-primary hover:border-primary/50"
              }`}
            >
              <span className="relative block h-3.5 w-3.5">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full transition-all duration-300 ${
                    open ? "top-1.5 rotate-45 bg-[#BA8F60]" : "top-0.5 bg-current"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45 bg-[#BA8F60]" : "top-2.5 bg-current"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

    </header>
    </>
  );
}
