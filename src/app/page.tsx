import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import Sponsors from "@/app/components/Sponsors/Sponsors";
import { SPONSORS_SECTION } from "@/data/sponsors";
import About from "@/app/components/About/About";
import Instagram from "@/app/components/Instagram/Instagram";
import Officers from "@/app/components/Officers/Officers";
import Projects from "@/app/components/Projects/Projects";
import WhyAcm from "@/app/components/WhyAcm/WhyAcm";
import Fishbowl from "@/app/components/Fishbowl/fishbowl";
import { FISHBOWL } from "@/data/fishbowl";
import Footer from "@/app/components/Footer/Footer";
import { ABOUT } from "@/data/about";
import { getInstagram } from "@/data/instagram";

export default async function Home() {
  const instagram = await getInstagram();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Sponsors {...SPONSORS_SECTION} />
        <About content={ABOUT} />
        <Fishbowl {...FISHBOWL} />
        <Instagram content={instagram} />
        <Officers />
        <Projects />
        <WhyAcm />
      </main>
      <Footer />
    </>
  );
}
