import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/components/Hero/Hero";
import About from "@/app/components/About/About";
import Officers from "@/app/components/Officers/Officers";
import Projects from "@/app/components/Projects/Projects";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Officers />
        <Projects />
      </main>
      {/* TODO: add Footer */}
    </>
  );
}
