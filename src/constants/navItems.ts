interface NavItem {
  label: string;
  href: string;
  id?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Explore',
    href: '/explore',
  },
  {
    label: 'Messages',
    href: '/messages',
  },
  {
    label: 'About',
    href: '/about',
    id: 'about',
  },
  {
    label: 'Featured Artists',
    href: '/featured-artists',
    id: 'featured-artists',
  },
  {
    label: 'How It Works',
    href: '/how-it-works',
    id: 'how-it-works',
  },
  {
    label: 'Faq',
    href: '/faq',
    id: 'faq',
  },
];

const contactItems = [
  {
    label: 'Sign In',
    href: '/auth',
  },

  {
    label: 'Register',
    href: '/auth',
  },
];

export { navItems, contactItems };
