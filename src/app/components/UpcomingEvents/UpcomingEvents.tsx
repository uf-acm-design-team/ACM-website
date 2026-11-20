import Link from "next/link";

export type EventTag = "RSVP only" | "Workshop" | "Collaboration";

export type EventItem = {
  id: string;
  /** Calendar date, YYYY-MM-DD (Eastern time). */
  date: string;
  title: string;
  /** Display text, e.g. "12:00 – 1:00 PM". */
  time: string;
  place: string;
  tag: EventTag;
  tagHref: string;
};

export type UpcomingEventsProps = {
  heading: string;
  calendar: { label: string; href: string };
  emptyMessage: string;
  /** Soonest first. Only the first three are shown. */
  events: readonly EventItem[];
};

// Dates are plain calendar days, so format them in UTC to avoid off-by-one-day shifts.
const dayFormat = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const weekdayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });

export default function UpcomingEvents({ heading, calendar, emptyMessage, events }: UpcomingEventsProps) {
  const nextThree = events.slice(0, 3);

  return (
    <section
      aria-labelledby="upcoming-events-heading"
      className="relative mx-auto w-full max-w-360 px-6 py-10 font-sans md:px-10 lg:px-16"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="upcoming-events-heading" className="font-sans text-base leading-6 font-medium text-muted">
          {heading}
        </h2>
        <Link
          href={calendar.href}
          className="inline-flex items-center gap-1 text-base leading-6 font-medium text-navy hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {calendar.label}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {nextThree.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-transparent px-6 py-10 text-center text-base leading-6 text-muted">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          {nextThree.map((event) => {
            const date = new Date(`${event.date}T00:00:00Z`);

            return (
              <li
                key={event.id}
                className="flex gap-4 rounded-xl border border-border bg-transparent p-5"
              >
                <time dateTime={event.date} className="flex w-14 shrink-0 flex-col items-center">
                  <span className="font-display text-5xl leading-none font-medium tracking-[-0.03em] text-navy">
                    {dayFormat.format(date)}
                  </span>
                  <span className="mt-1 text-sm leading-5 font-medium text-muted uppercase">
                    {monthFormat.format(date)}
                  </span>
                </time>

                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="font-display text-lg leading-snug font-medium text-navy">{event.title}</h3>
                  <p className="text-sm leading-5 text-muted">
                    {weekdayFormat.format(date)} · {event.time}
                  </p>
                  <p className="text-sm leading-5 text-muted">{event.place}</p>
                  <Link
                    href={event.tagHref}
                    className="mt-2 w-fit text-sm leading-5 font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {event.tag}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
