interface NavItem {
  label: string;
  href: string;
  id?: string;
}

const navItems: NavItem[] = [
  {
    label: "Explore",
    href: "/explore",
  },
  {
    label: "About",
    href: "/about", 
    id: "about",
  },
  {
    label: "Featured Artists",
    href: "/featured-artists",
    id: "featured-artists",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    id: "how-it-works",
  },
  {
    label: "Faq",
    href: "/faq",
    id: "faq",
  },
];

const contactItems = [
  {
    label: "Contact",
    href: "/contact",
  },

  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export { navItems, contactItems };
