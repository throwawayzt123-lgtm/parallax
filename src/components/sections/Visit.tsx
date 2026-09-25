"use client";

import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import { BRAND } from "@/lib/site";

const DETAILS = [
  { label: "The address", value: BRAND.address },
  { label: "Opening hours", value: BRAND.hours },
  { label: "Telephone", value: BRAND.phone },
  { label: "Correspondence", value: BRAND.email },
];

const FIELDS = [
  { name: "name", label: "Your name", type: "text", placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
  { name: "date", label: "Preferred date", type: "text", placeholder: "Sat 14 Sept · 10:30" },
];

export default function Visit() {
  return (
    <section
      id="visit"
      className="relative overflow-hidden bg-[#F8F0E5] py-36 max-lg:py-28 max-sm:py-20"
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-[1.05fr_1fr] items-start gap-20 px-12 max-xl:gap-14 max-lg:grid-cols-1 max-lg:px-8 max-sm:gap-12 max-sm:px-5">
        {/* ── Where to find us ────────────────────────────────── */}
        <div>
          <Eyebrow>Visit Our Coffee House</Eyebrow>

          <h2
            data-reveal="up"
            className="mt-6 max-w-[15ch] font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.015em] text-[#1C130D]"
          >
            Come and sit <em className="text-[#966A3B] italic">a while</em>.
          </h2>

          <p
            data-reveal="up"
            className="mt-6 max-w-[46ch] leading-relaxed text-[#4A3B32] max-sm:text-[0.95rem]"
          >
            Walk-ins are always welcome. Reserve only if you would like the
            mezzanine, a tasting flight, or a table for more than four.
          </p>

          <dl data-reveal-group className="mt-12 max-sm:mt-9">
            {DETAILS.map((d) => (
              <div
                key={d.label}
                data-reveal-item
                className="flex items-baseline justify-between gap-8 border-b border-[#E8DCCF] py-4.5 max-sm:flex-col max-sm:items-start max-sm:gap-1.5 max-sm:py-3.5"
              >
                <dt className="shrink-0 font-sans text-[0.62rem] uppercase tracking-[0.28em] font-semibold text-[#8C5F32]">
                  {d.label}
                </dt>
                <dd className="text-right font-display text-xl italic text-[#1C130D] max-sm:text-left max-sm:text-lg">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Street view */}
          <div
            data-reveal="scale"
            className="relative mt-12 aspect-[16/8] overflow-hidden rounded-2xl border border-[#E8DCCF] shadow-[0_16px_36px_-10px_rgba(28,19,13,0.12)] max-sm:mt-9"
          >
            <Image
              src="/images/gallery/interior-bikes.jpg"
              alt={`The long bar at ${BRAND.name}, New York`}
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6 max-sm:p-5">
              <span className="font-display text-lg italic text-white">
                SoHo, New York, USA
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-3.5 py-1 font-sans text-[0.58rem] uppercase tracking-[0.2em] font-medium text-white">
                Open now
              </span>
            </div>
          </div>
        </div>

        {/* ── Reservation card ────────────────────────────────── */}
        <div data-reveal="right">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-3xl border border-[#E8DCCF] bg-white p-8 sm:p-10 shadow-[0_24px_50px_-12px_rgba(28,19,13,0.08)] max-sm:p-6"
          >
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] font-semibold text-[#8C5F32]">
              Reservations
            </p>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-medium leading-tight text-[#1C130D]">
              Reserve a table
            </h3>
            <p className="mt-2.5 text-[0.88rem] leading-relaxed text-[#6A5A4D]">
              We hold bookings for thirty minutes. Same-day requests, please
              call the bar.
            </p>

            <div className="mt-8 space-y-5 max-sm:mt-6 max-sm:space-y-4">
              {FIELDS.map((f) => (
                <label key={f.name} className="block">
                  <span className="font-sans text-[0.58rem] uppercase tracking-[0.24em] font-semibold text-[#5C493B]">
                    {f.label}
                  </span>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    className="mt-2 w-full border-b border-[#E8DCCF] bg-transparent pb-2.5 font-display text-base text-[#1C130D] outline-none transition-colors duration-300 placeholder:text-[#A8988B] focus:border-[#BA8F60]"
                  />
                </label>
              ))}

              <label className="block">
                <span className="font-sans text-[0.58rem] uppercase tracking-[0.24em] font-semibold text-[#5C493B]">
                  Anything we should know
                </span>
                <textarea
                  rows={3}
                  name="notes"
                  placeholder="Six of us, celebrating a birthday."
                  className="mt-2 w-full resize-none border-b border-[#E8DCCF] bg-transparent pb-2.5 font-display text-base text-[#1C130D] outline-none transition-colors duration-300 placeholder:text-[#A8988B] focus:border-[#BA8F60]"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#BA8F60] hover:bg-[#A47748] py-3.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 shadow-[0_6px_18px_-4px_rgba(186,143,96,0.45)] hover:-translate-y-0.5 active:translate-y-0 max-sm:mt-7"
            >
              Request a table
            </button>

            <p className="mt-4 text-center font-sans text-[0.62rem] uppercase tracking-[0.16em] text-[#7A695C]">
              Or call {BRAND.phone}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
