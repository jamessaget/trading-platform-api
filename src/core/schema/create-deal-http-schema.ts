import {z} from 'zod';

export const createDealHttpSchema = z.object({
  name: z.string(),
  currency: z.string().max(255),
  status: z.enum(['available', 'sold']),
  total_price: z.number(),
  discount: z.object({
    type: z.enum(['percentage','flat']),
    amount: z.number()
  }).optional(),
  deal_items: z.array(
    z.object({
      name: z.string(),
      price: z.number()
    })
  )
});