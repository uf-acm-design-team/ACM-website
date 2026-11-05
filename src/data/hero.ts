import {DISCORD_URL, INSTAGRAM_URL} from "@/data/content";

export type HeroButton = {
    label: string;
    href: string;
    variant: "primary" | "secondary";

};

export type HeroTagline = {
    before: string;
    highlight: string;
    after: string;

};

export type HeroContent = {
    titleLines: string[];
    tagline: HeroTagline;
    buttons: HeroButton[];

};

export const HERO: HeroContent = {
    titleLines: ["Association for", "Computing Machinery"],
    tagline: {
        before: "University of Florida's ", 
        highlight: "largest pre-professional",
        after: " computer science community.",
    },
    buttons: [
        {label: "Join Discord", href: DISCORD_URL, variant: "primary"},
        {label: "Follow us on Instagram", href: INSTAGRAM_URL, variant:"secondary"},
    ],
};
