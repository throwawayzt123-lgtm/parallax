import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

/**
 * The house CTA. The solid variant carries a lit top edge and a warm cast
 * shadow so it reads as a raised, physical key rather than a flat rectangle.
 */
export default function GoldButton({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-8 py-3.5 font-sans text-[0.72rem] uppercase tracking-[0.22em] font-medium transition-all duration-300 ease-[var(--ease-silk)] max-sm:gap-2 max-sm:px-5 max-sm:py-3 max-sm:text-[0.62rem] max-sm:tracking-[0.16em]";

  const skin =
    variant === "solid"
      ? "bg-[#BA8F60] text-white hover:bg-[#A47748] shadow-[0_6px_18px_-4px_rgba(186,143,96,0.45)] hover:shadow-[0_10px_24px_-4px_rgba(186,143,96,0.6)] hover:-translate-y-0.5 active:translate-y-0"
      : "border border-[#BA8F60]/40 bg-transparent text-current hover:border-[#BA8F60] hover:bg-[#BA8F60]/10 hover:text-[#8C5F32] hover:-translate-y-0.5 active:translate-y-0";

  return (
    <Link href={href} className={`${base} ${skin} ${className}`}>
      <span className="relative">{children}</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="relative h-3 w-3 transition-transform duration-300 ease-[var(--ease-silk)] group-hover:translate-x-1"
      >
        <path
          d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
