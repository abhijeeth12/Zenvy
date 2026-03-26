import { z } from 'zod';

export const createOrderSchema = z.object({
  batchId: z.string().cuid(),
  items: z.array(
    z.object({
      menuItemId: z.string().cuid(),
      quantity: z.number().int().min(1).max(10),
    })
  ).min(1, 'At least one item is required'),
  driverTip: z.number().min(0).default(0),
  paymentMethod: z.enum(['WALLET', 'COD']).default('WALLET'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
