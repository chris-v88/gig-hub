import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type SearchParams = {
  query?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type GigSearchResponse = {
  status: string;
  statusCode: number;
  data: {
    gigs: Array<{
      id: number;
      title: string;
      description: string;
      starting_price: number;
      delivery_time: number;
      images?: string[];
      user: {
        id: number;
        name: string;
        username: string;
        profile_image?: string;
      };
      category: {
        id: number;
        name: string;
      };
    }>;
    total: number;
    page: number;
    totalPages: number;
  };
  message: string;
};

export const gigAPI = {
  search: async (params: SearchParams): Promise<GigSearchResponse> => {
    const response = await api.get('/gigs/search', { params });
    return response.data;
  },
};

export default api;
