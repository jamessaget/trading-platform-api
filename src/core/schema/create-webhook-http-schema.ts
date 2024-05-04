import {z} from 'zod';

export const createWebhookHttpSchema = z.object({
  name: z.string().max(255),
  webhook_url: z.string().max(255),
});