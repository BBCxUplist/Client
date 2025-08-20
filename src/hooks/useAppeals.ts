import { useAppStore } from '@/store';
import type { Appeal, AppealStatus } from '@/constants/types';

export const useAppeals = () => {
  const { appeals } = useAppStore();
  return appeals;
};

export const useAppealsByArtist = (artistId: string): Appeal[] => {
  const appeals = useAppeals();
  return appeals.filter((appeal) => appeal.artistId === artistId);
};

export const useAppealById = (id: string): Appeal | undefined => {
  const appeals = useAppeals();
  return appeals.find((appeal) => appeal.id === id);
};

export const usePendingAppeals = (): Appeal[] => {
  const appeals = useAppeals();
  return appeals.filter((appeal) => appeal.status === 'pending');
};

export const useApprovedAppeals = (): Appeal[] => {
  const appeals = useAppeals();
  return appeals.filter((appeal) => appeal.status === 'approved');
};

export const useRejectedAppeals = (): Appeal[] => {
  const appeals = useAppeals();
  return appeals.filter((appeal) => appeal.status === 'rejected');
};

export const useAppealsByStatus = (status: AppealStatus): Appeal[] => {
  const appeals = useAppeals();
  return appeals.filter((appeal) => appeal.status === status);
};

export const useAppealActions = () => {
  const { submitAppeal, approveAppeal, rejectAppeal } = useAppStore();
  
  return {
    submitAppeal,
    approveAppeal,
    rejectAppeal,
  };
};
