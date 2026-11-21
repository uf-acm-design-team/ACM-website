export type CalendarEventType = "workshop" | "social";

export type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay: boolean;
    location?: string;
    eventType?: CalendarEventType;
};

export type CalendarFilter = {
    id: "all" | "upcoming" | CalendarEventType;
    label: string;
};

export const CALENDAR_EYEBROW = "UF ACM · Calendar";
export const CALENDAR_HEADING = "Find your next dive.";
export const CALENDAR_SUBTITLE = "Workshops, build nights, and Fishbowl Fridays. There’s a place for you here.";

export const CALENDAR_FILTERS: CalendarFilter[] = [
    { id: "all", label: "All events" },
    { id: "upcoming", label: "Upcoming" },
    { id: "workshop", label: "Workshops" },
    { id: "social", label: "Socials" },
];

export const CALENDAR_TYPE_LABELS: Record<CalendarEventType, string> = {
    workshop: "Workshop",
    social: "Social",
};

export const CALENDAR_LABELS = {
    previousMonth: "Previous month",
    nextMonth: "Next month",
    search: "Search events",
    today: "Today",
    allDay: "All day",
    noEvents: "No events scheduled",
    moreEvents: "more",
    filters: "Filter events",
};

export type CalendarLabels = typeof CALENDAR_LABELS;

const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

export const GOOGLE_CALENDAR_LINK = {
    label: "Add to Google Calendar",
    href: GOOGLE_CALENDAR_ID
        ? `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(GOOGLE_CALENDAR_ID)}`
        : "#",
};

export const WEEK_STARTS_ON = 0; /* date-fns starts sunday on 0 */
export const CALENDAR_TIMEZONE = "America/New_York";

/* Remove later */
export const PLACEHOLDER_EVENTS: CalendarEvent[] = [
    {
        id: "intro-to-git",
        title: "Intro to Git & GitHub",
        start: "2026-11-03T18:00:00-05:00",
        end: "2026-11-03T19:00:00-05:00",
        allDay: false,
        location: "Mala 2100",
        eventType: "workshop",
    },
    {
        id: "fishbowl-friday-nov-13",
        title: "Fishbowl Friday",
        start: "2026-11-13T16:00:00-05:00",
        end: "2026-11-13T18:00:00-05:00",
        allDay: false,
        location: "Mala 2100",
        eventType: "social",
    },
    {
        id: "build-night-portfolio",
        title: "Build Night: Portfolio Lab",
        start: "2026-11-24T18:00:00-05:00",
        end: "2026-11-24T20:00:00-05:00",
        allDay: false,
        location: "Mala 2100",
    },
    {
        id: "thanksgiving-break",
        title: "Thanksgiving break, no events",
        start: "2026-11-26",
        allDay: true,
    },
    {
        id: "build-your-own-ai-agent",
        title: "Build Your Own AI Agent",
        start: "2026-12-02T17:00:00-05:00",
        allDay: false,
        location: "Weimer 1064",
        eventType: "workshop",
    },
    {
        id: "end-of-semester-social",
        title: "End of Semester Social",
        start: "2026-12-04T16:00:00-05:00",
        end: "2026-12-04T18:00:00-05:00",
        allDay: false,
        location: "Mala 2100",
        eventType: "social",
    },
];
