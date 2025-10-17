import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface ServiceStatus {
  status: string;
  responseTime: number;
  error?: string | null;
}

interface DatabaseStatistics {
  totalUsers: number;
  totalArtists: number;
  totalBookings: number;
  totalMessages: number;
}

interface DatabaseStatus extends ServiceStatus {
  statistics: DatabaseStatistics;
}

interface HealthCheckResponse {
  status: 'OK' | 'DEGRADED' | 'ERROR';
  message: string;
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  services: {
    api: ServiceStatus;
    database: DatabaseStatus;
  };
}

export const useHealthCheck = () => {
  return useQuery<HealthCheckResponse, Error>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get<HealthCheckResponse>('/health');
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce load
  });
};
