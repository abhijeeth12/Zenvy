import { z } from 'zod';

export const createBatchSchema = z.object({
  restaurantId: z.string().cuid(),
  closureMinutes: z.number().int().min(15).max(90),
  maxParticipants: z.number().int().min(2).max(20).default(10),
});

export const listBatchesSchema = z.object({
  sort: z.enum(['closing_soon', 'highest_savings', 'proximity', 'newest']).default('closing_soon'),
  cuisine: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'ORDERED', 'IN_TRANSIT', 'DELIVERED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const intelligenceQuerySchema = z.object({
  restaurantId: z.string().cuid(),
  closureMinutes: z.coerce.number().int().min(15).max(90),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type ListBatchesInput = z.infer<typeof listBatchesSchema>;
export type IntelligenceQuery = z.infer<typeof intelligenceQuerySchema>;
