// Placeholder content for the landing page skeleton.
// Swap in real copy, links and headshots here — the sections read from these arrays.

// Permanent UF ACM server invite (does not expire).
export const DISCORD_URL = "https://discord.com/invite/3HPSwvY8Eb";

export const GITHUB_URL = "https://github.com/uf-acm-design-team";

export const INSTAGRAM_URL = "https://www.instagram.com/uf.acm/";

export type WhyReason = {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
};

export const WHY_ACM_HEADING = "Why Choose ACM?";

// TODO: point these links at the design team, events, and workshops pages
export const WHY_REASONS: WhyReason[] = [
  {
    title: "Design. Build. Ship.",
    description:
      "Get hands-on experience moving from Figma mockups to live next.js applications. Our design and development teams operate on real sprint cycles, giving you a portfolio of deployed software before you even graduate.",
    linkLabel: "Learn more about the design team",
    href: "#",
  },
  {
    title: "Connect with Driven Peers.",
    description:
      "Surround yourself with the top talent at UF. Whether you are prepping for technical interviews, hunting for internships, or just looking for a group to build side projects with, this is your home base.",
    linkLabel: "Check out our upcoming events",
    href: "#",
  },
  {
    title: "Level Up Your Stack.",
    description:
      "Go beyond the standard curriculum. We host weekly workshops on modern web frameworks, UI/UX micro-styling, backend architecture, and algorithmic problem-solving",
    linkLabel: "Visit our previous workshops",
    href: "#",
  },
];

export const DIVE_IN_HEADING = "Ready to Dive In?";

export const DIVE_IN_STEPS = [
  "Join the official UF ACM Discord",
  "Check In to at least Three Club Events",
  "Start building things to Be Proud Of.",
];
