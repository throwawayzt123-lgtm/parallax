import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/layout/MotionProvider";
import { BRAND } from "@/lib/site";
import { COLORS } from "@/lib/colors";

/* High-contrast old-style serif for every display line. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Geometric grotesque for UI, labels and body copy. */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "A speciality coffee house and roastery in New York, USA. Direct-trade origins, slow roasting and a room built for unhurried mornings.",
  keywords: [
    "PARALLAX",
    "speciality coffee",
    "coffee house",
    "New York cafe",
    "SoHo coffee",
    "single origin",
    "cold brew",
  ],
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "A slow ritual, poured with intent.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F2",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} antialiased`}
    >
      <body className="bg-[#FFF9F2] font-sans text-[#1C130D]">
        <Header />
        <MotionProvider>
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
