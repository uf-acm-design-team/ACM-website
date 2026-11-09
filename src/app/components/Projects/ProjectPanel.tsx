import type { Project } from "@/data/projects";
import Image from "next/image";
import ArrowIcon from "./ArrowIcon";

type ProjectPanelProps = {
  project: Project;
};

export default function ProjectPanel({ project }: ProjectPanelProps) {
  return (
    <div className="flex items-center gap-12">
      <div className="flex aspect-[732/438] w-[59.4%] shrink-0 items-center justify-center rounded-xl border border-border bg-surface-tint">
        <p className="text-muted">Placeholder image</p> {/* TODO: real image */}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-3.5">
            <Image src="/icons/bullet-acm-fish.svg" alt="" width={36} height={14} />
            <h3 className="font-display text-4xl font-medium leading-[1.14] tracking-[-0.02em] text-navy">
                {project.title}
            </h3>
        </div>
        <p className="text-lg text-muted">{project.description}</p>
        {project.tech && (
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-lg border border-border px-2.5 py-1 text-sm text-muted">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-1">
            {project.websiteHref && (
            <a href={project.websiteHref} target="_blank" rel="noopener noreferrer" 
                className="inline-flex h-12 items-center gap-5 rounded-lg bg-navy px-5 font-medium text-accent-foreground">
                Visit website
                <ArrowIcon />
            </a>
            )}
            {project.teamHref && (
            <a href={project.teamHref} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-lg px-5 text-[17px] font-medium text-navy">
                Meet the team
                <ArrowIcon />
            </a>
            )}
        </div>
      </div>
    </div>
  );
}
