// Placeholder content for the landing page skeleton.
// Swap in real copy, links and headshots here — the sections read from these arrays.

// TODO: replace with the real Discord invite link
export const DISCORD_URL = "#";

// TODO: replace with the real GitHub organization URL
export const GITHUB_URL = "#";

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Officers", href: "#officers" },
  { label: "Projects", href: "#projects" },
];

export type Pillar = {
  title: string;
  description: string;
};

export const PILLARS: Pillar[] = [
  {
    title: "Professional Growth",
    description:
      "Workshops, resume reviews and industry talks that help members land internships and build careers in tech.",
  },
  {
    title: "Open Source",
    description:
      "Build real software together. Members contribute to club projects and learn how collaborative development works.",
  },
  {
    title: "Community",
    description:
      "A welcoming space to meet other students, find study partners and make friends who share your interests.",
  },
];

export type Officer = {
  name: string;
  role: string;
  /** Path under /public, e.g. "/officers/jane-doe.jpg" */
  image?: string;
  github?: string;
  linkedin?: string;
};

// TODO: replace with the real officer roster
export const OFFICERS: Officer[] = [
  { name: "Officer Name", role: "President" },
  { name: "Officer Name", role: "Vice President" },
  { name: "Officer Name", role: "Treasurer" },
  { name: "Officer Name", role: "Secretary" },
  { name: "Officer Name", role: "Design Lead" },
  { name: "Officer Name", role: "Events Coordinator" },
];

export type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
};

export type Sponsor = {
  name: string;
  /** Path under /public, e.g. "/sponsors/accenture.svg" */
  logo?: string;
};

export const SPONSORS: Sponsor[] = [
  { name: "Accenture" },
  { name: "Bloomberg" },
  { name: "Datadog" },
  { name: "Roblox" },
];

// TODO: replace with the real Instagram profile URL
export const INSTAGRAM_URL = "https://www.instagram.com/uf.acm/";

export const INSTAGRAM_HANDLE = "uf.acm";

export type InstagramPost = {
  id: string;
  alt: string;
  /** Path under /public, e.g. "/instagram/post-1.jpg" */
  image?: string;
};

// TODO: replace placeholders with real posts
export const INSTAGRAM_POSTS: InstagramPost[] = [
  { id: "post-1", alt: "ACM Instagram post" },
  { id: "post-2", alt: "ACM Instagram post" },
  { id: "post-3", alt: "ACM Instagram post" },
];

// TODO: fill in real project details and links
export const PROJECTS: Project[] = [
  {
    title: "ACM Website",
    description: "The site you're looking at, designed and built by the ACM design team.",
    tech: ["Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Check-in App",
    description: "A tool for checking members in at meetings and events.",
    tech: ["TBD"],
  },
  {
    title: "Student Tools",
    description: "More member-built tools are coming soon.",
    tech: ["TBD"],
  },
];

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

export const FOOTER = {
  name: "UF ACM",
  copyright: "© 2026 UF ACM · Student chapter of the Association for Computing Machinery.",
  location: "University of Florida / Gainesville, FL",
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "GitHub", href: GITHUB_URL },
  { label: "Discord", href: DISCORD_URL },
];
