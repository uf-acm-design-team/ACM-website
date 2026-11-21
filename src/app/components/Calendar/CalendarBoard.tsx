"use client";

import { useState } from "react";
import { addMonths, format, parseISO, startOfMonth, isSameMonth } from "date-fns";
import type { CalendarLabels, CalendarFilter, CalendarEvent } from "@/data/calendar";
import CalendarToolbar from "./CalendarToolbar";
import { getMonthDays, getWeekdayNames, groupEventsByDay, toDateKey } from "./calendarGrid";
import { useToday } from "./useToday";

type CalendarBoardProps = {
  events: CalendarEvent[];
  filters: CalendarFilter[];
  labels: CalendarLabels;
};

const ARROW_CLASS =
  "flex size-14 items-center justify-center rounded-full border border-border bg-surface-tint text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-8 ${direction === "next" ? "rotate-180" : ""}`}
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export default function CalendarBoard({ filters, labels, events }: CalendarBoardProps) {
  const today = useToday();
  const [monthOffset, setMonthOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<CalendarFilter["id"]>("all");
  const [query, setQuery] = useState("");

  const visibleMonth = today ? startOfMonth(addMonths(parseISO(today), monthOffset)) : null;
  const eventsByDay = groupEventsByDay(events);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-10">
        <button
          type="button"
          aria-label={labels.previousMonth}
          onClick={() => setMonthOffset((offset) => offset - 1)}
          className={ARROW_CLASS}
        >
          <ArrowIcon direction="previous" />
        </button>

        <h2 aria-live="polite" className="w-60 text-center text-3xl">
          {visibleMonth ? format(visibleMonth, "MMMM yyyy") : ""}
        </h2>

        <button
          type="button"
          aria-label={labels.nextMonth}
          onClick={() => setMonthOffset((offset) => offset + 1)}
          className={ARROW_CLASS}
        >
          <ArrowIcon direction="next" />
        </button>
      </div>

      <CalendarToolbar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        query={query}
        onQueryChange={setQuery}
        labels={labels}
      />

      <div className="flex flex-col gap-2">
        <div className="grid h-11 grid-cols-7 items-center gap-2 text-center text-[13px] font-medium text-muted">
          {getWeekdayNames().map((name) => (
            <p key={name}>{name}</p>
          ))}
        </div>

        {visibleMonth && (
          <div className="grid grid-cols-7 gap-2">
            {getMonthDays(visibleMonth).map((day) => {
              const key = toDateKey(day);
              const dayEvents = eventsByDay.get(key) ?? [];
              const inMonth = isSameMonth(day, visibleMonth);

              return (
                <div
                  key={key}
                  className={`h-36 rounded-xl border border-border p-3 ${inMonth ? "bg-surface" : "bg-surface-tint"}`}
                >
                  {format(day, "d")}
                  {dayEvents.map((event) => (
                    <p key={event.id} className="text-xs">{event.title}</p>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
