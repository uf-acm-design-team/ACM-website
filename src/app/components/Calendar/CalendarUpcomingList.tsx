import { format, parseISO } from "date-fns";
import type { CalendarEvent, CalendarEventType, CalendarLabels } from "@/data/calendar";
import { formatEventTime, toDateKey } from "./calendarGrid";
import ExternalArrowIcon from "./ExternalArrowIcon";

type CalendarUpcomingListProps = {
  events: CalendarEvent[];
  today: string;
  checkInHref: string;
  labels: CalendarLabels;
  typeLabels: Record<CalendarEventType, string>;
};

const PLACEHOLDER_ROWS = [
  { opacity: "opacity-90", title: "w-[300px]", meta: "w-[210px]", category: "w-[72px]" },
  { opacity: "opacity-70", title: "w-[240px]", meta: "w-[190px]", category: "w-[56px]" },
  { opacity: "opacity-50", title: "w-[330px]", meta: "w-[230px]", category: "w-[72px]" },
];

const ROW_CLASS = "flex items-center gap-6 border-t border-border py-7 pr-9 pl-5";

export default function CalendarUpcomingList({
  events,
  today,
  checkInHref,
  labels,
  typeLabels,
}: CalendarUpcomingListProps) {
  return (
    <div className="flex flex-col border-b border-border">
      <p className="pt-2 pb-4 text-[15px] text-muted">
        {labels.upcomingCaption} · {format(parseISO(today), "EEEE, MMMM d")}
      </p>

      <ol role="list">
        {events.map((event) => {
          const start = parseISO(event.start);
          const isToday = toDateKey(start) === today;
          const meta = [formatEventTime(event, labels.allDay), event.location].filter(Boolean).join(" · ");

          const content = (
            <>
              <span
                aria-hidden="true"
                className={`w-[156px] shrink-0 font-display text-[64px] font-medium leading-[68px] tracking-[-0.03em] ${
                  isToday ? "text-violet" : "text-navy"
                }`}
              >
                {format(start, "d")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="sr-only">
                  {format(start, "EEEE, MMMM d")}
                  {isToday && `, ${labels.today}`}
                </span>
                <span className="truncate font-display text-[26px] font-medium">{event.title}</span>
                <span className="text-[15px] text-muted">{meta}</span>
              </span>
              <span className="w-40 shrink-0 text-[15px] text-muted">
                {event.eventType ? typeLabels[event.eventType] : ""}
              </span>
              <span className="size-3.5 shrink-0">{isToday && <ExternalArrowIcon className="size-3.5" />}</span>
            </>
          );

          return (
            <li key={event.id}>
              {isToday ? (
                <a
                  href={checkInHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ROW_CLASS} bg-surface-lavender text-navy transition-colors hover:bg-surface-lavender/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none`}
                >
                  {content}
                  <span className="sr-only">{labels.newTab}</span>
                </a>
              ) : (
                <div className={ROW_CLASS}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>

      {PLACEHOLDER_ROWS.map((row, index) => (
        <div key={index} className={`${ROW_CLASS} ${row.opacity}`}>
          <span className="w-[156px] shrink-0 py-2" aria-hidden="true">
            <span className="block h-[52px] w-[76px] rounded-xl bg-border/50" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-3">
            {index === 0 && <span className="text-[15px] text-muted">{labels.moreSoon}</span>}
            <span aria-hidden="true" className={`block h-[18px] rounded-full bg-border/50 ${row.title}`} />
            <span aria-hidden="true" className={`block h-3 rounded-full bg-border/50 ${row.meta}`} />
          </span>
          <span className="w-40 shrink-0" aria-hidden="true">
            <span className={`block h-3 rounded-full bg-border/50 ${row.category}`} />
          </span>
          <span className="size-3.5 shrink-0" />
        </div>
      ))}
    </div>
  );
}
