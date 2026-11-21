"use client";

import { useState } from "react";
import { addMonths, format, parseISO, startOfMonth, isSameMonth } from "date-fns";
import type { CalendarLabels, CalendarFilter, CalendarEvent, CalendarEventType } from "@/data/calendar";
import CalendarToolbar from "./CalendarToolbar";
import CalendarUpcomingList from "./CalendarUpcomingList";
import DayCard from "./DayCard";
import {
  filterEvents,
  getEventsInMonth,
  getMonthDays,
  getWeekdayNames,
  groupEventsByDay,
  toDateKey,
} from "./calendarGrid";
import { useToday } from "./useToday";

type CalendarBoardProps = {
  events: CalendarEvent[];
  filters: CalendarFilter[];
  labels: CalendarLabels;
  typeLabels: Record<CalendarEventType, string>;
  checkInHref: string;
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

export default function CalendarBoard({ events, filters, labels, typeLabels, checkInHref }: CalendarBoardProps) {
  const today = useToday();
  const [monthOffset, setMonthOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<CalendarFilter["id"]>("all");
  const [query, setQuery] = useState("");

  const visibleMonth = today ? startOfMonth(addMonths(parseISO(today), monthOffset)) : null;
  const visibleEvents = filterEvents(events, activeFilter, query, today);
  const eventsByDay = groupEventsByDay(visibleEvents);
  const monthEvents = visibleMonth ? getEventsInMonth(visibleEvents, visibleMonth) : [];

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

      <p aria-live="polite" className="sr-only">
        {visibleMonth &&
          `${monthEvents.length} ${monthEvents.length === 1 ? labels.eventCountOne : labels.eventCountOther}`}
      </p>

      {activeFilter === "upcoming" ? (
        visibleMonth &&
        today && (
          <CalendarUpcomingList
            events={monthEvents}
            today={today}
            checkInHref={checkInHref}
            labels={labels}
            typeLabels={typeLabels}
          />
        )
      ) : (
        <div className="flex flex-col gap-2">
          <div
            aria-hidden="true"
            className="grid h-11 grid-cols-7 items-center gap-2 text-center text-[13px] font-medium text-muted"
          >
            {getWeekdayNames().map((name) => (
              <p key={name}>{name}</p>
            ))}
          </div>

          {visibleMonth && (
            <ol role="list" className="grid grid-cols-7 gap-2">
              {getMonthDays(visibleMonth).map((day) => {
                const key = toDateKey(day);
                const dayEvents = eventsByDay.get(key) ?? [];
                const inMonth = isSameMonth(day, visibleMonth);

                return (
                  <DayCard
                    key={key}
                    day={day}
                    events={inMonth ? dayEvents : []}
                    inMonth={inMonth}
                    isToday={key === today}
                    labels={labels}
                    typeLabels={typeLabels}
                  />
                );
              })}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
