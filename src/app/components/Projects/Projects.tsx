import { Project } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";

type ProjectsProps = {
  projects: Project[];
  heading: string;
  subtitle: string;
};

export default function Projects({ projects, heading, subtitle }: ProjectsProps) {
  return (
    <section id="projects" className="mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-10 px-16 pt-24 pb-20">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-5xl font-medium leading-[1.15] tracking-[-0.02em] text-acm-navy">
          {heading}
        </h2>
        <p className="text-lg text-acm-muted">{subtitle}</p>
      </div>

      <div className="rounded-xl border border-acm-border p-10">
        <ProjectPanel project={projects[0]} />
      </div>
    </section>
  );
}
