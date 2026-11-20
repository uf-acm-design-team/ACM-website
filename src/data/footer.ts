import type { FooterProps } from "@/app/components/Footer/Footer";
import { DISCORD_URL, GITHUB_URL, INSTAGRAM_URL } from "@/data/content";

export const FOOTER_SECTION: FooterProps = {
  name: "UF ACM",
  links: [
    { label: "Instagram", href: INSTAGRAM_URL },
    { label: "GitHub", href: GITHUB_URL },
    { label: "Discord", href: DISCORD_URL },
  ],
  copyright: "© 2026 UF ACM · Student chapter of the Association for Computing Machinery.",
  location: "University of Florida / Gainesville, FL",
};
