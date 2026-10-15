"use client";

import { useState } from "react";
import { DISCORD_URL, NAV_LINKS } from "@/data/content";

// TODO: style to match Figma
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#">UF ACM</a>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="bg-accent px-4 py-2 text-accent-foreground">
            Join Discord
          </a>
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="flex flex-col gap-4 px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="bg-accent px-4 py-2 text-center text-accent-foreground">
            Join Discord
          </a>
        </div>
      )}
    </header>
  );
}
