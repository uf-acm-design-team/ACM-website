export type Project = {
    id: string; /* for curent tab state */
    tabLabel: string;
    title: string; 
    description: string;
    tech?: string[];
    image: string;
    imageAlt: string;
    websiteHref?: string;
    teamHref?: string;
};

export const PROJECTS_HEADING = "Projects";
export const PROJECTS_SUBTITLE = "Projects from the UF ACM design team.";

export const PROJECTS: Project[] = [
    { // Need to add team link if doing it
        id: "acm-website",
        tabLabel: "UF ACM Website",
        title: "UF ACM Website",
        description: "The digital home for our community, designed and built by students.",
        tech: ["Next.js", "Tailwind CSS", "TypeScript"],
        image: "/projects/acm-website.png",
        imageAlt: "currently no photo decided",
        websiteHref: "#",
        teamHref: "#"
    },
    { // Need to add website and team link if doing it
        id: "acm-checkin",
        tabLabel: "ACM Check-In",
        title: "ACM Check-In",
        description: "Making check-in at every club event simple.",
        tech: ["N/A"], // TODO: Need to ask paolvin abt tech used
        image: "/projects/acm-checkin.png",
        imageAlt: "currently no photo decided",
    },
    { // Need to add website and team link if doing it
        id: "student-projects",
        tabLabel: "Student projects",
        title: "Student projects",
        description: "Side projects built by members, from hackathons to solo builds.",
        image: "/projects/student-projects.png",
        imageAlt: "currently no photo decided",
    }
];