import CoffeeScrollHero from "@/components/sections/CoffeeScrollHero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import PourRitualSection from "@/components/sections/PourRitualSection";
import Menu from "@/components/sections/Menu";
import Craft from "@/components/sections/Craft";
import Origins from "@/components/sections/Origins";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";

/**
 * The scroll-driven pour opens the site. Title and description come from the
 * root layout, which already carries the house metadata.
 */
export default function Home() {
  return (
    <main>
      <CoffeeScrollHero />
      <Marquee />
      <Story />
      <PourRitualSection />
      <Menu />
      <Craft />
      <Origins />
      <Gallery />
      <Testimonials />
      <Visit />
    </main>
  );
}
