import { eachDayOfInterval, endOfMonth, endOfWeek, format, parseISO, startOfMonth, startOfWeek, addDays} from "date-fns";
import { WEEK_STARTS_ON, type CalendarEvent } from "@/data/calendar";

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getMonthDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
  });
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
    dayEvents.sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());
  }

  return byDay;
}

export function getWeekdayNames(): string[] {
    const firstDay = startOfWeek(new Date(2026, 0, 1), { weekStartsOn: WEEK_STARTS_ON });
    return Array.from({ length: 7 }, (_, index) => format(addDays(firstDay, index), "EEEE"));
}
