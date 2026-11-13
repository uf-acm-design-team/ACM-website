"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import acmFish from "./acm-fish.svg";
import {
  CHECK_IN_LINK,
  NAVBAR_LABELS,
  NAVBAR_LINKS,
  SITE_BRAND,
  type SiteLink,
} from "@/data/site";

function BroadcastIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path d="M6.8 6.8a4.5 4.5 0 0 0 0 6.4M13.2 6.8a4.5 4.5 0 0 1 0 6.4" />
      <path d="M4.5 4.5a7.8 7.8 0 0 0 0 11M15.5 4.5a7.8 7.8 0 0 1 0 11" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block size-5">
      <span className={`absolute left-0 top-1.5 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${open ? "translate-y-1 rotate-45" : ""}`} />
      <span className={`absolute left-0 top-3.5 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${open ? "-translate-y-1 -rotate-45" : ""}`} />
    </span>
  );
}

function NavigationLink({ link, onClick }: { link: SiteLink; onClick?: () => void }) {
  return (
    <a
      href={link.href}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-sm text-base font-medium leading-6 text-muted transition-colors duration-200 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 motion-reduce:transition-none"
    >
      <span>{link.label}</span>
      {link.externalStyle && <span aria-hidden="true">↗</span>}
    </a>
  );
}

type NavbarContentProps = {
  brand: typeof SITE_BRAND;
  links: SiteLink[];
  checkInLink: SiteLink;
};

function NavbarContent({ brand, links, checkInLink }: NavbarContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-none ${
        isScrolled ? "border-border/50 bg-background/70 backdrop-blur-2xl" : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className={`mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 transition-[height] duration-300 ease-out motion-reduce:transition-none sm:px-8 lg:px-20 ${
          isScrolled ? "h-[72px]" : "h-24"
        }`}
      >
        <div className="hidden h-11 w-full items-center gap-8 justify-self-start md:flex">
          {links.map((link) => <NavigationLink key={link.label} link={link} />)}
        </div>

        <a
          href={brand.href}
          aria-label={brand.accessibleLabel}
          className="col-start-1 inline-flex items-center gap-3 justify-self-start rounded-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 md:col-start-2 md:justify-self-center"
        >
          <Image
            src={acmFish}
            alt=""
            width={76}
            height={31}
            className={`w-auto transition-[height] duration-300 ease-out motion-reduce:transition-none ${isScrolled ? "h-[19px]" : "h-[30px]"}`}
          />
          <span className={`font-display font-medium transition-[font-size,line-height] duration-300 ease-out motion-reduce:transition-none ${isScrolled ? "text-[25px] leading-8" : "text-[40px] leading-[48px]"}`}>
            {brand.name}
          </span>
        </a>

        <a
          href={checkInLink.href}
          className="hidden h-11 w-36 items-center justify-center gap-2.5 justify-self-end rounded-lg border border-border bg-background px-5 py-2.5 text-base font-medium text-navy transition-colors duration-200 hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 motion-reduce:transition-none md:inline-flex"
        >
          <span className="flex-1">{checkInLink.label}</span>
          <BroadcastIcon />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? NAVBAR_LABELS.closeMenu : NAVBAR_LABELS.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
          className="col-start-3 inline-flex size-11 items-center justify-center justify-self-end rounded-lg border border-border bg-background/70 text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
        >
          <MenuIcon open={menuOpen} />
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-border/50 bg-background/90 px-5 py-5 backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
            {links.map((link) => (
              <NavigationLink key={link.label} link={link} onClick={() => setMenuOpen(false)} />
            ))}
            <a
              href={checkInLink.href}
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-5 py-3 text-base font-medium text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span>{checkInLink.label}</span>
              <BroadcastIcon />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return <NavbarContent brand={SITE_BRAND} links={NAVBAR_LINKS} checkInLink={CHECK_IN_LINK} />;
}
