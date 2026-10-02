/** Small-caps section label, flanked by a gold hairline. */
export default function Eyebrow({
  children,
  align = "left",
  className = "",
  reveal = true,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /**
   * Opts out of the site-wide `[data-reveal]` scroll choreography — needed
   * inside pinned sections that drive their own timeline.
   */
  reveal?: boolean;
}) {
  return (
    <div
      {...(reveal ? { "data-reveal": "fade" } : {})}
      className={`flex items-center gap-3.5 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-px w-7 bg-[#BA8F60]/40 max-sm:w-3" />
      <span className="font-sans text-[0.66rem] font-semibold uppercase leading-none tracking-[0.36em] text-[#8C5F32] max-sm:text-[0.52rem] max-sm:tracking-[0.16em] whitespace-nowrap">
        {children}
      </span>
      <span className="h-px w-7 bg-[#BA8F60]/40 max-sm:w-3" />
    </div>
  );
}
