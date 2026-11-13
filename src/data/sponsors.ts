import type { SponsorsProps } from "@/app/components/Sponsors/Sponsors";

export const SPONSORS_SECTION: SponsorsProps = {
  heading: "Sponsors",
  description: "Supporting the next wave of builders.",
  action: {
    label: "Become a Sponsor",
    href: "/sponser",
  },
  logos: [
    { name: "Accenture", src: "/sponsors/accenture.svg", alt: "Accenture", width: 284, height: 75 },
    { name: "Bloomberg", src: "/sponsors/bloomberg.svg", alt: "Bloomberg", width: 284, height: 52.5869 },
    { name: "Datadog", src: "/sponsors/datadog.svg", alt: "Datadog", width: 119.458, height: 120.436 },
    { name: "Roblox", src: "/sponsors/roblox.svg", alt: "Roblox", width: 284, height: 168 },
  ],
};
