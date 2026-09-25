"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Pointer-tracked 3D tilt. The card rotates toward the cursor while a
 * specular sheen follows it across the surface — the effect that gives the
 * menu and gallery their sense of physical depth.
 */
export default function TiltCard({
  children,
  className = "",
  max = 9,
  lift = 26,
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees on either axis. */
  max?: number;
  /** How far the card rises toward the viewer, in pixels. */
  lift?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = card.current;
      const gloss = sheen.current;
      if (!el || !gloss) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rotX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const rotY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      const glossX = gsap.quickTo(gloss, "xPercent", { duration: 0.7, ease: "power3" });
      const glossY = gsap.quickTo(gloss, "yPercent", { duration: 0.7, ease: "power3" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * max * 2);
        rotX(-py * max * 2);
        glossX(px * 90);
        glossY(py * 90);
      };

      const enter = () =>
        gsap.to(el, { z: lift, duration: 0.6, ease: "power3.out", overwrite: "auto" });

      const leave = () => {
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.65)",
          overwrite: "auto",
        });
        gsap.to(gloss, { xPercent: 0, yPercent: 0, duration: 0.9, ease: "power3.out" });
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: card },
  );

  return (
    <div className="stage h-full">
      <div
        ref={card}
        className={`group relative h-full [transform-style:preserve-3d] ${className}`}
      >
        {children}
        <div
          ref={sheen}
          aria-hidden
          className="pointer-events-none absolute -inset-1/4 z-20 opacity-0 mix-blend-soft-light transition-opacity duration-500 [background:radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0%,transparent_60%)] group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
