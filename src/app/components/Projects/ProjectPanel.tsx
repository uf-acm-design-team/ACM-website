import type { Project } from "@/data/projects";
import Image from "next/image";
import ArrowIcon from "./ArrowIcon";

type ProjectPanelProps = {
  project: Project;
};

export default function ProjectPanel({ project }: ProjectPanelProps) {
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-start-2 lg:row-start-3 lg:flex-col lg:items-start lg:gap-4">
        {project.tech && (
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-lg border border-border px-2.5 py-1 text-sm text-muted">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="-mr-3 ml-auto flex flex-wrap items-center gap-x-1 gap-y-2 lg:mr-0 lg:ml-0">
          {project.websiteHref && (
            <a
              href={project.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-3 rounded-lg bg-navy px-4 font-medium text-accent-foreground lg:gap-5 lg:px-5"
            >
              Visit website
              <ArrowIcon />
            </a>
          )}
          {project.teamHref && (
            <a
              href={project.teamHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-navy lg:px-5 lg:text-[17px]"
            >
              Meet the team
              <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
