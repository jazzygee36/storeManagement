import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .min(3, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .min(3, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const staffLoginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
