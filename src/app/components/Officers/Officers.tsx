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

// Filter button looks from Figma. Selected is filled navy; the rest are outlined.
const FILTER_BUTTON = "h-14 rounded-lg border px-9 text-[17px] font-medium leading-[1.4]";
// The soft navy-tinted shadow lifts the selected button slightly, so it reads as the active one.
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
  // TODO (UAWR2-91): also take emptyMessage here once you build the empty state.
}: OfficersProps) {
  // TODO (UAWR2-91): make this a client component and turn selectedTeam into state,
  // starting on the first filter, so clicking a button changes it.
  const selectedTeam: OfficerTeam = teamFilters[0].id;
  const selectedFilter = teamFilters.find((filter) => filter.id === selectedTeam) ?? teamFilters[0];

  // TODO (UAWR2-91): only keep the officers whose team matches selectedTeam.
  const visibleTeam = teamOfficers;

  return (
    <section
      id="officers"
      className="mx-auto flex max-w-[1440px] scroll-mt-20 flex-col gap-12 px-6 py-14 md:px-10 lg:px-16 lg:py-24"
    >
      {/* The title stays centered; from lg up the year sits at the bottom-right of the header. */}
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-5xl leading-[1.15] tracking-[-0.02em] text-navy">{heading}</h2>
        <p className="font-display text-[26px] leading-[34px] font-medium tracking-[-0.01em] text-navy lg:absolute lg:right-0 lg:bottom-0">
          {year}
        </p>
      </div>

      <OfficerGroup label={executiveLabel} officers={executiveBoard} />
      <OfficerGroup label={operationsLabel} officers={operationsTeam} />

      <div className="flex flex-wrap justify-center gap-4">
        {teamFilters.map((filter) => {
          const isSelected = filter.id === selectedTeam;
          return (
            // TODO (UAWR2-91): clicking selects this team, and screen readers need to know which one is selected.
            <button
              key={filter.id}
              type="button"
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
        // TODO (UAWR2-91): show emptyMessage here when the selected team has nobody yet.
        empty={null}
      />
    </section>
  );
}
