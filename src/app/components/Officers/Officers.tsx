"use client";

import { useState } from "react";
import type { Officer, OfficerTeam, TeamFilter } from "@/data/officers";
import OfficerGroup from "./OfficerGroup";

type OfficersProps = {
  heading: string;
  year: string;
  executiveLabel: string;
  executiveBoard: Officer[];
  operationsLabel: string;
  operationsTeam: Officer[];
  teamFilters: TeamFilter[];
  teamOfficers: Officer[];
  emptyMessage: string;
};

const FILTER_BUTTON =
  "min-h-12 rounded-lg border px-2 py-1.5 text-sm leading-tight font-medium text-balance sm:text-[15px] md:h-12 md:min-h-0 md:px-4 md:py-0 md:text-[15px] md:leading-[1.4] lg:h-14 lg:px-9 lg:text-[17px]";
const FILTER_SELECTED = "border-navy bg-navy text-accent-foreground shadow-md shadow-navy/15";
const FILTER_UNSELECTED = "border-border bg-background text-navy";

export default function Officers({
  heading,
  year,
  executiveLabel,
  executiveBoard,
  operationsLabel,
  operationsTeam,
  teamFilters,
  teamOfficers,
  emptyMessage,
}: OfficersProps) {
  const [selectedTeam, setSelectedTeam] = useState<OfficerTeam>(teamFilters[0].id);
  const selectedFilter = teamFilters.find((filter) => filter.id === selectedTeam) ?? teamFilters[0];
  const visibleTeam = teamOfficers.filter((officer) => officer.team === selectedTeam);

  return (
    <section
      id="officers"
      className="mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-12 px-6 py-14 md:px-10 lg:px-16 lg:py-24"
    >
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-5xl leading-[1.15] tracking-[-0.02em] text-navy">{heading}</h2>
        <p className="font-display text-[26px] leading-[34px] font-medium tracking-[-0.01em] text-navy lg:absolute lg:right-0 lg:bottom-0">
          {year}
        </p>
      </div>

      <OfficerGroup label={executiveLabel} officers={executiveBoard} />
      <OfficerGroup label={operationsLabel} officers={operationsTeam} />

      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-center md:gap-3 lg:gap-4">
        {teamFilters.map((filter) => {
          const isSelected = filter.id === selectedTeam;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedTeam(filter.id)}
              className={`${FILTER_BUTTON} ${isSelected ? FILTER_SELECTED : FILTER_UNSELECTED}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <OfficerGroup
        label={selectedFilter.label}
        officers={visibleTeam}
        empty={<p className="text-center text-muted">{emptyMessage}</p>}
      />
    </section>
  );
}
