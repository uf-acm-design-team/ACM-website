import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import Sponsors from "@/app/components/Sponsors/Sponsors";
import About from "@/app/components/About/About";
import Instagram from "@/app/components/Instagram/Instagram";
import Officers from "@/app/components/Officers/Officers";
import Projects from "@/app/components/Projects/Projects";
import { PROJECTS, PROJECTS_HEADING, PROJECTS_SUBTITLE } from "@/data/projects";
import WhyAcm from "@/app/components/WhyAcm/WhyAcm";
import Fishbowl from "@/app/components/Fishbowl/fishbowl";
import { FISHBOWL } from "@/data/fishbowl";
import * as OFFICERS from "@/data/officers";
import Footer from "@/app/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Sponsors />
        <About />
        <Fishbowl {...FISHBOWL} />
        <Instagram />
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
        <Projects projects={PROJECTS} heading={PROJECTS_HEADING} subtitle={PROJECTS_SUBTITLE} />
        <WhyAcm />
      </main>
      <Footer />
    </>
  );
}
