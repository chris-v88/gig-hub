import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, OrderCreateRequest, OrderUpdateRequest } from '../api/order';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  search: (pageIndex: number, pageSize: number, keyword: string) =>
    [...orderKeys.all, 'search', { pageIndex, pageSize, keyword }] as const,
  userOrders: () => [...orderKeys.all, 'userOrders'] as const,
};

// Hooks for Orders
export const useOrders = () => {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: orderApi.getAll,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
};

export const useOrdersSearch = (pageIndex = 1, pageSize = 10, keyword = '') => {
  return useQuery({
    queryKey: orderKeys.search(pageIndex, pageSize, keyword),
    queryFn: () => orderApi.searchPagination(pageIndex, pageSize, keyword),
    placeholderData: (previousData) => previousData,
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: orderKeys.userOrders(),
    queryFn: orderApi.getUserOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderUpdateRequest }) =>
      orderApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.completeOrder,
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
    },
  });
};
