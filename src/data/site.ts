export type SiteLink = {
  label: string;
  href: string;
  externalStyle?: boolean;
};

export const SITE_BRAND = {
  name: "ACM",
  href: "#",
  accessibleLabel: "ACM home",
};

export const NAVBAR_LINKS: SiteLink[] = [
  {
    label: "Sponsors",
    href: "#",
    externalStyle: true,
  },
  {
    label: "Calendar",
    href: "#",
    externalStyle: true,
  },
];

export const CHECK_IN_LINK: SiteLink = {
  label: "Check in",
  href: "#",
};

export const NAVBAR_LABELS = {
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
};