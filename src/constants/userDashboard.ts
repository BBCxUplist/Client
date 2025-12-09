export type UserDashboardTab = 'overview' | 'bookings' | 'saved' | 'settings';

export const userDashboardTabs: UserDashboardTab[] = [
  'overview',
  'bookings',
  'saved',
  'settings',
];

export const userTabDisplayMap = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'bookings', label: 'BOOKINGS' },
  { id: 'saved', label: 'SAVED' },
  { id: 'settings', label: 'SETTINGS' },
];

export const userValidationRules = {
  username: /^[a-z0-9._]+$/,
  phone: /^[+]?[0-9\s\-()]+$/,
};
