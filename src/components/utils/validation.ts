import { z } from 'zod';

export const registerSchema = z.object({
  companyName: z.string().min(3, 'Company name is required'),
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

export const createStaffSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  phoneNumber: z.string().min(11, 'Password must be at least 11 numbers long'),
});

export const addProductSchema = z.object({
  productName: z.string().min(3, 'Product is required'),
  unitPrice: z.string().min(2, 'Buying price is required'),
  qtyBought: z.string().min(1, 'Quantity bought is required'),
  salesPrice: z.string().min(1, 'Selling price is required'),
  exp: z
    .string()
    .optional()
    .refine(
      (value) => {
        // Allow an empty string or a valid date
        return (
          value === '' || (value !== undefined && !isNaN(Date.parse(value)))
        );
      },
      { message: 'Invalid date format' }
    ),
});

export const salesSchema = z.object({
  productName: z.string().nonempty('Product name is required'),
  sellingPrice: z.string().regex(/^\d+$/, 'sellingPrice is required'),
  qtyBuy: z.string().regex(/^\d+$/, 'Quantity must be a valid number'),
  totalPrice: z.string().nonempty('Total price is required'),
});
