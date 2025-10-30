import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, ReviewUpdateRequest } from '../api/review';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: string) => [...reviewKeys.lists(), { filters }] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: number) => [...reviewKeys.details(), id] as const,
  byGig: (gigId: number) => [...reviewKeys.all, 'byGig', gigId] as const,
};

// Hooks for Reviews
export const useReviews = () => {
  return useQuery({
    queryKey: reviewKeys.lists(),
    queryFn: reviewApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewsByGig = (gigId: number) => {
  return useQuery({
    queryKey: reviewKeys.byGig(gigId),
    queryFn: () => reviewApi.getByGig(gigId),
    enabled: !!gigId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      // Invalidate the specific gig's reviews
      if (variables.gig_id) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byGig(variables.gig_id) });
      }
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReviewUpdateRequest }) =>
      reviewApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
