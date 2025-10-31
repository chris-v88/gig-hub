import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillApi, SkillUpdateRequest } from '../api/skill';

// Query Keys
export const skillKeys = {
  all: ['skills'] as const,
  lists: () => [...skillKeys.all, 'list'] as const,
  list: (filters: string) => [...skillKeys.lists(), { filters }] as const,
  details: () => [...skillKeys.all, 'detail'] as const,
  detail: (id: number) => [...skillKeys.details(), id] as const,
  search: (pageIndex: number, pageSize: number, keyword: string) =>
    [...skillKeys.all, 'search', { pageIndex, pageSize, keyword }] as const,
};

// Hooks for Skills
export const useSkills = () => {
  return useQuery({
    queryKey: skillKeys.lists(),
    queryFn: skillApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSkill = (id: number) => {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: () => skillApi.getById(id),
    enabled: !!id,
  });
};

export const useSkillsSearch = (pageIndex = 1, pageSize = 10, keyword = '') => {
  return useQuery({
    queryKey: skillKeys.search(pageIndex, pageSize, keyword),
    queryFn: () => skillApi.searchPagination(pageIndex, pageSize, keyword),
    placeholderData: (previousData) => previousData,
  });
};

// Mutations
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SkillUpdateRequest }) =>
      skillApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
      queryClient.invalidateQueries({ queryKey: skillKeys.detail(id) });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
};
