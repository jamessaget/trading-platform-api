import {z} from 'zod';

export const updateDealHttpSchema = z.object({
  name: z.string().optional(),
  currency: z.string().max(255).optional(),
  status: z.enum(['available', 'sold']).optional(),
});