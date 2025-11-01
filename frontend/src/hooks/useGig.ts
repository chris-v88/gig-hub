import { useQuery } from '@tanstack/react-query';
import { gigAPI } from '../api/gig';

// Query keys for gigs
export const gigKeys = {
  all: ['gigs'] as const,
  lists: () => [...gigKeys.all, 'list'] as const,
  list: (filters: string) => [...gigKeys.lists(), { filters }] as const,
  details: () => [...gigKeys.all, 'detail'] as const,
  detail: (id: number) => [...gigKeys.details(), id] as const,
  byUser: (userId: number) => [...gigKeys.all, 'by-user', userId] as const,
};

// Get gigs by user
export const useUserGigs = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: gigKeys.byUser(userId),
    queryFn: async () => {
      const response = await gigAPI.getByUser(userId);
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single gig details
export const useGigDetails = (gigId: number, enabled = true) => {
  return useQuery({
    queryKey: gigKeys.detail(gigId),
    queryFn: async () => {
      const response = await gigAPI.getById(gigId);
      return response.data;
    },
    enabled: enabled && !!gigId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
