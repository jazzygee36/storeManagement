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

export const addProductSchema = z.object({
  productName: z.string().min(3, 'Product is required'),
  buyingPrice: z.string().min(2, 'Buying price is required'),
  qtyBought: z.string().min(1, 'Quantity bought is required'),
  salesPrice: z.string().min(1, 'Selling price is required'),
  qtySold: z.string().min(1, 'Quantity sold is required'),
  expired: z.string().min(1, 'Expired date is required'),
  availability: z.string().min(3, 'Availability is required'),
});
