import { z } from 'zod';

// Category schemas
export const categoryFormSchema = z.object({
  tenLoaiCongViec: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Subcategory schemas
export const subcategoryFormSchema = z.object({
  tenChiTiet: z
    .string()
    .min(1, 'Subcategory name is required')
    .max(100, 'Subcategory name must be less than 100 characters'),
});

export type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

export const subcategoryGroupFormSchema = z.object({
  tenNhom: z
    .string()
    .min(1, 'Group name is required')
    .max(100, 'Group name must be less than 100 characters'),
  hinhAnh: z.string().optional(),
  maLoaiCongviec: z.number().min(1, 'Category is required'),
  dsChiTietLoai: z.array(z.number()).min(1, 'At least one subcategory must be selected'),
});

export type SubcategoryGroupFormData = z.infer<typeof subcategoryGroupFormSchema>;

// User schemas
export const userCreateFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  role: z.enum(['user', 'admin']).default('user'),
  skill: z.array(z.string()).optional(),
  certification: z.array(z.string()).optional(),
});

export type UserCreateFormData = z.infer<typeof userCreateFormSchema>;

export const userUpdateFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  country: z.string().max(50, 'Country must be less than 50 characters').optional(),
  skill: z.array(z.string()).optional(),
  certification: z.array(z.string()).optional(),
});

export type UserUpdateFormData = z.infer<typeof userUpdateFormSchema>;

// Order schemas
export const orderCreateFormSchema = z.object({
  maCongViec: z.number().min(1, 'Gig is required'),
  maNguoiThue: z.number().min(1, 'Buyer is required'),
  ngayThue: z.string().optional(),
  hoanThanh: z.boolean().default(false),
});

export type OrderCreateFormData = z.infer<typeof orderCreateFormSchema>;

export const orderUpdateFormSchema = z.object({
  maCongViec: z.number().min(1, 'Gig is required').optional(),
  maNguoiThue: z.number().min(1, 'Buyer is required').optional(),
  ngayThue: z.string().optional(),
  hoanThanh: z.boolean().optional(),
});

export type OrderUpdateFormData = z.infer<typeof orderUpdateFormSchema>;

// Review schemas
export const reviewFormSchema = z.object({
  maCongViec: z.number().min(1, 'Gig is required'),
  maNguoiBinhLuan: z.number().min(1, 'Reviewer is required'),
  noiDung: z
    .string()
    .min(10, 'Review content must be at least 10 characters')
    .max(1000, 'Review content must be less than 1000 characters'),
  saoBinhLuan: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

export const reviewUpdateFormSchema = z.object({
  noiDung: z
    .string()
    .min(10, 'Review content must be at least 10 characters')
    .max(1000, 'Review content must be less than 1000 characters')
    .optional(),
  saoBinhLuan: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
});

export type ReviewUpdateFormData = z.infer<typeof reviewUpdateFormSchema>;

// Skill schemas
export const skillFormSchema = z.object({
  tenSkill: z
    .string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters'),
  moTa: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export type SkillFormData = z.infer<typeof skillFormSchema>;

// Search schemas
export const searchFormSchema = z.object({
  keyword: z.string().optional(),
  pageIndex: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(50).default(10),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;
