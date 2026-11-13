import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import Sponsors from "@/app/components/Sponsors/Sponsors";
import About from "@/app/components/About/About";
import Instagram from "@/app/components/Instagram/Instagram";
import Officers from "@/app/components/Officers/Officers";
import Projects from "@/app/components/Projects/Projects";
import WhyAcm from "@/app/components/WhyAcm/WhyAcm";
import Fishbowl from "@/app/components/Fishbowl/fishbowl";
import { FISHBOWL } from "@/data/fishbowl";
import Footer from "@/app/components/Footer/Footer";
import GetInvolved from "@/app/components/GetInvolved/GetInvolved";
import { GET_INVOLVED } from "@/data/getInvolved";

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
        <Officers />
        <Projects />
        <WhyAcm />
        <GetInvolved {...GET_INVOLVED} />
      </main>
      <Footer />
    </>
  );
}
