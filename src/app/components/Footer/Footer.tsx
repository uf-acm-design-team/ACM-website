import { FOOTER, SOCIAL_LINKS } from "@/data/content";

// TODO: style to match Figma
export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-16">
      <p>{FOOTER.name}</p>

      <ul className="flex gap-4">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <p>{FOOTER.copyright}</p>
      <p>{FOOTER.location}</p>
    </footer>
  );
}
