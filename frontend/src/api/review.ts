import { axiosInstance } from './axiosInstance';

export type Review = {
  id: number;
  order_id: number;
  gig_id: number;
  reviewer_id: number;
  reviewee_id: number;
  reviewer_role: 'buyer' | 'seller';
  reviewee_role: 'buyer' | 'seller';
  rating: number;
  content: string;
  is_public: boolean;
  review_date: string;
  created_at: string;
  updated_at?: string;
  reviewer?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
  reviewee?: {
    id: number;
    name: string;
    username?: string;
  };
  gig?: {
    id: number;
    title: string;
  };
};

export type ReviewCreateRequest = {
  maCongViec: number;
  maNguoiBinhLuan: number;
  noiDung: string;
  saoBinhLuan: number;
};

export type ReviewUpdateRequest = {
  noiDung?: string;
  saoBinhLuan?: number;
};

export const reviewApi = {
  // GET /api/reviews
  getAll: async (): Promise<Review[]> => {
    const response = await axiosInstance.get('/reviews');
    return response.data.content;
  },

  // POST /api/reviews
  create: async (data: ReviewCreateRequest): Promise<Review> => {
    const response = await axiosInstance.post('/reviews', data);
    return response.data.content;
  },

  // PUT /api/reviews/:id
  update: async (id: number, data: ReviewUpdateRequest): Promise<Review> => {
    const response = await axiosInstance.put(`/reviews/${id}`, data);
    return response.data.content;
  },

  // DELETE /api/reviews/:id
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/reviews/${id}`);
    return response.data.content;
  },

  // GET /api/reviews/by-gig/:gigId
  getByGig: async (gigId: number): Promise<Review[]> => {
    const response = await axiosInstance.get(`/reviews/by-gig/${gigId}`);
    return response.data.content;
  },
};

export default reviewApi;
