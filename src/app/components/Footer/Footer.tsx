import Image from "next/image";
import acmFish from "./acm-fish.svg";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterProps = {
  name: string;
  links: readonly FooterLink[];
  copyright: string;
  location: string;
};

export default function Footer({ name, links, copyright, location }: FooterProps) {
  return (
    <footer className="relative mx-auto w-full max-w-360 px-6 pt-12 pb-10 font-sans md:px-10 lg:px-16 lg:pt-16">
      <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-border md:inset-x-10 lg:inset-x-16" />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          <Image
            src={acmFish}
            alt=""
            width={76}
            height={30}
            className="h-auto w-16 shrink-0 sm:w-24 lg:w-38"
          />
          <p className="font-display text-5xl leading-none font-medium tracking-[-0.03em] text-navy sm:text-7xl lg:text-[120px]">
            {name}
          </p>
        </div>

        <nav aria-label="Social links">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base leading-6 font-medium text-navy hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm leading-5 text-muted lg:flex-row lg:justify-between">
        <p>{copyright}</p>
        <p>{location}</p>
      </div>
    </footer>
  );
}
