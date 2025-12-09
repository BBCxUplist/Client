export enum AdminTab {
  OVERVIEW = 'overview',
  ARTISTS = 'artists',
  CREATE_ARTIST = 'create-artist',
  APPROVED = 'approved',
  USERS = 'users',
  REPORTS = 'reports',
  RECENT_ACTIVITY = 'recent-activity',
  SETTINGS = 'settings',
}

export const adminNavItems = [
  {
    id: AdminTab.OVERVIEW,
    label: 'Overview',
    icon: '/icons/overview.png',
  },
  {
    id: AdminTab.ARTISTS,
    label: 'Artists',
    icon: '/icons/artist.png',
  },
  {
    id: AdminTab.CREATE_ARTIST,
    label: 'Create Artist',
    icon: '/icons/frame.svg',
  },
  {
    id: AdminTab.APPROVED,
    label: 'Approved',
    icon: '/icons/tick.svg',
  },
  {
    id: AdminTab.USERS,
    label: 'Users',
    icon: '/icons/users.png',
  },
  {
    id: AdminTab.REPORTS,
    label: 'Reports',
    icon: '/icons/report.png',
  },
  {
    id: AdminTab.RECENT_ACTIVITY,
    label: 'Recent Activity',
    icon: '/icons/overview.png',
  },
  {
    id: AdminTab.SETTINGS,
    label: 'Settings',
    icon: '/icons/settings.png',
  },
];

export const mobileAdminNavItems = [
  {
    id: AdminTab.OVERVIEW,
    label: 'Overview',
    icon: '/icons/overview.png',
  },
  {
    id: AdminTab.ARTISTS,
    label: 'Artists',
    icon: '/icons/artist.png',
  },
  {
    id: AdminTab.CREATE_ARTIST,
    label: 'Create Artist',
    icon: '/icons/frame.svg',
  },
  {
    id: AdminTab.APPROVED,
    label: 'Approved',
    icon: '/icons/check.png',
  },
  {
    id: AdminTab.USERS,
    label: 'Users',
    icon: '/icons/users.png',
  },
  {
    id: AdminTab.REPORTS,
    label: 'Reports',
    icon: '/icons/tick.svg',
  },
  {
    id: AdminTab.RECENT_ACTIVITY,
    label: 'Recent Activity',
    icon: '/icons/overview.png',
  },
  {
    id: AdminTab.SETTINGS,
    label: 'Settings',
    icon: '/icons/settings.png',
  },
];

export const adminTabDisplayMap = [
  { id: AdminTab.OVERVIEW, label: 'Overview' },
  { id: AdminTab.ARTISTS, label: 'Artists' },
  { id: AdminTab.CREATE_ARTIST, label: 'Create Artist' },
  { id: AdminTab.APPROVED, label: 'Approved' },
  { id: AdminTab.USERS, label: 'Users' },
  { id: AdminTab.REPORTS, label: 'Reports' },
  { id: AdminTab.RECENT_ACTIVITY, label: 'Recent Activity' },
  { id: AdminTab.SETTINGS, label: 'Settings' },
];
