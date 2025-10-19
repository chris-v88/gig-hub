import { z } from 'zod';

export const signupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      user: z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        country: z.string().nullable(),
        role: z.string(),
        profile_image: z.string().nullable(),
        created_at: z.string(),
      }),
      accessToken: z.string(),
    })
    .optional(),
  errors: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const signupErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      user: z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        country: z.string().nullable(),
        role: z.string(),
        profile_image: z.string().nullable(),
        created_at: z.string(),
      }),
      accessToken: z.string(),
    })
    .optional(),
  errors: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const loginErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SignupErrorResponse = z.infer<typeof signupErrorResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginErrorResponse = z.infer<typeof loginErrorResponseSchema>;
