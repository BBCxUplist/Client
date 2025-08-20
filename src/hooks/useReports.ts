import { useAppStore } from '@/store';
import type { Report, ReportStatus, ReportTargetType } from '@/constants/types';

export const useReports = () => {
  const { reports } = useAppStore();
  return reports;
};

export const useReportsByReporter = (reporterId: string): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.reporterId === reporterId);
};

export const useReportsByTarget = (targetId: string): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.targetId === targetId);
};

export const useReportById = (id: string): Report | undefined => {
  const reports = useReports();
  return reports.find((report) => report.id === id);
};

export const useOpenReports = (): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.status === 'open');
};

export const useClosedReports = (): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.status === 'closed');
};

export const useReportsByStatus = (status: ReportStatus): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.status === status);
};

export const useReportsByTargetType = (targetType: ReportTargetType): Report[] => {
  const reports = useReports();
  return reports.filter((report) => report.targetType === targetType);
};

export const useUserReports = (): Report[] => {
  return useReportsByTargetType('user');
};

export const useArtistReports = (): Report[] => {
  return useReportsByTargetType('artist');
};

export const useReportActions = () => {
  const { addReport, closeReport } = useAppStore();
  
  return {
    addReport,
    closeReport,
  };
};
