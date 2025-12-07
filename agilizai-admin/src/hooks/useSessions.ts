import { useQuery } from '@tanstack/react-query';
import { sessionsService } from '@/services/sessions';

export const useActiveSessionsQuery = () => {
  return useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: sessionsService.getAllActive,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

