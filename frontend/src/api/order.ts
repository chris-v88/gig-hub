import { axiosInstance } from './axiosInstance';
import type { Order, PaginationResponse } from '../types/api.types';

export type OrderCreateRequest = {
  maCongViec: number;
  maNguoiThue: number;
  ngayThue?: string;
  hoanThanh?: boolean;
};

export type OrderUpdateRequest = {
  ngayThue?: string;
  hoanThanh?: boolean;
  status?: string;
};

export const orderApi = {
  // GET /api/orders
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders');
    return response.data.content;
  },

  // POST /api/orders
  create: async (data: OrderCreateRequest): Promise<Order> => {
    const response = await axiosInstance.post('/orders', data);
    return response.data.content;
  },

  // GET /api/orders/search-pagination
  searchPagination: async (
    pageIndex = 1,
    pageSize = 10,
    keyword = ''
  ): Promise<PaginationResponse<Order>> => {
    const response = await axiosInstance.get('/orders/search-pagination', {
      params: { pageIndex, pageSize, keyword },
    });
    return response.data.content;
  },

  // GET /api/orders/:id
  getById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.content;
  },

  // PUT /api/orders/:id
  update: async (id: number, data: OrderUpdateRequest): Promise<Order> => {
    const response = await axiosInstance.put(`/orders/${id}`, data);
    return response.data.content;
  },

  // DELETE /api/orders/:id
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data.content;
  },

  // GET /api/orders/user-orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders/user-orders');
    return response.data.content;
  },

  // POST /api/orders/complete-order/:orderId
  completeOrder: async (orderId: number): Promise<Order> => {
    const response = await axiosInstance.post(`/orders/complete-order/${orderId}`);
    return response.data.content;
  },
};

export default orderApi;
