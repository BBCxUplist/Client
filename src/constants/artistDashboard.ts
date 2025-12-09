import { DashboardTab } from '@/types';

export const artistDashboardTabs = [
  DashboardTab.OVERVIEW,
  DashboardTab.BOOKINGS,
  // DashboardTab.ANALYTICS,
  DashboardTab.NEWSLETTER,
  DashboardTab.SAVED,
  DashboardTab.SETTINGS,
];

export const bookingStatusColors = {
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/40',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/40',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
};
