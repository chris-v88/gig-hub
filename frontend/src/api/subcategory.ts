import { axiosInstance } from './axiosInstance';

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

export type SubcategoryCreateRequest = {
  tenChiTiet: string;
};

export type SubcategoryGroupRequest = {
  tenNhom: string;
  hinhAnh?: string;
  maLoaiCongviec: number;
  dsChiTietLoai: number[];
};

export type SubcategoryGroup = {
  id: number;
  name: string;
  image_url?: string;
  category_id: number;
  subcategories: Subcategory[];
  created_at: string;
  updated_at: string;
};

export type PaginationResponse<T> = {
  data: T[];
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
};

export const subcategoryApi = {
  // GET /api/subcategories
  getAll: async (): Promise<Subcategory[]> => {
    const response = await axiosInstance.get('/subcategories');
    return response.data.content;
  },

  // POST /api/subcategories
  create: async (data: SubcategoryCreateRequest): Promise<Subcategory> => {
    const response = await axiosInstance.post('/subcategories', data);
    return response.data.content;
  },

  // GET /api/subcategories/search-pagination
  searchPagination: async (
    pageIndex = 1,
    pageSize = 10,
    keyword = ''
  ): Promise<PaginationResponse<Subcategory>> => {
    const response = await axiosInstance.get('/subcategories/search-pagination', {
      params: { pageIndex, pageSize, keyword },
    });
    return response.data.content;
  },

  // GET /api/subcategories/:id
  getById: async (id: number): Promise<Subcategory> => {
    const response = await axiosInstance.get(`/subcategories/${id}`);
    return response.data.content;
  },

  // PUT /api/subcategories/:id
  update: async (id: number, data: SubcategoryCreateRequest): Promise<Subcategory> => {
    const response = await axiosInstance.put(`/subcategories/${id}`, data);
    return response.data.content;
  },

  // DELETE /api/subcategories/:id
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/subcategories/${id}`);
    return response.data.content;
  },

  // POST /api/subcategories/create-group
  createGroup: async (data: SubcategoryGroupRequest): Promise<SubcategoryGroup> => {
    const response = await axiosInstance.post('/subcategories/create-group', data);
    return response.data.content;
  },

  // PUT /api/subcategories/update-group/:id
  updateGroup: async (id: number, data: SubcategoryGroupRequest): Promise<SubcategoryGroup> => {
    const response = await axiosInstance.put(`/subcategories/update-group/${id}`, data);
    return response.data.content;
  },

  // POST /api/subcategories/upload-group-image/:groupId
  uploadGroupImage: async (
    groupId: number,
    formData: FormData
  ): Promise<{ message: string; imageUrl?: string }> => {
    const response = await axiosInstance.post(`/subcategories/upload-group-image/${groupId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.content;
  },
};

export default subcategoryApi;
