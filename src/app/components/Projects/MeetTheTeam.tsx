"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProjectTeam, TeamLabels } from "@/data/projects";

type MeetTheTeamProps = {
  projectId: string;
  team: ProjectTeam;
  labels: TeamLabels;
};

const SCREEN_MARGIN = 16;

export default function MeetTheTeam({ projectId, team, labels }: MeetTheTeamProps) {
  const popoverId = `team-${projectId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    function keepOnScreen() {
      const button = buttonRef.current;
      const popover = popoverRef.current;
      if (!button || !popover) return;

      const buttonBox = button.getBoundingClientRect();
      const width = popover.offsetWidth;
      const centeredLeft = buttonBox.left + buttonBox.width / 2 - width / 2;
      const maxLeft = document.documentElement.clientWidth - SCREEN_MARGIN - width;
      const left = Math.min(Math.max(centeredLeft, SCREEN_MARGIN), maxLeft);
      setShift(left - centeredLeft);
    }

    keepOnScreen();
    window.addEventListener("resize", keepOnScreen);
    return () => window.removeEventListener("resize", keepOnScreen);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-12 items-center gap-2.5 rounded-lg text-[15px] font-medium text-navy focus-visible:outline-offset-4 lg:text-base"
      >
        {labels.button}
        <ChevronIcon open={isOpen} />
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        style={{ marginLeft: shift }}
        className={`absolute top-full left-1/2 z-30 mt-3 w-max max-w-[calc(100vw-2rem)] origin-top -translate-x-1/2 rounded-xl border border-border bg-background p-4 shadow-lg shadow-navy/10 transition-[opacity,translate,scale,display] transition-discrete duration-200 ease-out motion-reduce:transition-none starting:-translate-y-1 starting:scale-95 starting:opacity-0 ${isOpen ? "block" : "hidden -translate-y-1 scale-95 opacity-0"}`}
      >
        <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
          <NameList heading={labels.leads} names={team.leads} />
          <div className="col-span-2 my-2 h-px bg-border" />
          <NameList heading={labels.members} names={team.members} />
        </div>
        <span
          aria-hidden="true"
          style={{ left: `calc(50% - ${shift}px)` }}
          className="absolute bottom-full -mb-[7px] size-3 -translate-x-1/2 rotate-45 border-t border-l border-border bg-background"
        />
      </div>
    </div>
  );
}

function NameList({ heading, names }: { heading: string; names: string[] }) {
  return (
    <>
      <p className="col-span-2 mb-0.5 text-xs font-medium tracking-wide text-muted uppercase">{heading}</p>
      <ul className="contents">
        {names.map((name, index) => (
          <li key={`${name}-${index}`} className="text-[15px] leading-[22px] text-navy">
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
