import { z } from 'zod';

// Review form validation
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  content: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must not exceed 1000 characters'),
  communication_rating: z.number().min(1).max(5).optional(),
  service_quality_rating: z.number().min(1).max(5).optional(),
  delivery_time_rating: z.number().min(1).max(5).optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Legacy comment schema (keeping for compatibility)
export const commentSchema = z.object({
  noiDung: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must not exceed 1000 characters'),
});

export type CommentFormData = z.infer<typeof commentSchema>;

// API Response validation schemas
export const gigUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  profile_image: z.string().optional(),
  description: z.string().optional(),
  total_orders_completed: z.number().optional(),
  created_at: z.string().optional(),
});

export const gigCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const gigReviewSchema = z.object({
  id: z.number(),
  rating: z.number(),
  title: z.string().optional(),
  content: z.string(),
  communication_rating: z.number().optional(),
  service_quality_rating: z.number().optional(),
  delivery_time_rating: z.number().optional(),
  review_date: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    profile_image: z.string().optional(),
  }),
});

export const gigDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  short_description: z.string().optional(),
  description: z.string(),
  price: z.number(),
  starting_price: z.number(),
  delivery_time: z.number(),
  revisions: z.number().optional(),
  status: z.string().optional(),
  image_url: z.string().optional(),
  orders_completed: z.number().optional(),
  average_rating: z.number(),
  total_reviews: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  images: z.array(z.string()).optional(),
  user: gigUserSchema,
  category: gigCategorySchema,
  reviews: z.array(gigReviewSchema).optional(),
});

export const gigDetailResponseSchema = z.object({
  status: z.string(),
  statusCode: z.number(),
  data: gigDetailSchema,
  message: z.string(),
});

export const createReviewResponseSchema = z.object({
  status: z.string(),
  statusCode: z.number(),
  data: gigReviewSchema,
  message: z.string(),
});
