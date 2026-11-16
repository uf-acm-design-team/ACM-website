import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import Sponsors from "@/app/components/Sponsors/Sponsors";
import { SPONSORS_SECTION } from "@/data/sponsors";
import About from "@/app/components/About/About";
import Instagram from "@/app/components/Instagram/Instagram";
import Projects from "@/app/components/Projects/Projects";
import { PROJECTS, PROJECTS_HEADING, PROJECTS_SUBTITLE, PROJECT_TEAM_LABELS } from "@/data/projects";
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
        <Projects projects={PROJECTS} heading={PROJECTS_HEADING} subtitle={PROJECTS_SUBTITLE} teamLabels={PROJECT_TEAM_LABELS} />
        <WhyAcm />
      </main>
      <Footer />
    </>
  );
}
