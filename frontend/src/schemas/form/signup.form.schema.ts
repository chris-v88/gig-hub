import { z } from 'zod';

export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
      .toLowerCase(),

    email: z.string().email('Please enter a valid email address').toLowerCase(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
      .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
      .regex(/(?=.*\d)/, 'Password must contain at least one number'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    country: z
      .string()
      .min(2, 'Please select a country')
      .max(100, 'Country name cannot exceed 100 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;
