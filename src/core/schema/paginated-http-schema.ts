import {z} from 'zod';

export const paginatedHttpSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().min(25).max(100).default(25)
});