import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import Sponsors from "@/app/components/Sponsors/Sponsors";
import { SPONSORS_SECTION } from "@/data/sponsors";
import About from "@/app/components/About/About";
import Instagram from "@/app/components/Instagram/Instagram";
import Officers from "@/app/components/Officers/Officers";
import Projects from "@/app/components/Projects/Projects";
import { PROJECTS, PROJECTS_HEADING, PROJECTS_SUBTITLE, PROJECT_TEAM_LABELS } from "@/data/projects";
import WhyAcm from "@/app/components/WhyAcm/WhyAcm";
import Fishbowl from "@/app/components/Fishbowl/fishbowl";
import { FISHBOWL } from "@/data/fishbowl";
import * as OFFICERS from "@/data/officers";
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
        <Officers
          heading={OFFICERS.OFFICERS_HEADING}
          year={OFFICERS.OFFICERS_YEAR}
          executiveLabel={OFFICERS.EXECUTIVE_BOARD_LABEL}
          executiveBoard={OFFICERS.EXECUTIVE_BOARD}
          operationsLabel={OFFICERS.OPERATIONS_TEAM_LABEL}
          operationsTeam={OFFICERS.OPERATIONS_TEAM}
          teamFilters={OFFICERS.TEAM_FILTERS}
          teamOfficers={OFFICERS.TEAM_OFFICERS}
          emptyMessage={OFFICERS.TEAM_EMPTY_MESSAGE}
        />
        <Projects projects={PROJECTS} heading={PROJECTS_HEADING} subtitle={PROJECTS_SUBTITLE} teamLabels={PROJECT_TEAM_LABELS} />
        <WhyAcm />
      </main>
      <Footer />
    </>
  );
}
