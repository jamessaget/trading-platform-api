import {z} from 'zod';

export const updateDealHttpSchema = z.object({
  name: z.string().optional(),
  currency: z.string().max(255).optional(),
  status: z.enum(['available', 'sold']).optional(),
  discount: z.object({
    type: z.enum(['percentage','flat']),
    amount: z.number()
  }).optional().nullable(),
  deal_items: z.array(
    z.object({
      name: z.string(),
      price: z.number()
    })
  ).min(1).optional()
}).strict();