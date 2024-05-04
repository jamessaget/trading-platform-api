import {z} from 'zod';

export const oauthTokenHttpSchema = z.object({
  username: z.string().max(255),
  password: z.string().max(255),
  grant_type: z.enum(['password'])
});