import type { Project, TeamLabels } from "@/data/projects";
import Image from "next/image";
import ArrowIcon from "./ArrowIcon";
import MeetTheTeam from "./MeetTheTeam";

type ProjectPanelProps = {
  project: Project;
  teamLabels: TeamLabels;
};

export default function ProjectPanel({ project, teamLabels }: ProjectPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[59.4%_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-12 lg:gap-y-4">
      <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-2 lg:gap-4">
        <div className="flex items-center gap-3.5">
          <Image src="/icons/bullet-acm-fish.svg" alt="" width={36} height={14} />
          <h3 className="font-display text-[28px] font-medium leading-[1.14] tracking-[-0.02em] text-navy md:text-[32px] lg:text-4xl">
            {project.title}
          </h3>
        </div>
        <p className="text-base text-muted lg:text-lg">{project.description}</p>
      </div>

      <div className="flex aspect-[3/2] w-full items-center justify-center self-center rounded-xl border border-border bg-surface-tint md:aspect-[2/1] lg:col-start-1 lg:row-span-full lg:row-start-1 lg:aspect-[732/438]">
        <p className="text-muted">Placeholder image</p> {/* TODO: real image */}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-5 lg:col-start-2 lg:row-start-3 lg:gap-y-4">
        {project.tech && (
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-lg border border-border px-2.5 py-1 text-sm text-muted">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-x-6">
          {project.websiteHref && (
            <a
              href={project.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-3 rounded-lg bg-navy px-4 text-[15px] font-medium text-accent-foreground lg:gap-5 lg:px-5 lg:text-base"
            >
              Visit website
              <ArrowIcon />
            </a>
          )}
          {project.team && <MeetTheTeam key={project.id} projectId={project.id} team={project.team} labels={teamLabels} />}
        </div>
      </div>
    </div>
  );
}
