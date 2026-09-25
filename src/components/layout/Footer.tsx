"use client";

import { BRAND, NAV_LINKS } from "@/lib/site";
import { scrollToSection } from "@/lib/gsap";

const SOCIALS = ["Instagram", "Substack", "Pinterest", "LinkedIn"];

const COLUMNS = [
  {
    title: "About Us",
    links: ["Our story", "The roastery", "Sourcing ethics", "Press"],
  },
  {
    title: "Shop",
    links: ["Subscriptions", "Whole bean", "Brew kit", "Gift cards"],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#F4ECE1] pt-28 max-sm:pt-20 border-t border-[#E8DCCF]">
      <div className="absolute inset-x-0 top-0 h-px bg-[#BA8F60]/30" />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        {/* ── Call to the counter ─────────────────────────────── */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-14 max-lg:grid-cols-2 max-lg:gap-10 max-sm:grid-cols-1">
          <div data-reveal="up">
            <p className="font-display text-4xl italic leading-tight text-[#1C130D] max-sm:text-3xl">
              {BRAND.name}
            </p>
            <p className="mt-2 font-sans text-[0.6rem] uppercase tracking-[0.34em] font-semibold text-[#8C5F32]">
              {BRAND.established}
            </p>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-[#6A5A4D]">
              A speciality coffee house and roastery built on direct trade, slow roasting
              and the belief that a good cup deserves an unhurried room.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} data-reveal="up">
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.32em] font-semibold text-[#8C5F32]">
                {col.title}
              </p>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[#5C493B] transition-colors duration-300 hover:text-[#1C130D]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="up">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.32em] font-semibold text-[#8C5F32]">
              Navigate
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(l.href);
                    }}
                    className="text-sm text-[#5C493B] transition-colors duration-300 hover:text-[#1C130D]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-[#5C493B]">{BRAND.email}</p>
            <p className="text-sm text-[#5C493B]">{BRAND.phone}</p>
          </div>
        </div>

        {/* ── Oversized wordmark ──────────────────────────────── */}
        <div className="mt-20 max-sm:mt-14" data-reveal="fade">
          <p className="select-none whitespace-nowrap text-center font-display text-[clamp(3.5rem,15vw,15rem)] font-light leading-[0.8] tracking-tight text-[#BA8F60]/15">
            {BRAND.name.toUpperCase()}
          </p>
        </div>

        {/* ── Fine print ──────────────────────────────────────── */}
        <div className="mt-12 flex items-center justify-between border-t border-[#E8DCCF] py-8 max-md:flex-col max-md:gap-5 max-sm:mt-8">
          <p className="font-sans text-[0.68rem] tracking-[0.14em] text-[#7A695C]">
            © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-7 max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#5C493B] transition-colors duration-300 hover:text-[#8C5F32]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
