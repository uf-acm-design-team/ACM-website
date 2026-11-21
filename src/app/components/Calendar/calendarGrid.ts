import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMinutes,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { WEEK_STARTS_ON, type CalendarEvent, type CalendarFilter } from "@/data/calendar";

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function compareByStart(a: CalendarEvent, b: CalendarEvent) {
  return parseISO(a.start).getTime() - parseISO(b.start).getTime();
}

export function getMonthDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
  });
}

export function getWeekdayNames(): string[] {
  const firstDay = startOfWeek(new Date(2026, 0, 1), { weekStartsOn: WEEK_STARTS_ON });
  return Array.from({ length: 7 }, (_, index) => format(addDays(firstDay, index), "EEEE"));
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const byDay = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const key = toDateKey(parseISO(event.start));
    const dayEvents = byDay.get(key) ?? [];
    dayEvents.push(event);
    byDay.set(key, dayEvents);
  }

  for (const dayEvents of byDay.values()) {
    dayEvents.sort(compareByStart);
  }

  return byDay;
}

export function getEventsInMonth(events: CalendarEvent[], month: Date) {
  return events.filter((event) => isSameMonth(parseISO(event.start), month)).sort(compareByStart);
}

function shortTime(date: Date) {
  return format(date, getMinutes(date) === 0 ? "h" : "h:mm");
}

export function formatEventTime(event: CalendarEvent, allDayLabel: string) {
  if (event.allDay) return allDayLabel;

  const start = parseISO(event.start);
  if (!event.end) return format(start, "h:mm a");

  const end = parseISO(event.end);
  const startPeriod = format(start, "a");
  const endPeriod = format(end, "a");

  if (startPeriod === endPeriod) {
    return `${shortTime(start)}–${shortTime(end)} ${endPeriod}`;
  }
  return `${shortTime(start)} ${startPeriod}–${shortTime(end)} ${endPeriod}`;
}

export function filterEvents(
  events: CalendarEvent[],
  filter: CalendarFilter["id"],
  query: string,
  today: string | null,
) {
  const search = query.trim().toLowerCase();

  return events.filter((event) => {
    if ((filter === "workshop" || filter === "social") && event.eventType !== filter) {
      return false;
    }
    if (filter === "upcoming" && today && toDateKey(parseISO(event.start)) < today) {
      return false;
    }
    if (search && !`${event.title} ${event.location ?? ""}`.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });
}
