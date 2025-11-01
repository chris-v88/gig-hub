import { axiosInstance } from './axiosInstance';

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: boolean; // Backend returns boolean: true=male, false=female, null=other
  role: 'user' | 'admin' | 'seller';
  username?: string;
  profile_image?: string;
  description?: string;
  country?: string;
  is_online?: boolean;
  total_orders_completed?: number;
  created_at: string;
  updated_at?: string;
  skills?: Array<{ skill: string }>;
  User_certifications?: Array<{ certification: string }>;
  skill?: string[];
  certification?: string[];
};

export type UserCreateRequest = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  role?: 'user' | 'admin';
  skill?: string[];
  certification?: string[];
};

export type UserUpdateRequest = {
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: boolean | null;
  role?: 'user' | 'admin' | 'seller';
  skill?: string[];
  certification?: string[];
};

export type PaginationResponse<T> = {
  data: T[];
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
};

export const userApi = {
  // GET /api/users
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data.data;
  },

  // POST /api/users
  create: async (data: UserCreateRequest): Promise<User> => {
    const response = await axiosInstance.post('/users', data);
    return response.data.data;
  },

  // DELETE /api/users (with query param)
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete('/users', {
      params: { id },
    });
    return response.data.data;
  },

  // GET /api/users/search-pagination
  searchPagination: async (
    pageIndex = 1,
    pageSize = 10,
    keyword = ''
  ): Promise<PaginationResponse<User>> => {
    const response = await axiosInstance.get('/users/search-pagination', {
      params: { pageIndex, pageSize, keyword },
    });
    return response.data.data;
  },

  // GET /api/users/search/:username
  searchByName: async (username: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/users/search/${username}`);
    return response.data.data;
  },

  // GET /api/users/:id
  getById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.data;
  },

  // PUT /api/users/:id
  update: async (id: number, data: UserUpdateRequest): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data.data;
  },

  // POST /api/users/upload-avatar
  uploadAvatar: async (formData: FormData): Promise<{ message: string; avatarUrl?: string }> => {
    const response = await axiosInstance.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

export default userApi;
