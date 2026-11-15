"use client";

import { useState, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { Project } from "@/data/projects";
import ProjectPanel from "./ProjectPanel";
import TabShape from "./TabShape";

const TAB_WIDTH = 336; // full tab width on wide screens
// Tab overlap and the share of the folder the tab row may take are CSS variables set on the tablist,
// so they can change at breakpoints (see TAB_ROW_VARS). Compact tabs (below lg) are shorter, so they
// overlap a little less and get a bit more of the row to stay readable; desktop keeps the original values.
// Phones (below sm) get a little extra row share so 14px labels like "Check-In" fit without breaking.
const TAB_ROW_VARS = "[--tab-overlap:18px] [--tab-share:88cqw] sm:[--tab-share:85cqw] lg:[--tab-overlap:24px] lg:[--tab-share:75cqw]";

type ProjectsProps = {
  projects: Project[];
  heading: string;
  subtitle: string;
};

export default function Projects({ projects, heading, subtitle }: ProjectsProps) {

  const [activeID, setActiveID] = useState(projects[0].id)
  const [usingArrows, setUsingArrows] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeProject = projects.find((project) => project.id === activeID) ?? projects[0];
  const activeIndex = projects.findIndex((project) => project.id === activeID);

  // Tabs are TAB_WIDTH wide, but shrink when the whole row would take more than --tab-share of the folder.
  // cqw is a percentage of the folder's width, because the folder wrapper is marked @container.
  // round(down, ..., 1px) keeps the width a whole number of pixels, so tab edges never land between pixels
  // (half-covered pixels show up as faint seams where the tabs meet).
  const tabCount = projects.length;
  const tabSizing = {
    "--tab-w": `min(${TAB_WIDTH}px, round(down, calc((var(--tab-share) + ${tabCount - 1} * var(--tab-overlap)) / ${tabCount}), 1px))`,
  } as CSSProperties;

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
    setUsingArrows(true);
    setActiveID(projects[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section id="projects" className="mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-6 px-6 py-14 md:px-10 lg:gap-10 lg:px-16 lg:pt-24 lg:pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-5xl font-medium leading-[1.15] tracking-[-0.02em] text-navy">
          {heading}
        </h2>
        <p className="text-right text-base text-muted lg:text-lg">{subtitle}</p>
      </div>

      <div className="group/folder @container">
        <div
          role="tablist"
          aria-label="Projects"
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            // Only reset when focus leaves the tab row, not when it moves between tabs.
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setUsingArrows(false);
            }
          }}
          style={tabSizing}
          className={`flex ${TAB_ROW_VARS}`}
        >
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
                style={{
                  zIndex: isActive ? 20 : projects.length - index,
                  width: "var(--tab-w)",
                  marginLeft: index > 0 ? "calc(-1 * var(--tab-overlap))" : 0,
                }}
                className={
                  // Active tabs are 47px (compact) / 60px (desktop) tall; these must match SIZES in TabShape.tsx.
                  // Inactive tabs start 4px / 6px lower and are clipped
                  // at the panel's top edge, so they look like they sit behind it.
                  // (The height classes live only inside the active/inactive branches so two heights never compete.)
                  `group relative flex shrink-0 items-center font-display font-medium focus-visible:outline-hidden ${isActive ? "h-[47px] text-navy lg:h-15" : "mt-1 h-[43px] overflow-hidden text-muted lg:mt-1.5 lg:h-[54px]"}`
                }>
                {(["compact", "full"] as const).map((size) => (
                  <TabShape
                    key={size}
                    size={size}
                    display={size === "compact" ? "flex lg:hidden" : "hidden lg:flex"}
                    active={isActive}
                    offset={`(${index} * (var(--tab-w) - var(--tab-overlap)))`}
                    showFocus={!usingArrows}
                    flareLeft={isActive && index > 0}
                  />
                ))}
                <span className="relative line-clamp-2 min-w-0 pr-7 pl-2.5 text-left text-sm leading-tight sm:pr-9 sm:pl-4 md:pl-6 md:text-base lg:pr-12 lg:pl-7 lg:text-lg">
                  {project.tabLabel}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="project-panel"
          aria-labelledby={`tab-${activeID}`}
          className={`
          relative z-10 -mt-px rounded-3xl rounded-tl-none border border-border bg-linear-to-r
          from-folder-start via-background via-40% to-folder-end px-5 pt-5 pb-6
          md:px-8 md:pt-6 md:pb-8 lg:pr-7 lg:pl-10 lg:pt-8 lg:pb-12
          ${usingArrows ? "" : "group-has-[[role=tab]:focus-visible]/folder:border-navy"}`}
        >
          <ProjectPanel project={activeProject} />
        </div>
      </div>
    </section>
  );
}
