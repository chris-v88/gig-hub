import { axiosInstance } from './axiosInstance';

export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  Subcategories?: Subcategory[];
};

export type CategoryCreateRequest = {
  name: string;
};

export type PaginationResponse<T> = {
  data: T[];
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
};

export type Subcategory = {
  id: number;
  name: string;
  category_id?: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
  };
};

export const categoryApi = {
  // GET /api/categories
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data.content;
  },

  // POST /api/categories
  create: async (data: CategoryCreateRequest): Promise<Category> => {
    const response = await axiosInstance.post('/categories', data);
    return response.data.content;
  },

  // GET /api/categories/search-pagination
  searchPagination: async (
    pageIndex = 1,
    pageSize = 10,
    keyword = ''
  ): Promise<PaginationResponse<Category>> => {
    const response = await axiosInstance.get('/categories/search-pagination', {
      params: { pageIndex, pageSize, keyword },
    });
    return response.data.content;
  },

  // GET /api/categories/:id
  getById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data.content;
  },

  // PUT /api/categories/:id
  update: async (id: number, data: CategoryCreateRequest): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data.content;
  },

  // DELETE /api/categories/:id
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data.content;
  },
};

export default categoryApi;
