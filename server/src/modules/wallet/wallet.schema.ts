import { z } from 'zod';

export const addFundsSchema = z.object({
  amount: z.number().positive().min(5, "Minimum add amount is $5"),
});

export type AddFundsInput = z.infer<typeof addFundsSchema>;
