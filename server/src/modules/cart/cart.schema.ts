import { z } from 'zod';

export const addToCartSchema = z.object({
  batchId: z.string().min(1, 'Batch ID is required'),
  menuItemId: z.string().min(1, 'MenuItem ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
