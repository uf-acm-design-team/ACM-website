import { format } from "date-fns";
import type { CalendarEvent, CalendarEventType, CalendarLabels } from "@/data/calendar";
import { formatEventTime } from "./calendarGrid";

type DayCardProps = {
  day: Date;
  events: CalendarEvent[];
  inMonth: boolean;
  isToday: boolean;
  labels: CalendarLabels;
  typeLabels: Record<CalendarEventType, string>;
};

function PinIcon() {
  return (
    <svg viewBox="0 0 10 12" aria-hidden="true" fill="none" className="h-3 w-2.5 shrink-0">
      <path
        d="M5 0.8C2.7 0.8 1 2.5 1 4.7C1 7.5 5 11.2 5 11.2C5 11.2 9 7.5 9 4.7C9 2.5 7.3 0.8 5 0.8Z"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <circle cx="5" cy="4.7" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function DayCard({ day, events, inMonth, isToday, labels, typeLabels }: DayCardProps) {
  const [event, ...moreEvents] = events;

  const cardStyle = isToday
    ? "border-[1.5px] border-indigo bg-surface hover:shadow-indigo/20"
    : inMonth
      ? "border border-border bg-surface hover:border-indigo/50 hover:shadow-navy/10"
      : "border border-border bg-surface-tint hover:shadow-navy/5";

  const numberStyle = isToday
    ? "bg-indigo text-surface"
    : !inMonth
      ? "text-muted"
      : event
        ? "text-violet"
        : "text-navy";

  return (
    <li
      className={`flex h-36 flex-col gap-2 rounded-xl px-2.5 pt-2.5 pb-3 transition hover:shadow-lg motion-reduce:transition-none ${cardStyle}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          aria-hidden="true"
          className={`flex size-[25px] shrink-0 items-center justify-center rounded-full text-sm font-medium ${numberStyle}`}
        >
          {format(day, "d")}
        </span>
        <span className="sr-only">
          {format(day, "EEEE, MMMM d")}
          {isToday && `, ${labels.today}`}
        </span>

        <span className="flex items-center gap-2">
          {moreEvents.length > 0 && (
            <span className="text-[11.5px] text-muted">
              +{moreEvents.length} {labels.moreEvents}
            </span>
          )}
          {event?.eventType && (
            <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-violet">
              {typeLabels[event.eventType]}
            </span>
          )}
        </span>
      </div>

      {event && (
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-[18px] overflow-hidden">
          <p className="line-clamp-2 px-1.5 text-[13.5px] font-medium leading-[18px]">{event.title}</p>
          <div className="flex items-center justify-between gap-2 border-t border-border pt-2 text-[11.5px] leading-[14px]">
            <span className="font-medium text-violet">{formatEventTime(event, labels.allDay)}</span>
            {event.location && (
              <span className="flex items-center gap-1 text-muted">
                <PinIcon />
                {event.location}
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
