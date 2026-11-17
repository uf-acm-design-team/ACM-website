// Officer board content (UAWR2-59). Everything shown in the Officers section lives here and reaches
// the components through props, the same way projects.ts works.
// Headshots go in public/officers/ and are referenced without "public", e.g. "/officers/jane-doe.jpg".

export type OfficerTeam = "design" | "workshop" | "social" | "marketing";

export type Officer = {
    id: string; 
    name: string;
    role: string;
    internship?: string;
    image?: string;
    linkedin?: string; 
    team?: OfficerTeam; 
};

export type TeamFilter = {
    id: OfficerTeam;
    label: string; 
};

export const OFFICERS_HEADING = "Meet the officer board";
export const OFFICERS_YEAR = "2026 – 2027";

export const EXECUTIVE_BOARD_LABEL = "Executive board";
export const OPERATIONS_TEAM_LABEL = "Operations team";

export const EXECUTIVE_BOARD: Officer[] = [
    {
        id: "jason-tenczar",
        name: "Jason Tenczar",
        role: "President",
        internship: "SWE Intern @ Datadog, Disney",
        image: "/officers/jason-tenczar.jpg",
    },
    {
        id: "sanjeev-kamath",
        name: "Sanjeev Kamath",
        role: "External VP",
        internship: "TPM Intern @ Google",
        image: "/officers/sanjeev-kamath.jpg",
    },
    {
        id: "evan-warnock",
        name: "Evan Warnock",
        role: "Internal VP",
        internship: "ML Intern @ NLP Logix",
        image: "/officers/evan-warnock.jpg",
    },
];

export const OPERATIONS_TEAM: Officer[] = [
    {
        id: "lincy-phipps",
        name: "Lincy Phipps",
        role: "Director of External Affairs",
        internship: "SWE Intern @ JPMorgan, L3Harris",
        image: "/officers/lincy-phipps.jpg",
    },
    {
        id: "harshil-rathod",
        name: "Harshil Rathod",
        role: "Treasurer",
        internship: "SWE Intern @ IDEXX",
        image: "/officers/harshil-rathod.jpg",
    },
    {
        id: "ethan-ahmed",
        name: "Ethan Ahmed",
        role: "Secretary",
        internship: "SWE Intern @ FCI",
        image: "/officers/ethan-ahmed.jpg",
    },
];

export const TEAM_FILTERS: TeamFilter[] = [
    { id: "design", label: "Design team directors" },
    { id: "workshop", label: "Workshop leads" },
    { id: "social", label: "Social leads" },
    { id: "marketing", label: "Marketing leads" },
];

export const TEAM_EMPTY_MESSAGE = "This team's roster is coming soon.";

export const TEAM_OFFICERS: Officer[] = [
    {
        id: "alvin-cabe",
        name: "Alvin Cabe",
        role: "Design Team Director",
        internship: "FDE Intern @ IBM",
        image: "/officers/alvin-cabe.jpg",
        team: "design",
    },
    {
        id: "paolo-villanueva",
        name: "Paolo Villanueva",
        role: "Design Team Director",
        internship: "SWE Intern @ Lockheed",
        image: "/officers/paolo-villanueva.jpg",
        team: "design",
    },
    {
        id: "julian-perez",
        name: "Julian Perez",
        role: "Workshop Lead",
        internship: "SWE Intern @ Motorola",
        image: "/officers/julian-perez.jpg",
        team: "workshop",
    },
    {
        id: "guhan-sattanathan",
        name: "Guhan Sattanathan",
        role: "Workshop Lead",
        internship: "Backend Engineer Intern @ Global Action Alliance",
        image: "/officers/guhan-sattanathan.jpg",
        team: "workshop",
    },
    {
        id: "mikelangelo-mutti",
        name: "Mikelangelo Mutti",
        role: "Social Lead",
        internship: "ML Research Assistant @ UF",
        image: "/officers/mikelangelo-mutti.jpg",
        team: "social",
    },
    {
        id: "ryan-tram",
        name: "Ryan Tram",
        role: "Social Lead",
        internship: "CS @ UF",
        image: "/officers/ryan-tram.jpg",
        team: "social",
    },
    {
        id: "clara-anderson",
        name: "Clara Anderson",
        role: "Marketing Lead",
        internship: "CS @ UF",
        image: "/officers/clara-anderson.jpg",
        team: "marketing",
    },
    {
        id: "max-fitzgerald",
        name: "Max FitzGerald",
        role: "Marketing Lead",
        internship: "CpE @ UF",
        image: "/officers/max-fitzgerald.jpg",
        team: "marketing",
    },
];
