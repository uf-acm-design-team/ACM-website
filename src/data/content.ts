// Placeholder content for the landing page skeleton.
// Swap in real copy, links and headshots here — the sections read from these arrays.

// TODO: replace with the real Discord invite link
export const DISCORD_URL = "#";

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
