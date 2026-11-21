import type { CalendarFilter, CalendarLabels } from "@/data/calendar";

type FilterId = CalendarFilter["id"];

type CalendarToolbarProps = {
  filters: CalendarFilter[];
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
  query: string;
  onQueryChange: (query: string) => void;
  labels: CalendarLabels;
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="size-4 shrink-0"
    >
      <circle cx="6.25" cy="6.25" r="4.5" />
      <path d="M10.2 10.2L14.6 14.6" />
    </svg>
  );
}

export default function CalendarToolbar({
  filters,
  activeFilter,
  onFilterChange,
  query,
  onQueryChange,
  labels,
}: CalendarToolbarProps) {
  return (
    <div className="flex items-end justify-between border-b border-border">
      <div role="group" aria-label={labels.filters} className="flex gap-11">
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.id)}
              className={`rounded-sm pb-4 text-[17px] leading-[22px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive ? "font-medium text-violet" : "text-muted hover:text-navy"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="pb-2.5">
        <label className="flex h-[42px] w-[300px] items-center gap-2.5 rounded-[10px] border border-border bg-surface px-3.5 text-muted focus-within:border-indigo focus-within:ring-1 focus-within:ring-indigo">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
            className="w-full bg-transparent text-[15px] text-navy outline-none placeholder:text-muted"
          />
        </label>
      </div>
    </div>
  );
}
