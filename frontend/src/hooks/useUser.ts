import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userApi, { UserUpdateRequest } from '../api/user';
import { useAuthStore } from '../store/authStore';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
};

// Get user profile
export const useUserProfile = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userApi.getById(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user profile (from auth store)
export const useCurrentUserProfile = () => {
  const { user } = useAuthStore();
  return useUserProfile(user?.id || 0, !!user?.id);
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserUpdateRequest }) =>
      userApi.update(userId, data),
    onSuccess: (updatedUser, variables) => {
      // Update the query cache
      queryClient.setQueryData(userKeys.detail(variables.userId), updatedUser);

      // Update auth store if it's the current user
      if (user && user.id === variables.userId) {
        updateUser(updatedUser);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (formData: FormData) => userApi.uploadAvatar(formData),
    onSuccess: (result) => {
      // Update current user's profile image in auth store and cache
      if (user && result.avatarUrl) {
        const updatedUser = { ...user, profile_image: result.avatarUrl };
        updateUser(updatedUser);
        queryClient.setQueryData(userKeys.detail(user.id), updatedUser);
      }

      // Invalidate user queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Search users
export const useSearchUsers = (pageIndex = 1, pageSize = 10, keyword = '', enabled = true) => {
  return useQuery({
    queryKey: [...userKeys.lists(), { pageIndex, pageSize, keyword }],
    queryFn: () => userApi.searchPagination(pageIndex, pageSize, keyword),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search users by username
export const useSearchUsersByName = (username: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.search(username),
    queryFn: () => userApi.searchByName(username),
    enabled: enabled && !!username && username.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all users (admin only)
export const useAllUsers = (enabled = true) => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userApi.getAll(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create user (admin)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Delete user (admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
