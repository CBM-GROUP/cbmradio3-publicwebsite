export interface NavigationItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team Members", href: "/team" },
  { label: "Programs", href: "/programs" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
];

export const contactNavigationItem: NavigationItem = {
  label: "Contact Us",
  href: "/#contact",
};

export const legalNavigation: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];
