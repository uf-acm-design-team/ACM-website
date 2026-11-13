"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Project } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";
import TabShape from "./TabShape";

type ProjectsProps = {
  projects: Project[];
  heading: string;
  subtitle: string;
};

export default function Projects({ projects, heading, subtitle }: ProjectsProps) {

  const [activeID, setActiveID] = useState(projects[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeProject = projects.find((project) => project.id === activeID) ?? projects[0];
  const activeIndex = projects.findIndex((project) => project.id === activeID);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number;
  
    if (event.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % projects.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + projects.length) % projects.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = projects.length - 1;
    } else {
      return;
    }
  
    event.preventDefault();
    setActiveID(projects[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section id="projects" className="mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-10 px-16 pt-24 pb-20">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-5xl font-medium leading-[1.15] tracking-[-0.02em] text-navy">
          {heading}
        </h2>
        <p className="text-lg text-muted">{subtitle}</p>
      </div>

      <div className="group/folder @container">
        <div role="tablist" aria-label="Projects" onKeyDown={handleKeyDown} className="flex">
          {projects.map((project, index) => {
            const isActive = project.id === activeID;
            return (
              <button
                key={project.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                type="button"
                role="tab"
                id={`tab-${project.id}`}
                aria-selected={isActive}
                aria-controls="project-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveID(project.id)}
                style={{ zIndex: isActive ? 20 : projects.length - index }}
                className={
                  `group relative flex h-14 w-[336px] shrink-0 items-center font-display text-lg font-medium focus-visible:outline-hidden ${index > 0 ? "-ml-4" : ""} ${isActive ? "text-navy" : "translate-y-1.5 pb-1.5 text-muted"}`
                }>
                <TabShape active={isActive} offset={index * 320} />
                <span className="relative pl-7">{project.tabLabel}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="project-panel"
          aria-labelledby={`tab-${activeID}`}
          className="
          relative z-10 -mt-px rounded-3xl border border-border bg-linear-to-r 
          from-folder-start via-background via-40% to-folder-end px-10 
          pt-8 pb-12 rounded-tl-none group-has-[[role=tab]:focus-visible]/folder:border-navy"
        >
          <ProjectPanel project={activeProject} />
        </div>
      </div>
    </section>
  );
}
