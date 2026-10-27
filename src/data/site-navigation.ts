export interface NavigationItem {
  label: string;
  href: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Charts", href: "/charts" },
  { label: "Shows", href: "/programs" },
  { label: "Podcasts", href: "/episodes" },
  { label: "News", href: "/news" },
  { label: "Moments", href: "/gallery" },
  { label: "Presenters", href: "/team" },
  { label: "About", href: "/about" },
];

export const contactNavigationItem: NavigationItem = {
  label: "Contact Us",
  href: "/contact",
};

export const legalNavigation: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];
