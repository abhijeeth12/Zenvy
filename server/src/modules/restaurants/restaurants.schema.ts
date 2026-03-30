import { z } from 'zod';

export const listRestaurantsSchema = z.object({
  search: z.string().optional(),
  cuisine: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  cuisine: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  address: z.string().min(5),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const ensureRestaurantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  cuisine: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
});

export type EnsureRestaurantInput = z.infer<typeof ensureRestaurantSchema>;

export const createMenuItemSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  batchPrice: z.number().positive(),
  category: z.string().default('Main'),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type ListRestaurantsInput = z.infer<typeof listRestaurantsSchema>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
