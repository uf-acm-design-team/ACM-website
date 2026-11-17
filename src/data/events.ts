import type { EventItem, UpcomingEventsProps } from "@/app/components/UpcomingEvents/UpcomingEvents";

export const UPCOMING_EVENTS: Omit<UpcomingEventsProps, "events"> = {
  heading: "Coming up at ACM",
  calendar: { label: "Calendar", href: "/calendar" },
  emptyMessage: "No upcoming events right now. Check the calendar or our Discord for updates.",
};

// Placeholder events (copy and times follow the Figma mockup until real data lands).
const PLACEHOLDER_EVENTS: EventItem[] = [
  {
    id: "grad-info-lunch",
    date: "2026-11-19",
    title: "Grad Info Lunch w/ NSCoE and ACM",
    time: "12:00 – 1:00 PM",
    place: "Reitz Union",
    tag: "RSVP only",
    tagHref: "/calendar",
  },
  {
    id: "intro-to-cloud",
    date: "2026-11-21",
    title: "Intro to Cloud Workshop",
    time: "2:00 – 4:00 PM",
    place: "The Fishbowl",
    tag: "Workshop",
    tagHref: "/calendar",
  },
  {
    id: "summer-social",
    date: "2026-11-22",
    title: "Summer Social",
    time: "6:00 – 8:00 PM",
    place: "The Fishbowl",
    tag: "Collaboration",
    tagHref: "/calendar",
  },
];

/**
 * Returns the next events, soonest first.
 *
 * Sprint 5: replace this body with the real Google Calendar fetch (keep the signature and
 * return shape). The component does not need to change.
 */
export async function getEvents(): Promise<EventItem[]> {
  return PLACEHOLDER_EVENTS;
}
