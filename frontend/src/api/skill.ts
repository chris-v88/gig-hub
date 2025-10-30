import { axiosInstance } from './axiosInstance';

export type Skill = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  UserSkills?: {
    user: {
      id: number;
      name: string;
      username?: string;
      profile_image?: string;
    };
  }[];
  _count?: {
    UserSkills: number;
  };
};

export type SkillCreateRequest = {
  name: string;
  description?: string;
};

export type SkillUpdateRequest = {
  name?: string;
  description?: string;
};

export type PaginationResponse<T> = {
  data: T[];
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
};

export const skillApi = {
  // GET /api/skills
  getAll: async (): Promise<Skill[]> => {
    const response = await axiosInstance.get('/skills');
    return response.data.content;
  },

  // POST /api/skills
  create: async (data: SkillCreateRequest): Promise<Skill> => {
    const response = await axiosInstance.post('/skills', data);
    return response.data.content;
  },

  // GET /api/skills/search-pagination
  searchPagination: async (
    pageIndex = 1,
    pageSize = 10,
    keyword = ''
  ): Promise<PaginationResponse<Skill>> => {
    const response = await axiosInstance.get('/skills/search-pagination', {
      params: { pageIndex, pageSize, keyword },
    });
    return response.data.content;
  },

  // GET /api/skills/:id
  getById: async (id: number): Promise<Skill> => {
    const response = await axiosInstance.get(`/skills/${id}`);
    return response.data.content;
  },

  // PUT /api/skills/:id
  update: async (id: number, data: SkillUpdateRequest): Promise<Skill> => {
    const response = await axiosInstance.put(`/skills/${id}`, data);
    return response.data.content;
  },

  // DELETE /api/skills/:id
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/skills/${id}`);
    return response.data.content;
  },
};

export default skillApi;
