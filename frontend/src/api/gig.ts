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

export type GigUser = {
  id: number;
  name: string;
  username: string;
  profile_image?: string;
  description?: string;
  total_orders_completed?: number;
  created_at?: string;
};

export type GigCategory = {
  id: number;
  name: string;
};

export type GigReview = {
  id: number;
  rating: number;
  title?: string;
  content: string;
  communication_rating?: number;
  service_quality_rating?: number;
  delivery_time_rating?: number;
  review_date: string;
  user: {
    id: number;
    name: string;
    username: string;
    profile_image?: string;
  };
};

export type Gig = {
  id: number;
  title: string;
  short_description?: string;
  description: string;
  price: number;
  starting_price: number;
  delivery_time: number;
  revisions?: number;
  status?: string;
  image_url?: string;
  orders_completed?: number;
  average_rating: number;
  total_reviews: number;
  created_at?: string;
  updated_at?: string;
  images?: string[];
  user: GigUser;
  category: GigCategory;
  reviews?: GigReview[];
};

export type GigSearchResponse = {
  status: string;
  statusCode: number;
  data: {
    gigs: Gig[];
    total: number;
    page: number;
    totalPages: number;
  };
  message: string;
};

export type GigDetailResponse = {
  status: string;
  statusCode: number;
  data: Gig;
  message: string;
};

export type CreateReviewData = {
  rating: number;
  title?: string;
  content: string;
  communication_rating?: number;
  service_quality_rating?: number;
  delivery_time_rating?: number;
};

export type CreateReviewResponse = {
  status: string;
  statusCode: number;
  data: GigReview;
  message: string;
};

export const gigAPI = {
  search: async (params: SearchParams): Promise<GigSearchResponse> => {
    const response = await api.get('/gigs/search', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<GigDetailResponse> => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  createReview: async (
    gigId: string | number,
    reviewData: CreateReviewData
  ): Promise<CreateReviewResponse> => {
    const response = await api.post(`/gigs/${gigId}/reviews`, reviewData);
    return response.data;
  },
};

export default api;
