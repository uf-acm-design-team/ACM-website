// Officer board content (UAWR2-59). Everything shown in the Officers section lives here and reaches
// the components through props, the same way projects.ts works.
// Headshots go in public/officers/ and are referenced without "public", e.g. "/officers/jane-doe.jpg".

export type OfficerTeam = "design" | "workshop" | "social" | "marketing";

export type Officer = {
    id: string; /* unique key for React lists */
    name: string;
    role: string;
    internship?: string; /* the blue line under the role, e.g. "SWE Intern @ Google" */
    image?: string;
    linkedin?: string; /* when set, the whole card links to their LinkedIn */
    team?: OfficerTeam; /* only for officers in TEAM_OFFICERS, so the filter knows where they belong */
};

export type TeamFilter = {
    id: OfficerTeam;
    label: string; /* button text and the heading above that team's cards */
    shortLabel: string; /* shorter button text for phones (UAWR2-92) */
};

export const OFFICERS_HEADING = "Meet the officer board";
export const OFFICERS_YEAR = "2026 – 2027";

export const EXECUTIVE_BOARD_LABEL = "Executive board";
export const OPERATIONS_TEAM_LABEL = "Operations team";

// The top two groups always show, no matter which team is selected.
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

// The team filter buttons, in the order they appear. The first one is selected when the page loads.
export const TEAM_FILTERS: TeamFilter[] = [
    { id: "design", label: "Design team directors", shortLabel: "Design" },
    { id: "workshop", label: "Workshop leads", shortLabel: "Workshop" },
    { id: "social", label: "Social leads", shortLabel: "Social" },
    { id: "marketing", label: "Marketing leads", shortLabel: "Marketing" },
];

// Shown when the selected team has nobody in TEAM_OFFICERS yet.
export const TEAM_EMPTY_MESSAGE = "This team's roster is coming soon.";

// Everyone the filter switches between. Each officer's `team` says which button shows them.
// TODO: Workshop, Social and Marketing rosters haven't been provided yet (Figma only has the Design team).
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
];
